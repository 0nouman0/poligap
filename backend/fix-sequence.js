import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function fixSequence() {
  try {
    console.log('Fixing sequence for analysis_history table...');
    
    // Get the max ID
    const maxId = await sql`SELECT COALESCE(MAX(id), 0) as max_id FROM analysis_history`;
    console.log('Current max ID:', maxId[0].max_id);
    
    // Set the sequence to the next value
    const nextId = maxId[0].max_id + 1;
    await sql`SELECT setval('analysis_history_id_seq', ${nextId})`;
    
    console.log(`Sequence updated to start from ${nextId}`);
    console.log('✅ Sequence fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing sequence:', error);
  }
}

fixSequence();
