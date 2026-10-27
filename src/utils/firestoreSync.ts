import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { ProjectProposal, HistoricalProject, StageGateMilestone, UserAccount, GuideMessage, MessageReply } from '../types';
import { INITIAL_PROPOSALS, INITIAL_HISTORICAL_PROJECTS } from '../data/mockData';

export const PROPOSALS_COLLECTION = 'proposals';
export const HISTORICAL_COLLECTION = 'historical_theses';
export const ARCHIVE_COLLECTION = 'project_archive';
export const USERS_COLLECTION = 'users';
export const MESSAGES_COLLECTION = 'guide_messages';

export const INITIAL_GUIDE_MESSAGES: GuideMessage[] = [
  {
    id: 'msg-seed-01',
    senderName: 'Mr. Nazareth Remedios',
    senderRole: 'guide',
    targetGroupNo: 5,
    subject: 'Stage 1 Architecture Review Sign-Off & SBERT Threshold',
    message: 'Excellent progress on the SBERT threshold pipeline and vector database schema. Ensure the UML sequence diagrams map with FastAPI endpoints and deliverable documents by Week 6.',
    urgency: 'normal',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    replies: [
      {
        id: 'reply-seed-01',
        senderName: 'Rishik Ezhuthachan',
        senderRole: 'student',
        senderEmail: 'rishiks1207@gmail.com',
        message: 'Thank you professor! We have completed the FastAPI integration and uploaded the UML package in Stage 1 deliverable.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'msg-seed-02',
    senderName: 'Prof. Meenal Kulkarni',
    senderRole: 'coordinator',
    targetGroupNo: 5,
    subject: 'Review 1 Schedule & Rubric Briefing',
    message: 'All SE COMPS Track 7 groups must prepare their 10-slide pitch presentation for Stage Gate 0/1 review by Thursday. Check your rubrics in the dashboard.',
    urgency: 'high',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    replies: []
  }
];

export const INITIAL_INSTITUTIONAL_USERS: (UserAccount & { password?: string })[] = [
  {
    id: 1,
    uid: 'usr-admin-01',
    email: 'admin@dbit.in',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
    cohort: 'System Administrator',
    department: 'Computer Engineering',
    assignedProjectCount: 3
  },
  {
    id: 2,
    uid: 'usr-coord-01',
    email: 'coordinator@dbit.in',
    password: 'coord123',
    name: 'Prof. Meenal Kulkarni',
    role: 'coordinator',
    cohort: 'SE/TE Project Coordinator',
    department: 'Computer Engineering',
    assignedProjectCount: 3
  },
  {
    id: 3,
    uid: 'usr-guide-01',
    email: 'guide@dbit.in',
    password: 'guide123',
    name: 'Mr. Nazareth Remedios',
    role: 'guide',
    cohort: 'Faculty Guide',
    trackNo: 7,
    department: 'Computer Engineering',
    assignedProjectCount: 2
  },
  {
    id: 4,
    uid: 'usr-guide-02',
    email: 'guide2@dbit.in',
    password: 'guide123',
    name: 'Ms. Harleen Kaur Plaha',
    role: 'guide',
    cohort: 'Faculty Guide',
    trackNo: 7,
    department: 'Computer Engineering',
    assignedProjectCount: 1
  },
  {
    id: 5,
    uid: 'usr-stud-01',
    email: 'rishiks1207@gmail.com',
    password: 'student123',
    name: 'Rishik Ezhuthachan',
    role: 'student',
    rollNo: '15',
    cohort: 'SE COMPS C (Batch A)',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    assignedProjectCount: 1,
    relatedProposalTitle: 'Centralized Project Proposal & Progress Tracking Portal'
  },
  {
    id: 6,
    uid: 'usr-stud-02',
    email: 'apoorvadeep.sinha@dbit.in',
    password: 'student123',
    name: 'Apoorvadeep Sinha',
    role: 'student',
    rollNo: '16',
    cohort: 'SE COMPS C (Batch A)',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    assignedProjectCount: 1,
    relatedProposalTitle: 'Centralized Project Proposal & Progress Tracking Portal'
  },
  {
    id: 7,
    uid: 'usr-stud-03',
    email: 'ron.barretto@dbit.in',
    password: 'student123',
    name: 'Ron Barretto',
    role: 'student',
    rollNo: '17',
    cohort: 'SE COMPS C (Batch A)',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    assignedProjectCount: 1,
    relatedProposalTitle: 'Centralized Project Proposal & Progress Tracking Portal'
  },
  {
    id: 8,
    uid: 'usr-stud-04',
    email: 'aryan.gaikwad@dbit.in',
    password: 'student123',
    name: 'Aryan Gaikwad',
    role: 'student',
    rollNo: '18',
    cohort: 'SE COMPS C (Batch A)',
    groupNo: 5,
    trackNo: 7,
    department: 'Computer Engineering',
    assignedProjectCount: 1,
    relatedProposalTitle: 'Centralized Project Proposal & Progress Tracking Portal'
  }
];

/**
 * Initializes Firestore collections with seed data if the database is currently empty.
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    // 1. Seed Individual Proposals
    const proposalsRef = collection(db, PROPOSALS_COLLECTION);
    const snapshot = await getDocs(proposalsRef);
    if (snapshot.empty) {
      for (const prop of INITIAL_PROPOSALS) {
        await setDoc(doc(db, PROPOSALS_COLLECTION, prop.id), prop);
      }
    }

    // 2. Seed Project Archive & Historical Theses
    const archiveRef = collection(db, ARCHIVE_COLLECTION);
    const archiveSnap = await getDocs(archiveRef);
    if (archiveSnap.empty) {
      for (const thesis of INITIAL_HISTORICAL_PROJECTS) {
        await setDoc(doc(db, ARCHIVE_COLLECTION, thesis.id), thesis);
        await setDoc(doc(db, HISTORICAL_COLLECTION, thesis.id), thesis);
      }
    }

    // 3. Seed Users with credentials
    const usersRef = collection(db, USERS_COLLECTION);
    const usersSnap = await getDocs(usersRef);
    if (usersSnap.empty) {
      for (const u of INITIAL_INSTITUTIONAL_USERS) {
        await setDoc(doc(db, USERS_COLLECTION, String(u.id)), u);
      }
    }

    // 4. Seed Guide Direct Messages
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const messagesSnap = await getDocs(messagesRef);
    if (messagesSnap.empty) {
      for (const m of INITIAL_GUIDE_MESSAGES) {
        await setDoc(doc(db, MESSAGES_COLLECTION, m.id), m);
      }
    }
  } catch (err) {
    console.warn('Firestore seeding notice (using local cache if offline):', err);
  }
}

/**
 * Authenticates a user directly against the Cloud Firestore 'users' collection database.
 */
export async function authenticateUserWithFirestore(
  email: string,
  passwordAttempt: string
): Promise<UserAccount | null> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  // 1. Check Cloud Firestore Database
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snap = await getDocs(usersRef);

    if (!snap.empty) {
      let matchedDoc: any = null;
      snap.forEach((d) => {
        const u = d.data();
        if (u.email && u.email.toLowerCase() === cleanEmail) {
          matchedDoc = u;
        }
      });

      if (matchedDoc) {
        if (!matchedDoc.password || matchedDoc.password === cleanPass) {
          const { password: _, ...safeUser } = matchedDoc;
          return safeUser as UserAccount;
        }
      }
    }
  } catch (err) {
    console.warn('Firestore database auth lookup error:', err);
  }

  // 2. Check Local Storage admin users cache (persists accounts created by admin in current browser)
  try {
    const localUsersRaw = localStorage.getItem('dbit_admin_users');
    if (localUsersRaw) {
      const localUsers = JSON.parse(localUsersRaw);
      if (Array.isArray(localUsers)) {
        const localUserMatch = localUsers.find(
          (u: any) => u.email && u.email.toLowerCase() === cleanEmail && (!u.password || u.password === cleanPass)
        );
        if (localUserMatch) {
          // Sync to Firestore in background
          saveUserToFirestore(localUserMatch);
          const { password: _, ...safeUser } = localUserMatch;
          return safeUser as UserAccount;
        }
      }
    }
  } catch (e) {
    console.warn('LocalStorage users lookup notice:', e);
  }

  // 3. Fallback to built-in institutional seed users
  const seedMatch = INITIAL_INSTITUTIONAL_USERS.find(
    u => u.email.toLowerCase() === cleanEmail && (!u.password || u.password === cleanPass)
  );

  if (seedMatch) {
    saveUserToFirestore(seedMatch);
    const { password: _, ...safeUser } = seedMatch;
    return safeUser as UserAccount;
  }

  return null;
}

/**
 * Subscribes to real-time changes in proposals collection (individual projects).
 */
export function subscribeToProposals(
  callback: (proposals: ProjectProposal[]) => void
): () => void {
  try {
    const proposalsRef = collection(db, PROPOSALS_COLLECTION);
    const unsubscribe = onSnapshot(
      proposalsRef, 
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ProjectProposal[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as ProjectProposal);
          });
          callback(list);
        }
      },
      (err) => {
        console.warn('Firestore proposals snapshot listener error:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore proposals listener:', err);
    return () => {};
  }
}

/**
 * Subscribes to real-time changes in project archive collection.
 */
export function subscribeToProjectArchive(
  callback: (projects: HistoricalProject[]) => void
): () => void {
  try {
    const archiveRef = collection(db, ARCHIVE_COLLECTION);
    const unsubscribe = onSnapshot(
      archiveRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: HistoricalProject[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as HistoricalProject);
          });
          callback(list);
        }
      },
      (err) => {
        console.warn('Firestore archive snapshot listener error:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore archive listener:', err);
    return () => {};
  }
}

/**
 * Subscribes to real-time changes in users collection.
 */
export function subscribeToUsers(
  callback: (users: UserAccount[]) => void
): () => void {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: UserAccount[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as UserAccount);
          });
          callback(list);
        }
      },
      (err) => {
        console.warn('Firestore users snapshot listener error:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore users listener:', err);
    return () => {};
  }
}

/**
 * Saves or updates an individual project proposal in Firestore.
 */
export async function saveProposalToFirestore(proposal: ProjectProposal): Promise<void> {
  try {
    const ref = doc(db, PROPOSALS_COLLECTION, proposal.id);
    await setDoc(ref, proposal, { merge: true });
  } catch (err) {
    console.warn('Failed to save proposal to Firestore:', err);
  }
}

/**
 * Saves or updates a project in the project archive.
 */
export async function saveArchiveProjectToFirestore(project: HistoricalProject): Promise<void> {
  try {
    const ref1 = doc(db, ARCHIVE_COLLECTION, project.id);
    const ref2 = doc(db, HISTORICAL_COLLECTION, project.id);
    await Promise.all([
      setDoc(ref1, project, { merge: true }),
      setDoc(ref2, project, { merge: true })
    ]);
  } catch (err) {
    console.warn('Failed to save archive project to Firestore:', err);
  }
}

/**
 * Saves or updates a user account in Firestore.
 */
export async function saveUserToFirestore(user: UserAccount & { password?: string }): Promise<void> {
  try {
    const docId = user.uid || String(user.id);
    const ref = doc(db, USERS_COLLECTION, docId);
    await setDoc(ref, user, { merge: true });
  } catch (err) {
    console.warn('Failed to save user to Firestore:', err);
  }

  // Always maintain local storage sync so page refreshes and offline re-logins never lose the user
  try {
    const localUsersRaw = localStorage.getItem('dbit_admin_users');
    let localUsers: any[] = localUsersRaw ? JSON.parse(localUsersRaw) : [];
    if (!Array.isArray(localUsers)) localUsers = [];
    const existingIdx = localUsers.findIndex(u => 
      (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) || 
      (u.id && user.id && u.id === user.id)
    );
    if (existingIdx !== -1) {
      localUsers[existingIdx] = { ...localUsers[existingIdx], ...user };
    } else {
      localUsers.unshift(user);
    }
    localStorage.setItem('dbit_admin_users', JSON.stringify(localUsers));
  } catch (e) {
    // ignore
  }
}

/**
 * Deletes a user account from Firestore and local cache.
 */
export async function deleteUserFromFirestore(userId: number | string): Promise<void> {
  try {
    const ref = doc(db, USERS_COLLECTION, String(userId));
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete user from Firestore:', err);
  }

  try {
    const localUsersRaw = localStorage.getItem('dbit_admin_users');
    if (localUsersRaw) {
      let localUsers: any[] = JSON.parse(localUsersRaw);
      if (Array.isArray(localUsers)) {
        localUsers = localUsers.filter(u => u.id !== userId && u.uid !== String(userId));
        localStorage.setItem('dbit_admin_users', JSON.stringify(localUsers));
      }
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Updates a specific experiment milestone inside an individual proposal in Firestore.
 */
export async function updateMilestoneInFirestore(
  proposalId: string, 
  milestone: StageGateMilestone
): Promise<void> {
  try {
    const ref = doc(db, PROPOSALS_COLLECTION, proposalId);
    const snap = await getDocs(collection(db, PROPOSALS_COLLECTION));
    snap.forEach(async (d) => {
      if (d.id === proposalId) {
        const prop = d.data() as ProjectProposal;
        const updatedGates = (prop.stageGates || []).map((m: StageGateMilestone) => 
          m.id === milestone.id ? { ...m, ...milestone } : m
        );
        await updateDoc(ref, { stageGates: updatedGates });
      }
    });
  } catch (err) {
    console.warn('Failed to update milestone in Firestore:', err);
  }
}

/**
 * Subscribes to real-time changes in guide notices and direct messages collection.
 */
export function subscribeToGuideMessages(
  callback: (messages: GuideMessage[]) => void
): () => void {
  try {
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: GuideMessage[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as GuideMessage);
          });
          // Sort by timestamp descending
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          callback(list);
        } else {
          // If empty, return initial
          callback(INITIAL_GUIDE_MESSAGES);
        }
      },
      (err) => {
        console.warn('Firestore messages listener error:', err);
        const cached = localStorage.getItem('dbit_guide_messages');
        if (cached) {
          try { callback(JSON.parse(cached)); return; } catch (e) {}
        }
        callback(INITIAL_GUIDE_MESSAGES);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore messages listener:', err);
    const cached = localStorage.getItem('dbit_guide_messages');
    if (cached) {
      try { callback(JSON.parse(cached)); } catch (e) { callback(INITIAL_GUIDE_MESSAGES); }
    } else {
      callback(INITIAL_GUIDE_MESSAGES);
    }
    return () => {};
  }
}

/**
 * Saves a new guide message to Firestore (and caches to localStorage).
 */
export async function saveGuideMessageToFirestore(message: GuideMessage): Promise<void> {
  try {
    const ref = doc(db, MESSAGES_COLLECTION, message.id);
    await setDoc(ref, message, { merge: true });
  } catch (err) {
    console.warn('Failed to save message to Firestore:', err);
  }

  // Backup to localStorage
  try {
    const cachedStr = localStorage.getItem('dbit_guide_messages');
    const existing: GuideMessage[] = cachedStr ? JSON.parse(cachedStr) : [...INITIAL_GUIDE_MESSAGES];
    const filtered = existing.filter(m => m.id !== message.id);
    const updated = [message, ...filtered];
    localStorage.setItem('dbit_guide_messages', JSON.stringify(updated));
  } catch (e) {}
}

/**
 * Adds a student or faculty reply to an existing guide notice in Firestore.
 */
export async function addReplyToGuideMessageInFirestore(
  messageId: string,
  reply: MessageReply
): Promise<void> {
  try {
    const ref = doc(db, MESSAGES_COLLECTION, messageId);
    const snap = await getDocs(collection(db, MESSAGES_COLLECTION));
    let found = false;
    for (const d of snap.docs) {
      if (d.id === messageId) {
        found = true;
        const msg = d.data() as GuideMessage;
        const updatedReplies = [...(msg.replies || []), reply];
        await updateDoc(ref, { replies: updatedReplies });
        break;
      }
    }
    if (!found) {
      // Create or merge
      await setDoc(ref, { id: messageId, replies: [reply] }, { merge: true });
    }
  } catch (err) {
    console.warn('Failed to add reply to message in Firestore:', err);
  }

  // Backup to localStorage
  try {
    const cachedStr = localStorage.getItem('dbit_guide_messages');
    const existing: GuideMessage[] = cachedStr ? JSON.parse(cachedStr) : [...INITIAL_GUIDE_MESSAGES];
    const target = existing.find(m => m.id === messageId);
    if (target) {
      target.replies = [...(target.replies || []), reply];
      localStorage.setItem('dbit_guide_messages', JSON.stringify(existing));
    }
  } catch (e) {}
}
