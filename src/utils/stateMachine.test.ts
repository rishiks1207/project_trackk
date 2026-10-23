import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextStatus } from './stateMachine';

test('transitions from draft to evaluating_similarity on submit', () => {
  const result = getNextStatus('draft', 'SUBMIT');
  assert.equal(result.nextStatus, 'evaluating_similarity');
});

test('evaluating_similarity transitions to flagged_conflict when sim >= 0.75', () => {
  const result = getNextStatus('evaluating_similarity', 'SIMILARITY_CHECK_COMPLETE', { similarityScore: 0.78 });
  assert.equal(result.nextStatus, 'flagged_conflict');
  assert.equal(result.requiresPitch, true);
});

test('evaluating_similarity transitions to under_guide_review when sim < 0.75', () => {
  const result = getNextStatus('evaluating_similarity', 'SIMILARITY_CHECK_COMPLETE', { similarityScore: 0.42 });
  assert.equal(result.nextStatus, 'under_guide_review');
});

test('flagged_conflict transitions to coordinator_arbitration on submit pitch defense', () => {
  const result = getNextStatus('flagged_conflict', 'SUBMIT_PITCH_DEFENSE');
  assert.equal(result.nextStatus, 'coordinator_arbitration');
});

test('under_guide_review transitions to approved on guide approve', () => {
  const result = getNextStatus('under_guide_review', 'GUIDE_APPROVE');
  assert.equal(result.nextStatus, 'approved');
});
