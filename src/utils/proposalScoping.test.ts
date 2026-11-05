import test from 'node:test';
import assert from 'node:assert/strict';
import { ProjectProposal, UserAccount } from '../types';

function matchStudentProposal(currentUser: Partial<UserAccount> | null, proposals: Partial<ProjectProposal>[]): Partial<ProjectProposal> | undefined {
  if (!currentUser) return undefined;
  return proposals.find(p => {
    const groupMatch = Boolean(
      currentUser.groupNo !== undefined && currentUser.groupNo !== null &&
      p.groupNo !== undefined && p.groupNo !== null &&
      Number(p.groupNo) === Number(currentUser.groupNo) &&
      (!currentUser.trackNo || !p.trackNo || Number(p.trackNo) === Number(currentUser.trackNo))
    );
    const memberMatch = Boolean(
      p.teamMembers && p.teamMembers.some(m => 
        (currentUser.email && m.email && m.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
        (currentUser.name && m.name && m.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) ||
        (currentUser.rollNo && m.rollNo && String(m.rollNo).trim() === String(currentUser.rollNo).trim())
      )
    );
    return groupMatch || memberMatch;
  });
}

test('student with no submitted proposal returns undefined, never falling back to dummy group 5', () => {
  const dummyProposals: Partial<ProjectProposal>[] = [
    {
      id: 'prop-1',
      projectId: 'DBIT-SE-2026-T7-G05',
      trackNo: 7,
      groupNo: 5,
      academicYear: '2026-27',
      cohort: 'SE COMPS C (Batch A)',
      title: 'Real-Time Similarity & Stage Gate Tracker',
      domain: 'AI/ML',
      abstract: 'Dummy abstract for Group 5',
      problemStatement: 'Problem statement',
      objectives: ['Obj 1'],
      scope: { inScope: ['In'], outOfScope: ['Out'] },
      techStack: ['React'],
      teamMembers: [{ name: 'Rishik Ezhuthachan', rollNo: '15', email: 'rishiks1207@gmail.com', isLeader: true }],
      guideName: 'Mr. Nazareth Remedios',
      coordinatorName: 'Prof. Meenal Kulkarni',
      status: 'approved',
      lockedTopic: false
    }
  ];

  // Tanvi Surve has groupNo: 15, email tanvi@dbit.in
  const tanviUser: Partial<UserAccount> = {
    name: 'Tanvi Surve',
    email: 'tanvi@dbit.in',
    groupNo: 15,
    trackNo: 7,
    rollNo: '42'
  };

  const matched = matchStudentProposal(tanviUser, dummyProposals);
  assert.equal(matched, undefined, 'Tanvi should have no matched proposal before submitting');
});

test('student proposal matches correctly by groupNo even with string or number types', () => {
  const proposals: Partial<ProjectProposal>[] = [
    {
      id: 'prop-tanvi',
      projectId: 'DBIT-SE-2026-T7-G15',
      trackNo: 7,
      groupNo: 15,
      academicYear: '2026-27',
      cohort: 'SE COMPS C (Batch B)',
      title: 'Smart Attendance System',
      domain: 'AI/ML',
      abstract: 'Attendance using edge facial recognition',
      problemStatement: 'Manual roll call takes 10 mins',
      objectives: ['Face detection'],
      scope: { inScope: ['Edge device'], outOfScope: ['Cloud API'] },
      techStack: ['Python', 'OpenCV'],
      teamMembers: [{ name: 'Tanvi Surve', rollNo: '42', email: 'tanvi@dbit.in', isLeader: true }],
      guideName: 'Ms. Harleen Kaur Plaha',
      coordinatorName: 'Prof. Meenal Kulkarni',
      status: 'submitted',
      lockedTopic: false
    }
  ];

  const tanviUser: Partial<UserAccount> = {
    name: 'Tanvi Surve',
    email: 'tanvi@dbit.in',
    groupNo: 15 as any,
    trackNo: 7,
    rollNo: '42'
  };

  const matched = matchStudentProposal(tanviUser, proposals);
  assert.ok(matched, 'Tanvi proposal should be found');
  assert.equal(matched?.title, 'Smart Attendance System');
});
