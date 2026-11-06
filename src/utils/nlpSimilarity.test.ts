import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenize,
  computeCosineSimilarity,
  calculateHybridSimilarity,
  scanProposalSimilarity
} from './nlpSimilarity';
import { HistoricalProject } from '../types';

test('tokenize extracts normalized words and strips academic stopwords', () => {
  const text = 'A centralized web portal using Sentence-BERT for duplicate detection';
  const tokens = tokenize(text);
  assert.ok(tokens.includes('centralized'));
  assert.ok(tokens.includes('sentence'));
  assert.ok(tokens.includes('duplicate'));
  assert.ok(tokens.includes('detection'));
  assert.ok(!tokens.includes('using')); // in stopword set
  assert.ok(!tokens.includes('for'));
  assert.ok(!tokens.includes('a'));
});

test('computeCosineSimilarity returns 1 for identical vectors and 0 for orthogonal vectors', () => {
  const vecA = { machine: 2, learning: 3, model: 1 };
  const vecB = { machine: 2, learning: 3, model: 1 };
  const vecC = { agriculture: 5, soil: 2 };

  const simIdentical = computeCosineSimilarity(vecA, vecB);
  assert.ok(Math.abs(simIdentical - 1.0) < 0.001, `Expected ~1.0, got ${simIdentical}`);

  const simOrthogonal = computeCosineSimilarity(vecA, vecC);
  assert.equal(simOrthogonal, 0);
});

test('calculateHybridSimilarity detects high similarity on rephrased and identical concepts', () => {
  const text1 = 'Smart traffic signal automation with computer vision and vehicle surveillance cameras';
  const text2 = 'Urban road congestion monitoring and traffic light control using visual sensors';

  const result = calculateHybridSimilarity(text1, text2);
  assert.ok(result.overallScore > 0.40, `Expected semantic overlap > 0.40, got ${result.overallScore}`);
  assert.ok(result.sbertScore > 0.35, `SBERT should detect semantic cluster overlap`);
});

test('scanProposalSimilarity flags conflict when similarity >= 0.75 threshold', () => {
  const mockArchive: HistoricalProject[] = [
    {
      id: 'dbit-2024-01',
      code: 'DBIT-TE-2024-T3-G02',
      title: 'Decentralized Blockchain Land Registry Smart Contracts',
      abstract: 'A tamperproof decentralized property and land title deed registration portal using Ethereum smart contracts, web3, and IPFS storage to eliminate forged deeds.',
      domain: 'Web3 & Blockchain',
      academicYear: '2024-25',
      classCohort: 'TE COMPS',
      groupMembers: ['John Doe', 'Jane Smith'],
      guideName: 'Prof. Kulkarni',
      techStack: ['Solidity', 'Ethereum', 'React', 'IPFS'],
      finalRating: 'A+',
      status: 'Archived'
    },
    {
      id: 'dbit-2024-02',
      code: 'DBIT-SE-2024-T1-G04',
      title: 'Crop Disease Diagnosis Using Deep Learning',
      abstract: 'Automated plant pathology detection system analyzing leaf imagery with convolutional neural networks.',
      domain: 'AI/ML',
      academicYear: '2024-25',
      classCohort: 'SE COMPS',
      groupMembers: ['Alice', 'Bob'],
      guideName: 'Mr. Remedios',
      techStack: ['Python', 'TensorFlow'],
      finalRating: 'A',
      status: 'Archived'
    }
  ];

  // Near duplicate submission
  const conflictReport = scanProposalSimilarity(
    'Decentralized Land Registry Smart Contracts Platform',
    'A tamperproof decentralized property and land title deed registration using Ethereum smart contracts and web3 ledger to eliminate forged deeds.',
    mockArchive
  );

  assert.equal(conflictReport.isConflict, true, 'Should trigger isConflict when sim >= 0.75');
  assert.ok(conflictReport.overallScore >= 0.75, `Expected score >= 0.75, got ${conflictReport.overallScore}`);
  assert.equal(conflictReport.matchedProjectId, 'dbit-2024-01');

  // Novel submission
  const novelReport = scanProposalSimilarity(
    'Edge-Based Bioacoustic Bird Vocalization Tracker',
    'Low-power audio sensor deployment analyzing rainforest avian acoustic frequencies using micro-controllers.',
    mockArchive
  );

  assert.equal(novelReport.isConflict, false, 'Novel topic should not conflict');
  assert.ok(novelReport.overallScore < 0.75, `Score should be below 0.75, got ${novelReport.overallScore}`);
});

test('scanProposalSimilarity flags conflict against active approved proposals and problem statement', () => {
  const activeProposals = [
    {
      id: 'prop-approved-1',
      projectId: 'DBIT-SE-2026-T7-G05',
      trackNo: 7,
      groupNo: 5,
      academicYear: '2026-27',
      cohort: 'SE COMPS C (Batch A)',
      title: 'Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)',
      domain: 'AI/ML' as const,
      abstract: 'DBIT ProjectTrack automates topic screening, faculty review, and milestone tracking. Featuring automated real-time duplicate screening with similarity checking, it flags duplicate ideas. An expert conflict queue provides side-by-side pitch defense evaluation.',
      problemStatement: 'Manual Google Sheets and WhatsApp submissions cause topic overlap and stage gate confusion across SE/TE cohorts.',
      objectives: ['Automated duplicate detection'],
      scope: { inScope: ['Proposal submission'], outOfScope: [] },
      techStack: ['React', 'TypeScript'],
      teamMembers: [{ name: 'Student 1', rollNo: '1', email: 's1@dbit.in', isLeader: true }],
      guideName: 'Mr. Nazareth Remedios',
      coordinatorName: 'Prof. Meenal Kulkarni',
      status: 'approved' as const,
      lockedTopic: true,
      stageGates: [],
      feedbackHistory: [],
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z'
    }
  ];

  const duplicateCandidate = scanProposalSimilarity(
    'Centralized College Project Title & Abstract Submission Web App',
    'An automated web platform for college student project title and abstract submission that scans for duplicate project titles using sentence embeddings and cosine similarity, notifying project coordinators to avoid duplicate projects.',
    [],
    'Manual Google Sheets cause topic overlap and stage gate confusion.',
    activeProposals
  );

  assert.equal(duplicateCandidate.isConflict, true, 'Should trigger conflict against active approved proposal');
  assert.ok(duplicateCandidate.matchedActiveProposal !== undefined, 'Should return matchedActiveProposal reference');
  assert.equal(duplicateCandidate.matchedActiveProposal?.id, 'prop-approved-1');
});

test('LabLink proposal (laboratory hardware equipment management) achieves high originality and no conflict against ProjectTrack/College OS', () => {
  const activeProposals = [
    {
      id: 'prop-approved-1',
      projectId: 'DBIT-SE-2026-T7-G05',
      trackNo: 7,
      groupNo: 5,
      academicYear: '2026-27',
      cohort: 'SE COMPS C (Batch A)',
      title: 'Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)',
      domain: 'AI/ML' as const,
      abstract: 'DBIT ProjectTrack automates topic screening, faculty review, and milestone tracking. Featuring automated real-time duplicate screening with similarity checking, it flags duplicate ideas. An expert conflict queue provides side-by-side pitch defense evaluation.',
      problemStatement: 'Manual Google Sheets and WhatsApp submissions cause topic overlap and stage gate confusion across SE/TE cohorts.',
      objectives: ['Automated duplicate detection'],
      scope: { inScope: ['Proposal submission'], outOfScope: [] },
      techStack: ['React', 'TypeScript'],
      teamMembers: [{ name: 'Student 1', rollNo: '1', email: 's1@dbit.in', isLeader: true }],
      guideName: 'Mr. Nazareth Remedios',
      coordinatorName: 'Prof. Meenal Kulkarni',
      status: 'approved' as const,
      lockedTopic: true,
      stageGates: [],
      feedbackHistory: [],
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z'
    }
  ];

  const labLinkProposal = scanProposalSimilarity(
    'LabLink: Centralized Laboratory Management Platform',
    'We propose developing LabLink, a centralized laboratory management platform designed to improve the utilization, accessibility, and maintenance of college laboratory resources. The platform will allow students and faculty to check equipment availability, reserve instruments for practical sessions, and maintain records of borrowed and returned equipment. Each laboratory instrument will have a unique identification code or QR code, enabling users to scan and access its usage history, availability, and condition.',
    [],
    'Laboratory administrators will be able to maintain digital inventory records, monitor equipment usage, identify frequently damaged instruments, and schedule preventive maintenance.',
    activeProposals
  );

  assert.equal(labLinkProposal.isConflict, false, 'LabLink should NOT conflict with ProjectTrack or College OS');
  assert.ok(labLinkProposal.overallScore < 0.35, `Expected low overall score < 0.35, got ${labLinkProposal.overallScore}`);
  const originality = Math.round((1 - labLinkProposal.overallScore) * 100);
  assert.ok(originality > 70, `Expected High Originality > 70%, got ${originality}%`);
});


