import { pgTable, serial, varchar, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  company: varchar('company', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Analysis history table (unified for both policy analysis and risk assessment)
export const analysisHistory = pgTable('analysis_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  documentName: varchar('document_name', { length: 255 }),
  documentType: varchar('document_type', { length: 100 }),
  analysisType: varchar('analysis_type', { length: 50 }).default('policy_analysis'),
  industry: varchar('industry', { length: 100 }),
  frameworks: text('frameworks').array(),
  organizationDetails: jsonb('organization_details'),
  analysisResults: jsonb('analysis_results'),
  gapsFound: integer('gaps_found').default(0),
  complianceScore: integer('compliance_score').default(0),
  createdAt: timestamp('created_at').defaultNow()
});
