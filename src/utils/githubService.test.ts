import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGitHubRepo } from './githubService';

test('parseGitHubRepo parses various valid repository formats', () => {
  const p1 = parseGitHubRepo('https://github.com/rishiks1207/dbit-project-track');
  assert.deepEqual(p1, { owner: 'rishiks1207', repo: 'dbit-project-track' });

  const p2 = parseGitHubRepo('rishiks1207/dbit-project-track');
  assert.deepEqual(p2, { owner: 'rishiks1207', repo: 'dbit-project-track' });

  const p3 = parseGitHubRepo('https://github.com/facebook/react.git');
  assert.deepEqual(p3, { owner: 'facebook', repo: 'react' });

  const p4 = parseGitHubRepo('invalid repo name with spaces');
  assert.equal(p4, null);
});
