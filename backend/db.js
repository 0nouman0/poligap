import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import * as schema from './schema.js';

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

// Create the database connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Export the raw sql connection for migration purposes
export { sql };
