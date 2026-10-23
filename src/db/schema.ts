import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Proposals table
export const proposals = pgTable('proposals', {
  id: text('id').primaryKey(),
  projectId: text('project_id'),
  trackNo: integer('track_no').notNull().default(7),
  groupNo: integer('group_no').notNull().default(5),
  academicYear: text('academic_year').notNull().default('2026-27'),
  cohort: text('cohort').notNull().default('SE COMPS C (Batch A)'),
  title: text('title').notNull(),
  domain: text('domain').notNull().default('AI/ML'),
  abstract: text('abstract').notNull(),
  problemStatement: text('problem_statement'),
  techStack: jsonb('tech_stack').$type<string[]>().default([]),
  teamMembers: jsonb('team_members').$type<Array<{ name: string; rollNo: string; email: string; isLeader?: boolean }>>().default([]),
  guideName: text('guide_name').default('Mr. Nazareth Remedios'),
  coordinatorName: text('coordinator_name').default('Prof. Meenal Kulkarni'),
  status: text('status').notNull().default('under_guide_review'),
  similarityScore: doublePrecision('similarity_score').default(0),
  sbertScore: doublePrecision('sbert_score').default(0),
  tfidfScore: doublePrecision('tfidf_score').default(0),
  similarityExplanation: text('similarity_explanation'),
  conflictWithId: text('conflict_with_id'),
  lockedTopic: boolean('locked_topic').default(false),
  pitchDefenseContent: text('pitch_defense_content'),
  pitchDifferentiator: text('pitch_differentiator'),
  pitchTargetStack: text('pitch_target_stack'),
  githubOwner: text('github_owner').default('rishiks1207'),
  githubRepo: text('github_repo').default('dbit-project-track'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stage Gate Milestones table
export const stageGates = pgTable('stage_gates', {
  id: text('id').primaryKey(),
  proposalId: text('proposal_id').references(() => proposals.id).notNull(),
  title: text('title').notNull(),
  phase: text('phase').notNull(),
  weekRange: text('week_range'),
  status: text('status').notNull().default('pending'),
  dueDate: text('due_date'),
  submissionLink: text('submission_link'),
  submissionNotes: text('submission_notes'),
  submissionDate: text('submission_date'),
  guideApprovedBy: text('guide_approved_by'),
  guideApprovedDate: text('guide_approved_date'),
  deliverableType: text('deliverable_type').default('architecture_spec'),
});

// Feedback & Audit Log table
export const feedbackHistory = pgTable('feedback_history', {
  id: text('id').primaryKey(),
  proposalId: text('proposal_id').references(() => proposals.id).notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  stage: text('stage').notNull(),
  status: text('status').notNull(),
  remarks: text('remarks').notNull(),
  actionItems: jsonb('action_items').$type<string[]>().default([]),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Historical Project Archive table
export const historicalProjects = pgTable('historical_projects', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  title: text('title').notNull(),
  abstract: text('abstract').notNull(),
  domain: text('domain').notNull(),
  academicYear: text('academic_year').notNull(),
  classCohort: text('class_cohort').notNull(),
  groupMembers: jsonb('group_members').$type<string[]>().default([]),
  guideName: text('guide_name').notNull(),
  techStack: jsonb('tech_stack').$type<string[]>().default([]),
  githubUrl: text('github_url'),
  finalRating: text('final_rating'),
  status: text('status').default('Archived'),
});

// Relations
export const proposalsRelations = relations(proposals, ({ many }) => ({
  stageGates: many(stageGates),
  feedback: many(feedbackHistory),
}));

export const stageGatesRelations = relations(stageGates, ({ one }) => ({
  proposal: one(proposals, {
    fields: [stageGates.proposalId],
    references: [proposals.id],
  }),
}));

export const feedbackRelations = relations(feedbackHistory, ({ one }) => ({
  proposal: one(proposals, {
    fields: [feedbackHistory.proposalId],
    references: [proposals.id],
  }),
}));
