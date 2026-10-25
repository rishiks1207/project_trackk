import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { ProjectProposal, HistoricalProject, StageGateMilestone } from '../types';
import { INITIAL_PROPOSALS, INITIAL_HISTORICAL_PROJECTS } from '../data/mockData';

const PROPOSALS_COLLECTION = 'proposals';
const HISTORICAL_COLLECTION = 'historical_theses';

/**
 * Initializes Firestore collections with seed data if the database is currently empty.
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const proposalsRef = collection(db, PROPOSALS_COLLECTION);
    const snapshot = await getDocs(proposalsRef);
    
    if (snapshot.empty) {
      console.log('Seeding initial proposals to Firestore...');
      for (const prop of INITIAL_PROPOSALS) {
        await setDoc(doc(db, PROPOSALS_COLLECTION, prop.id), prop);
      }
    }

    const histRef = collection(db, HISTORICAL_COLLECTION);
    const histSnap = await getDocs(histRef);
    if (histSnap.empty) {
      console.log('Seeding initial historical theses to Firestore...');
      for (const thesis of INITIAL_HISTORICAL_PROJECTS) {
        await setDoc(doc(db, HISTORICAL_COLLECTION, thesis.id), thesis);
      }
    }
  } catch (err) {
    console.warn('Firestore seeding notice (using local cache if offline):', err);
  }
}

/**
 * Subscribes to real-time changes in proposals collection.
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
        console.warn('Firestore snapshot listener error:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore snapshot listener:', err);
    return () => {};
  }
}

/**
 * Saves or updates a project proposal in Firestore.
 */
export async function saveProposalToFirestore(proposal: ProjectProposal): Promise<void> {
  try {
    const ref = doc(db, PROPOSALS_COLLECTION, proposal.id);
    await setDoc(ref, proposal, { merge: true });
    console.log(`Saved proposal ${proposal.id} to Firestore.`);
  } catch (err) {
    console.warn('Failed to save proposal to Firestore:', err);
  }
}

/**
 * Updates a specific experiment milestone inside a proposal in Firestore.
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
