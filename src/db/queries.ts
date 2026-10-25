/**
 * Database queries with robust multi-layer fallback error handling for DBIT ProjectTrack
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
    uid: 'usr-stud-01-personal',
    email: 'rishiks1207@gmail.com',
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

// In-memory fallback stores when Cloud SQL connection is unavailable
let memoryUsers: any[] = SEED_USERS.map((u, idx) => ({
  id: idx + 1,
  ...u,
  assignedProjectCount: u.role === 'student' && (u as any).groupNo === 5 ? 1 : 0,
  relatedProposalTitle: u.role === 'student' && (u as any).groupNo === 5 ? INITIAL_PROPOSALS[0]?.title : undefined,
  createdAt: new Date().toISOString()
}));

let memoryProposals: any[] = JSON.parse(JSON.stringify(INITIAL_PROPOSALS));
let memoryHistorical: any[] = JSON.parse(JSON.stringify(INITIAL_HISTORICAL_PROJECTS));
let memoryMessages: any[] = [
  {
    id: 'msg-seed-1',
    senderName: 'Mr. Nazareth Remedios',
    senderRole: 'guide',
    targetGroupNo: 5,
    subject: 'Stage 1 Architecture Review Sign-Off',
    message: 'Excellent progress on the SBERT threshold pipeline. Ensure the UML sequence diagrams map with FastAPI endpoints by Week 6.',
    urgency: 'normal',
    timestamp: new Date().toISOString()
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
      }
    }
  } catch (err) {
    console.warn('PostgreSQL seed deferred (using memory fallback):', (err as any)?.message || err);
  }
}

// ---------------- USER ACCOUNT QUERIES (FOR ADMIN & AUTH) ----------------

export async function authenticateUser(email: string, passwordAttempt: string) {
  try {
    const matched = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    if (matched.length > 0) {
      const user = matched[0];
      if (user.password === passwordAttempt.trim()) {
        const { password, ...safeUser } = user;
        return safeUser;
      }
      return null;
    }
  } catch (error) {
    console.warn('PostgreSQL authentication query fallback:', (error as any)?.message || error);
  }

  // Resilient memory fallback
  const user = memoryUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (user && user.password === passwordAttempt.trim()) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
  return null;
}

export async function getAllUsers() {
  try {
    const userList = await db.select().from(users).orderBy(desc(users.createdAt));
    const allProps = await db.select().from(proposals);

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
    console.warn('PostgreSQL query fallback for users:', (error as any)?.message || error);
    return memoryUsers;
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
    if (result.length > 0) {
      const { password, ...safeUser } = result[0];
      return safeUser;
    }
  } catch (error) {
    console.warn('PostgreSQL insert user account fallback:', (error as any)?.message || error);
  }

  // Memory fallback
  const newAccount = {
    id: memoryUsers.length + 1,
    uid: `usr-${Date.now()}`,
    email: accountData.email.trim().toLowerCase(),
    password: accountData.password || 'dbit2026',
    name: accountData.name.trim(),
    role: accountData.role,
    department: accountData.department || 'Computer Engineering',
    cohort: accountData.cohort || 'SE COMPS C (Batch A)',
    rollNo: accountData.rollNo ? String(accountData.rollNo).trim() : null,
    groupNo: accountData.groupNo ? Number(accountData.groupNo) : null,
    trackNo: accountData.trackNo ? Number(accountData.trackNo) : null,
    assignedProjectCount: 0,
    createdAt: new Date().toISOString()
  };
  memoryUsers.push(newAccount);
  const { password, ...safeUser } = newAccount;
  return safeUser;
}

export async function updateUserPassword(id: number, newPassword: string) {
  try {
    const result = await db.update(users)
      .set({ password: newPassword.trim() })
      .where(eq(users.id, id))
      .returning();
    if (result.length > 0) {
      const { password, ...safeUser } = result[0];
      return safeUser;
    }
  } catch (error) {
    console.warn('PostgreSQL update password fallback:', (error as any)?.message || error);
  }

  const u = memoryUsers.find(user => user.id === id);
  if (u) {
    u.password = newPassword.trim();
    const { password, ...safeUser } = u;
    return safeUser;
  }
  return null;
}

export async function deleteUserAccount(id: number) {
  try {
    const res = await db.delete(users).where(eq(users.id, id)).returning();
    if (res.length > 0) return res[0];
  } catch (error) {
    console.warn('PostgreSQL delete user fallback:', (error as any)?.message || error);
  }

  const idx = memoryUsers.findIndex(u => u.id === id);
  if (idx !== -1) {
    const deleted = memoryUsers.splice(idx, 1);
    return deleted[0];
  }
  return { id };
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
    if (result.length > 0) return result[0];
  } catch (error) {
    console.warn('PostgreSQL insert guide message fallback:', (error as any)?.message || error);
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderName: messageData.senderName,
    senderRole: messageData.senderRole || 'guide',
    targetGroupNo: Number(messageData.targetGroupNo),
    subject: messageData.subject.trim(),
    message: messageData.message.trim(),
    urgency: messageData.urgency || 'normal',
    timestamp: new Date().toISOString()
  };
  memoryMessages.unshift(newMsg);
  return newMsg;
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
    console.warn('PostgreSQL get guide messages fallback:', (error as any)?.message || error);
    if (groupNo !== undefined && groupNo !== null) {
      return memoryMessages.filter(m => m.targetGroupNo === Number(groupNo));
    }
    return memoryMessages;
  }
}

// ---------------- PROPOSAL & STAGE-GATE QUERIES ----------------

export async function getAllProposals() {
  try {
    const propRows = await db.select().from(proposals).orderBy(desc(proposals.createdAt));
    const allStageGates = await db.select().from(stageGates);
    const allFeedback = await db.select().from(feedbackHistory).orderBy(desc(feedbackHistory.timestamp));

    if (propRows.length > 0) {
      return propRows.map(p => ({
        ...p,
        stageGates: allStageGates.filter(sg => sg.proposalId === p.id),
        feedbackHistory: allFeedback.filter(fb => fb.proposalId === p.id)
      }));
    }
  } catch (error) {
    console.warn('PostgreSQL get proposals fallback (using initialized cache):', (error as any)?.message || error);
  }

  return memoryProposals;
}

export async function getAllHistoricalProjects() {
  try {
    const res = await db.select().from(historicalProjects);
    if (res.length > 0) return res;
  } catch (error) {
    console.warn('PostgreSQL get historical projects fallback (using initialized cache):', (error as any)?.message || error);
  }

  return memoryHistorical;
}

export async function insertProposal(proposalData: any) {
  try {
    const inserted = await db.insert(proposals).values(proposalData).returning();
    if (inserted.length > 0) return inserted[0];
  } catch (error) {
    console.warn('PostgreSQL insert proposal fallback:', (error as any)?.message || error);
  }

  memoryProposals.unshift(proposalData);
  return proposalData;
}

export async function updateProposalStatus(id: string, status: string, lockedTopic?: boolean) {
  try {
    const values: any = { status, updatedAt: new Date() };
    if (lockedTopic !== undefined) values.lockedTopic = lockedTopic;
    const res = await db.update(proposals).set(values).where(eq(proposals.id, id)).returning();
    if (res.length > 0) return res[0];
  } catch (error) {
    console.warn('PostgreSQL update proposal status fallback:', (error as any)?.message || error);
  }

  const p = memoryProposals.find(item => item.id === id);
  if (p) {
    p.status = status;
    if (lockedTopic !== undefined) p.lockedTopic = lockedTopic;
    return p;
  }
  return { id, status, lockedTopic };
}

export async function updateStageGate(id: string, updates: any) {
  try {
    const res = await db.update(stageGates).set(updates).where(eq(stageGates.id, id)).returning();
    if (res.length > 0) return res[0];
  } catch (error) {
    console.warn('PostgreSQL update stage gate fallback:', (error as any)?.message || error);
  }

  for (const p of memoryProposals) {
    if (p.stageGates) {
      const g = p.stageGates.find((sg: any) => sg.id === id);
      if (g) {
        Object.assign(g, updates);
        return g;
      }
    }
  }
  return { id, ...updates };
}

export async function insertFeedback(feedbackData: any) {
  try {
    const res = await db.insert(feedbackHistory).values(feedbackData).returning();
    if (res.length > 0) return res[0];
  } catch (error) {
    console.warn('PostgreSQL insert feedback fallback:', (error as any)?.message || error);
  }

  return feedbackData;
}
