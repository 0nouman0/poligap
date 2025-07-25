import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

export default defineConfig({
  schema: './schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
