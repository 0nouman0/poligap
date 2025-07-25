import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sql = neon(process.env.DATABASE_URL);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        company VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Analysis history table (unified for both policy analysis and risk assessment)
    await sql`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        document_name VARCHAR(255),
        document_type VARCHAR(100),
        analysis_type VARCHAR(50) DEFAULT 'policy_analysis',
        industry VARCHAR(100),
        frameworks TEXT[],
        organization_details JSONB,
        analysis_results JSONB,
        gaps_found INTEGER DEFAULT 0,
        compliance_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Migrate data from old table to new table if needed
    try {
      const oldTableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'policy_analysis_history'
        )
      `;
      
      if (oldTableExists[0].exists) {
        console.log('Migrating data from policy_analysis_history to analysis_history...');
        
        // Check if there's data in the old table that's not in the new table
        const oldData = await sql`
          SELECT * FROM policy_analysis_history 
          WHERE id NOT IN (SELECT id FROM analysis_history WHERE id IS NOT NULL)
        `;
        
        if (oldData.length > 0) {
          // Migrate the data
          for (const record of oldData) {
            await sql`
              INSERT INTO analysis_history 
              (id, user_id, document_name, document_type, analysis_type, industry, frameworks, organization_details, analysis_results, gaps_found, compliance_score, created_at)
              VALUES (
                ${record.id}, 
                ${record.user_id}, 
                ${record.document_name}, 
                ${record.document_type}, 
                ${record.analysis_type || 'policy_analysis'}, 
                ${record.industry}, 
                ${record.frameworks}, 
                ${record.organization_details || {}}, 
                ${record.analysis_results}, 
                ${record.gaps_found || 0}, 
                ${record.compliance_score || 0}, 
                ${record.created_at}
              )
              ON CONFLICT (id) DO NOTHING
            `;
          }
          console.log(`Migrated ${oldData.length} records from policy_analysis_history to analysis_history`);
          
          // Update the sequence to continue from the highest ID
          await sql`
            SELECT setval('analysis_history_id_seq', (SELECT MAX(id) FROM analysis_history))
          `;
          console.log('Updated sequence for analysis_history table');
        }
      }
    } catch (migrationError) {
      console.log('Migration not needed or already completed:', migrationError.message);
    }

    // Always ensure the sequence is correct
    try {
      await sql`
        SELECT setval('analysis_history_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM analysis_history))
      `;
      console.log('Sequence updated for analysis_history table');
    } catch (sequenceError) {
      console.log('Sequence update error:', sequenceError.message);
    }
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Poligap API is running' });
});

// Sign up
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, first_name, last_name, company } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, company)
      VALUES (${email}, ${passwordHash}, ${first_name || null}, ${last_name || null}, ${company || null})
      RETURNING id, email, first_name, last_name, company, created_at
    `;

    const user = newUser[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        company: user.company,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in
app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name, company, created_at
      FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        company: user.company,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const users = await sql`
      SELECT id, email, first_name, last_name, company, created_at, updated_at
      FROM users WHERE id = ${req.user.userId}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: users[0]
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, company } = req.body;
    
    const updatedUser = await sql`
      UPDATE users 
      SET first_name = ${first_name || null}, 
          last_name = ${last_name || null}, 
          company = ${company || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.user.userId}
      RETURNING id, email, first_name, last_name, company, created_at, updated_at
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign out (client-side token removal is sufficient, but this endpoint can be used for logging)
app.post('/auth/signout', authenticateToken, (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

// Password reset (basic implementation)
app.post('/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const users = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If an account with this email exists, you will receive password reset instructions.' });
    }

    // TODO: Implement actual email sending logic here
    // For now, just return success message
    res.json({ message: 'If an account with this email exists, you will receive password reset instructions.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Save policy analysis to history
app.post('/api/analysis/save', authenticateToken, async (req, res) => {
  try {
    console.log('Received analysis save request:', {
      body_keys: Object.keys(req.body),
      document_name: req.body.document_name,
      document_type: req.body.document_type,
      analysis_results_present: !!req.body.analysis_results,
      user_id: req.user.userId
    });

    const { 
      document_name, 
      document_type, 
      analysis_type,
      industry, 
      frameworks, 
      organization_details,
      analysis_results, 
      gaps_found, 
      compliance_score 
    } = req.body;

    console.log('Extracted request data:', {
      document_name,
      document_type,
      analysis_type,
      industry,
      frameworks: frameworks?.length || 0,
      organization_details: !!organization_details,
      analysis_results: !!analysis_results,
      gaps_found,
      compliance_score
    });

    if (!document_name || !analysis_results) {
      console.log('Validation failed:', {
        document_name_missing: !document_name,
        document_name_value: document_name,
        document_name_type: typeof document_name,
        document_name_length: document_name ? document_name.length : 0,
        analysis_results_missing: !analysis_results,
        analysis_results_type: typeof analysis_results,
        analysis_results_value: analysis_results,
        analysis_results_keys: analysis_results ? Object.keys(analysis_results) : 'N/A'
      });
      return res.status(400).json({ 
        message: 'Document name and analysis results are required',
        details: {
          document_name_provided: !!document_name,
          analysis_results_provided: !!analysis_results
        }
      });
    }

    const savedAnalysis = await sql`
      INSERT INTO analysis_history 
      (user_id, document_name, document_type, analysis_type, industry, frameworks, organization_details, analysis_results, gaps_found, compliance_score)
      VALUES (
        ${req.user.userId}, 
        ${document_name}, 
        ${document_type || null}, 
        ${analysis_type || 'policy_analysis'}, 
        ${industry || null}, 
        ${frameworks || []}, 
        ${organization_details || {}},
        ${JSON.stringify(analysis_results)}, 
        ${gaps_found || 0}, 
        ${compliance_score || 0}
      )
      RETURNING id, document_name, created_at
    `;

    res.status(201).json({
      message: 'Analysis saved to history successfully',
      analysis: savedAnalysis[0]
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's analysis history
app.get('/api/analysis/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const history = await sql`
      SELECT 
        id,
        document_name,
        document_type,
        analysis_type,
        industry,
        frameworks,
        organization_details,
        gaps_found,
        compliance_score,
        created_at
      FROM analysis_history 
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalCount = await sql`
      SELECT COUNT(*) as count 
      FROM analysis_history 
      WHERE user_id = ${req.user.userId}
    `;

    res.json({
      history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount[0].count),
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific analysis details
app.get('/api/analysis/history/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await sql`
      SELECT * FROM analysis_history 
      WHERE id = ${id} AND user_id = ${req.user.userId}
    `;

    if (analysis.length === 0) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      analysis: {
        ...analysis[0],
        analysis_results: analysis[0].analysis_results
      }
    });
  } catch (error) {
    console.error('Get analysis details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete analysis from history
app.delete('/api/analysis/history/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnalysis = await sql`
      DELETE FROM analysis_history 
      WHERE id = ${id} AND user_id = ${req.user.userId}
      RETURNING id, document_name
    `;

    if (deletedAnalysis.length === 0) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      message: 'Analysis deleted successfully',
      analysis: deletedAnalysis[0]
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Poligap API server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected to Neon' : 'Not configured'}`);
  });
};

startServer().catch(console.error);
