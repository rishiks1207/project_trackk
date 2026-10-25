/**
 * Database queries with robust two-layer error handling for DBIT ProjectTrack
 */

import { db } from './index.ts';
import { proposals, stageGates, feedbackHistory, historicalProjects, users, guideMessages } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_HISTORICAL_PROJECTS, INITIAL_PROPOSALS } from '../data/mockData.ts';

export const SEED_USERS = [
  {
    uid: 'usr-admin-01',
    email: 'admin@dbit.in',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
    department: 'Computer Engineering',
    cohort: 'System Administrator'
  },
  {
    uid: 'usr-coord-01',
    email: 'coordinator@dbit.in',
    password: 'coord123',
    name: 'Prof. Meenal Kulkarni',
    role: 'coordinator',
    department: 'Computer Engineering',
    cohort: 'SE/TE Project Coordinator'
  },
  {
    uid: 'usr-guide-01',
    email: 'guide@dbit.in',
    password: 'guide123',
    name: 'Mr. Nazareth Remedios',
    role: 'guide',
    department: 'Computer Engineering',
    cohort: 'Faculty Guide',
    trackNo: 7
  },
  {
    uid: 'usr-guide-02',
    email: 'guide2@dbit.in',
    password: 'guide123',
    name: 'Ms. Harleen Kaur Plaha',
    role: 'guide',
    department: 'Computer Engineering',
    cohort: 'Faculty Guide',
    trackNo: 7
  },
  {
    uid: 'usr-stud-01',
    email: 'student@dbit.in',
    password: 'student123',
    name: 'Rishik Ezhuthachan',
    role: 'student',
    rollNo: '15',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    cohort: 'SE COMPS C (Batch A)'
  },
  {
    uid: 'usr-stud-02',
    email: 'apoorvadeep.sinha@dbit.in',
    password: 'student123',
    name: 'Apoorvadeep Sinha',
    role: 'student',
    rollNo: '16',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    cohort: 'SE COMPS C (Batch A)'
  },
  {
    uid: 'usr-stud-03',
    email: 'ron.barretto@dbit.in',
    password: 'student123',
    name: 'Ron Barretto',
    role: 'student',
    rollNo: '17',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    cohort: 'SE COMPS C (Batch A)'
  },
  {
    uid: 'usr-stud-04',
    email: 'aryan.gaikwad@dbit.in',
    password: 'student123',
    name: 'Aryan Gaikwad',
    role: 'student',
    rollNo: '18',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    cohort: 'SE COMPS C (Batch A)'
  },
  {
    uid: 'usr-stud-05',
    email: 'joshua.dsouza@dbit.in',
    password: 'student123',
    name: 'Joshua D\'souza',
    role: 'student',
    rollNo: '19',
    groupNo: 6,
    trackNo: 7,
    department: 'Computer Engineering',
    cohort: 'SE COMPS C (Batch B)'
  },
  {
    uid: 'usr-stud-06',
    email: 'siddhesh.patil@dbit.in',
    password: 'student123',
    name: 'Siddhesh Patil',
    role: 'student',
    rollNo: '20',
    groupNo: 6,
    trackNo: 7,
    department: 'Computer Engineering',
    cohort: 'SE COMPS C (Batch B)'
  }
];

/**
 * Seeds initial database data if tables are empty or adds missing seed users
 */
export async function seedInitialDataIfNeeded() {
  try {
    // 1. Seed users if not present
    for (const u of SEED_USERS) {
      await db.insert(users).values({
        uid: u.uid,
        email: u.email,
        password: u.password,
        name: u.name,
        role: u.role,
        department: u.department,
        cohort: u.cohort,
        rollNo: (u as any).rollNo,
        groupNo: (u as any).groupNo,
        trackNo: (u as any).trackNo
      }).onConflictDoNothing();
    }

    // 2. Seed historical projects
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

    // 3. Seed proposals
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

// ---------------- USER ACCOUNT QUERIES (FOR ADMIN & AUTH) ----------------

export async function authenticateUser(email: string, passwordAttempt: string) {
  try {
    const matched = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    if (matched.length === 0) {
      return null;
    }
    const user = matched[0];
    if (user.password === passwordAttempt.trim()) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  } catch (error) {
    console.error('Authentication query failed:', error);
    throw new Error('Database authentication query failed.', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    const userList = await db.select().from(users).orderBy(desc(users.createdAt));
    const allProps = await db.select().from(proposals);

    // Compute relational project linkage
    return userList.map(u => {
      let assignedCount = 0;
      let relatedProposalTitle: string | undefined;

      if (u.role === 'guide') {
        assignedCount = allProps.filter(p => p.guideName?.toLowerCase().includes(u.name.toLowerCase().split(' ')[1] || u.name.toLowerCase())).length;
      } else if (u.role === 'student' && u.groupNo) {
        const matchingProp = allProps.find(p => p.groupNo === u.groupNo);
        if (matchingProp) {
          relatedProposalTitle = matchingProp.title;
          assignedCount = 1;
        }
      } else if (u.role === 'coordinator') {
        assignedCount = allProps.length;
      }

      return {
        id: u.id,
        uid: u.uid,
        email: u.email,
        name: u.name,
        role: u.role,
        rollNo: u.rollNo,
        department: u.department,
        cohort: u.cohort,
        groupNo: u.groupNo,
        trackNo: u.trackNo,
        assignedProjectCount: assignedCount,
        relatedProposalTitle,
        createdAt: u.createdAt ? u.createdAt.toISOString() : undefined
      };
    });
  } catch (error) {
    console.error('Failed to get users from database:', error);
    throw new Error('Database query failed for users.', { cause: error });
  }
}

export async function createUserAccount(accountData: any) {
  try {
    const newUid = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const result = await db.insert(users).values({
      uid: newUid,
      email: accountData.email.trim().toLowerCase(),
      password: accountData.password || 'dbit2026',
      name: accountData.name.trim(),
      role: accountData.role,
      department: accountData.department || 'Computer Engineering',
      cohort: accountData.cohort || 'SE COMPS C (Batch A)',
      rollNo: accountData.rollNo ? String(accountData.rollNo).trim() : null,
      groupNo: accountData.groupNo ? Number(accountData.groupNo) : null,
      trackNo: accountData.trackNo ? Number(accountData.trackNo) : null,
    }).returning();

    const { password, ...safeUser } = result[0];
    return safeUser;
  } catch (error) {
    console.error('Failed to create user account in database:', error);
    throw new Error('Database insert failed for user account.', { cause: error });
  }
}

export async function updateUserPassword(id: number, newPassword: string) {
  try {
    const result = await db.update(users)
      .set({ password: newPassword.trim() })
      .where(eq(users.id, id))
      .returning();
    if (result.length === 0) return null;
    const { password, ...safeUser } = result[0];
    return safeUser;
  } catch (error) {
    console.error(`Failed to update password for user ${id}:`, error);
    throw new Error('Database update failed for user password.', { cause: error });
  }
}

export async function deleteUserAccount(id: number) {
  try {
    return await db.delete(users).where(eq(users.id, id)).returning();
  } catch (error) {
    console.error(`Failed to delete user account ${id}:`, error);
    throw new Error('Database delete failed for user account.', { cause: error });
  }
}

// ---------------- GUIDE MESSAGE QUERIES ----------------

export async function createGuideMessage(messageData: any) {
  try {
    const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const result = await db.insert(guideMessages).values({
      id,
      senderName: messageData.senderName,
      senderRole: messageData.senderRole || 'guide',
      targetGroupNo: Number(messageData.targetGroupNo),
      subject: messageData.subject.trim(),
      message: messageData.message.trim(),
      urgency: messageData.urgency || 'normal',
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to create guide message:', error);
    throw new Error('Database insert failed for guide message.', { cause: error });
  }
}

export async function getGuideMessages(groupNo?: number) {
  try {
    if (groupNo !== undefined && groupNo !== null) {
      return await db.select().from(guideMessages)
        .where(eq(guideMessages.targetGroupNo, Number(groupNo)))
        .orderBy(desc(guideMessages.timestamp));
    }
    return await db.select().from(guideMessages).orderBy(desc(guideMessages.timestamp));
  } catch (error) {
    console.error('Failed to get guide messages:', error);
    throw new Error('Database query failed for guide messages.', { cause: error });
  }
}

// ---------------- PROPOSAL & STAGE-GATE QUERIES ----------------

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
