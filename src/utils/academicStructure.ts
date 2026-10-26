import { AcademicYearConfig, AcademicClass, AcademicBatch } from '../types';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const DEFAULT_ACADEMIC_STRUCTURE: AcademicYearConfig[] = [
  {
    yearKey: 'FE',
    yearName: 'First Year (FE)',
    classes: [
      {
        id: 'fe-comps-a',
        name: 'COMPS A',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'fe-comps-b',
        name: 'COMPS B',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      }
    ]
  },
  {
    yearKey: 'SE',
    yearName: 'Second Year (SE)',
    classes: [
      {
        id: 'se-comps-a',
        name: 'COMPS A',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'se-comps-b',
        name: 'COMPS B',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'se-comps-c',
        name: 'COMPS C',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      }
    ]
  },
  {
    yearKey: 'TE',
    yearName: 'Third Year (TE)',
    classes: [
      {
        id: 'te-comps-a',
        name: 'COMPS A',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'te-comps-b',
        name: 'COMPS B',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'te-comps-c',
        name: 'COMPS C',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      }
    ]
  },
  {
    yearKey: 'BE',
    yearName: 'Final Year (BE)',
    classes: [
      {
        id: 'be-comps-a',
        name: 'COMPS A',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'be-comps-b',
        name: 'COMPS B',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      },
      {
        id: 'be-comps-c',
        name: 'COMPS C',
        batches: [
          { id: 'b-a', name: 'Batch A' },
          { id: 'b-b', name: 'Batch B' },
          { id: 'b-c', name: 'Batch C' }
        ]
      }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'dbit_academic_structure';

export function loadAcademicStructure(): AcademicYearConfig[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading academic structure from localStorage:', err);
  }
  return DEFAULT_ACADEMIC_STRUCTURE;
}

export function saveAcademicStructure(configs: AcademicYearConfig[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configs));
    // Also sync to Cloud Firestore
    const ref = doc(db, 'system_config', 'academic_structure');
    setDoc(ref, { years: configs, updatedAt: new Date().toISOString() }, { merge: true }).catch(err => {
      console.warn('Could not sync academic structure to Firestore:', err);
    });
  } catch (err) {
    console.warn('Error saving academic structure:', err);
  }
}

export async function fetchAcademicStructureFromFirestore(): Promise<AcademicYearConfig[] | null> {
  try {
    const ref = doc(db, 'system_config', 'academic_structure');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.years && Array.isArray(data.years) && data.years.length > 0) {
        saveAcademicStructure(data.years);
        return data.years;
      }
    }
  } catch (err) {
    console.warn('Firestore academic structure lookup:', err);
  }
  return null;
}
