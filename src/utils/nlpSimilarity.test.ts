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
