/**
 * Database queries with robust two-layer error handling for DBIT ProjectTrack
 */

import { db } from './index.ts';
import { proposals, stageGates, feedbackHistory, historicalProjects, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_HISTORICAL_PROJECTS, INITIAL_PROPOSALS } from '../data/mockData.ts';

/**
 * Seeds initial database data if tables are empty
 */
export async function seedInitialDataIfNeeded() {
  try {
    const existingHist = await db.select().from(historicalProjects).limit(1);
    if (existingHist.length === 0) {
      console.log('Seeding historical projects into Cloud SQL PostgreSQL...');
      for (const hp of INITIAL_HISTORICAL_PROJECTS) {
        await db.insert(historicalProjects).values({
          id: hp.id,
          code: hp.code,
          title: hp.title,
          abstract: hp.abstract,
          domain: hp.domain,
          academicYear: hp.academicYear,
          classCohort: hp.classCohort,
          groupMembers: hp.groupMembers,
          guideName: hp.guideName,
          techStack: hp.techStack,
          githubUrl: hp.githubUrl,
          finalRating: hp.finalRating,
          status: hp.status
        }).onConflictDoNothing();
      }
    }

    const existingProps = await db.select().from(proposals).limit(1);
    if (existingProps.length === 0) {
      console.log('Seeding initial proposals into Cloud SQL PostgreSQL...');
      for (const p of INITIAL_PROPOSALS) {
        await db.insert(proposals).values({
          id: p.id,
          projectId: p.projectId,
          trackNo: p.trackNo,
          groupNo: p.groupNo,
          academicYear: p.academicYear,
          cohort: p.cohort,
          title: p.title,
          domain: p.domain,
          abstract: p.abstract,
          problemStatement: p.problemStatement,
          techStack: p.techStack,
          teamMembers: p.teamMembers,
          guideName: p.guideName,
          coordinatorName: p.coordinatorName,
          status: p.status,
          similarityScore: p.similarityData?.overallScore || 0,
          sbertScore: p.similarityData?.sbertScore || 0,
          tfidfScore: p.similarityData?.tfidfScore || 0,
          similarityExplanation: p.similarityData?.explanation,
          conflictWithId: p.conflictWithId,
          lockedTopic: p.lockedTopic,
          pitchDefenseContent: p.pitchDefense?.content,
          pitchDifferentiator: p.pitchDefense?.keyDifferentiator,
          pitchTargetStack: p.pitchDefense?.targetStack,
          githubOwner: p.githubData?.owner || 'rishiks1207',
          githubRepo: p.githubData?.repo || 'dbit-project-track',
        }).onConflictDoNothing();

        // Seed stage gates
        if (p.stageGates && p.stageGates.length > 0) {
          for (const sg of p.stageGates) {
            await db.insert(stageGates).values({
              id: sg.id,
              proposalId: p.id,
              title: sg.title,
              phase: sg.phase,
              weekRange: sg.weekRange,
              status: sg.status,
              dueDate: sg.dueDate,
              submissionLink: sg.submissionLink,
              submissionNotes: sg.submissionNotes,
              submissionDate: sg.submissionDate,
              guideApprovedBy: sg.guideApprovedBy,
              guideApprovedDate: sg.guideApprovedDate,
              deliverableType: sg.deliverableType,
            }).onConflictDoNothing();
          }
        }

        // Seed feedback
        if (p.feedbackHistory && p.feedbackHistory.length > 0) {
          for (const fb of p.feedbackHistory) {
            await db.insert(feedbackHistory).values({
              id: fb.id,
              proposalId: p.id,
              authorName: fb.authorName,
              authorRole: fb.authorRole,
              stage: fb.stage,
              status: fb.status,
              remarks: fb.remarks,
              actionItems: fb.actionItems || [],
            }).onConflictDoNothing();
          }
        }
      }
    }
  } catch (err) {
    console.warn('Seed operation warning (non-fatal):', err);
  }
}

export async function getAllProposals() {
  try {
    const propRows = await db.select().from(proposals).orderBy(desc(proposals.createdAt));
    const allStageGates = await db.select().from(stageGates);
    const allFeedback = await db.select().from(feedbackHistory).orderBy(desc(feedbackHistory.timestamp));

    return propRows.map(p => ({
      ...p,
      stageGates: allStageGates.filter(sg => sg.proposalId === p.id),
      feedbackHistory: allFeedback.filter(fb => fb.proposalId === p.id)
    }));
  } catch (error) {
    console.error('Failed to get proposals from database:', error);
    throw new Error('Database query failed for proposals.', { cause: error });
  }
}

export async function getAllHistoricalProjects() {
  try {
    return await db.select().from(historicalProjects);
  } catch (error) {
    console.error('Failed to get historical projects from database:', error);
    throw new Error('Database query failed for historical projects.', { cause: error });
  }
}

export async function insertProposal(proposalData: any) {
  try {
    const inserted = await db.insert(proposals).values(proposalData).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to insert proposal into database:', error);
    throw new Error('Database insert failed for proposal.', { cause: error });
  }
}

export async function updateProposalStatus(id: string, status: string, lockedTopic?: boolean) {
  try {
    const values: any = { status, updatedAt: new Date() };
    if (lockedTopic !== undefined) values.lockedTopic = lockedTopic;
    return await db.update(proposals).set(values).where(eq(proposals.id, id)).returning();
  } catch (error) {
    console.error(`Failed to update proposal ${id} in database:`, error);
    throw new Error('Database update failed for proposal status.', { cause: error });
  }
}

export async function updateStageGate(id: string, updates: any) {
  try {
    return await db.update(stageGates).set(updates).where(eq(stageGates.id, id)).returning();
  } catch (error) {
    console.error(`Failed to update stage gate ${id} in database:`, error);
    throw new Error('Database update failed for stage gate.', { cause: error });
  }
}

export async function insertFeedback(feedbackData: any) {
  try {
    return await db.insert(feedbackHistory).values(feedbackData).returning();
  } catch (error) {
    console.error('Failed to insert feedback into database:', error);
    throw new Error('Database insert failed for feedback.', { cause: error });
  }
}
