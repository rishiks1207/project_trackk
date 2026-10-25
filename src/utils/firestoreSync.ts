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
import { ProjectProposal, HistoricalProject, StageGateMilestone, UserAccount } from '../types';
import { INITIAL_PROPOSALS, INITIAL_HISTORICAL_PROJECTS } from '../data/mockData';

export const PROPOSALS_COLLECTION = 'proposals';
export const HISTORICAL_COLLECTION = 'historical_theses';
export const ARCHIVE_COLLECTION = 'project_archive';
export const USERS_COLLECTION = 'users';

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

  // Fallback to local catalog and seed user to Firestore
  const localMatch = INITIAL_INSTITUTIONAL_USERS.find(
    u => u.email.toLowerCase() === cleanEmail && (!u.password || u.password === cleanPass)
  );

  if (localMatch) {
    saveUserToFirestore(localMatch);
    const { password: _, ...safeUser } = localMatch;
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
    const ref = doc(db, USERS_COLLECTION, String(user.id));
    await setDoc(ref, user, { merge: true });
  } catch (err) {
    console.warn('Failed to save user to Firestore:', err);
  }
}

/**
 * Deletes a user account from Firestore.
 */
export async function deleteUserFromFirestore(userId: number | string): Promise<void> {
  try {
    const ref = doc(db, USERS_COLLECTION, String(userId));
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete user from Firestore:', err);
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
