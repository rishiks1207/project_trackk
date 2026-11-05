import test from 'node:test';
import assert from 'node:assert/strict';
import { scanProposalSimilarity, calculateHybridSimilarity } from './nlpSimilarity';
import { INITIAL_PROPOSALS, CURRENT_USER_STUDENT } from '../data/mockData';
import { ProjectProposal, UserAccount } from '../types';

test('Rishik has strictly one proposal in INITIAL_PROPOSALS', () => {
  const rishikEmail = CURRENT_USER_STUDENT.email.toLowerCase();
  const matchingProps = INITIAL_PROPOSALS.filter(p => 
    p.teamMembers && p.teamMembers.some(m => m.email?.toLowerCase() === rishikEmail)
  );
  assert.equal(matchingProps.length, 1, 'Rishik should have exactly one proposal');
  assert.equal(matchingProps[0].id, 'prop-group-05');
  assert.equal(matchingProps[0].title, 'Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)');
});

test('new user without submitted proposal is not assigned any dummy proposal', () => {
  const newUser: Partial<UserAccount> = {
    id: 99,
    name: 'Tanvi Surve',
    email: 'tanvi.surve@dbit.in',
    role: 'student',
    rollNo: '44',
    groupNo: 15
  };

  // Check matching by team membership
  const cleanEmail = newUser.email!.toLowerCase();
  const matched = INITIAL_PROPOSALS.find(p => 
    p.teamMembers && p.teamMembers.some(m => m.email?.toLowerCase() === cleanEmail)
  );

  assert.equal(matched, undefined, 'New user Tanvi should have zero assigned proposals');
});

test('SBERT detects high semantic similarity on paraphrased duplicate proposal titles', () => {
  const proposalA = 'Centralized Project Proposal & Progress Tracking Portal with automated duplicate checking and milestone tracking';
  const proposalB = 'Automated web platform for college student project title and abstract submission that scans for duplicate project titles using sentence embeddings';

  const sim = calculateHybridSimilarity(proposalA, proposalB);
  assert.ok(sim.sbertScore >= 0.60, `SBERT should detect high semantic overlap for duplicate screening concepts (got ${sim.sbertScore})`);
  assert.ok(sim.overallScore >= 0.40, `Overall hybrid score should be elevated (got ${sim.overallScore})`);
});

test('SBERT distinguishes completely orthogonal domains with low score', () => {
  const proposalA = 'Centralized Project Proposal & Progress Tracking Portal';
  const proposalC = 'Autonomous Drone Delivery Route Planner using Genetic Algorithms';

  const sim = calculateHybridSimilarity(proposalA, proposalC);
  assert.ok(sim.overallScore < 0.35, `Orthogonal projects should have low similarity score (got ${sim.overallScore})`);
});
