/**
 * UML 2.5 State Machine Lifecycle Engine
 * Implements states and transitions as modeled in DBIT Review 1 Presentation (Slide 13 & 14)
 */

import { ProposalStatus, StagePhase } from '../types';

export interface StateTransitionEvent {
  event: 
    | 'SUBMIT' 
    | 'SIMILARITY_CHECK_COMPLETE' 
    | 'SUBMIT_PITCH_DEFENSE' 
    | 'COORDINATOR_PASS' 
    | 'COORDINATOR_REJECT' 
    | 'GUIDE_APPROVE' 
    | 'REQUEST_REVISION' 
    | 'RESUBMIT'
    | 'ADVANCE_STAGE'
    | 'FINAL_PASS';
  payload?: any;
}

export function getNextStatus(
  currentStatus: ProposalStatus,
  action: StateTransitionEvent['event'],
  payload?: { similarityScore?: number }
): { nextStatus: ProposalStatus; message: string; requiresPitch?: boolean } {
  switch (currentStatus) {
    case 'draft':
      if (action === 'SUBMIT') {
        return {
          nextStatus: 'evaluating_similarity',
          message: 'Proposal submitted. Initiating SBERT + TF-IDF semantic embedding screening...'
        };
      }
      break;

    case 'evaluating_similarity':
      if (action === 'SIMILARITY_CHECK_COMPLETE') {
        const score = payload?.similarityScore ?? 0;
        if (score >= 0.75) {
          return {
            nextStatus: 'flagged_conflict',
            message: `Topic conflict detected (Similarity ${(score * 100).toFixed(1)}% >= 75%). Topic locked pending 200-word Pitch Defense.`,
            requiresPitch: true
          };
        } else {
          return {
            nextStatus: 'under_guide_review',
            message: `Originality verified (${((1 - score) * 100).toFixed(1)}%). Queued in Faculty Guide Dashboard for feasibility review.`
          };
        }
      }
      break;

    case 'flagged_conflict':
      if (action === 'SUBMIT_PITCH_DEFENSE') {
        return {
          nextStatus: 'coordinator_arbitration',
          message: 'Pitch defense submitted. Forwarded to Project Coordinator arbitration queue.'
        };
      }
      break;

    case 'coordinator_arbitration':
      if (action === 'COORDINATOR_PASS') {
        return {
          nextStatus: 'under_guide_review',
          message: 'Pitch defense accepted by Project Coordinator. Forwarded to Faculty Guide for technical review.'
        };
      }
      if (action === 'COORDINATOR_REJECT') {
        return {
          nextStatus: 'rejected',
          message: 'Duplicate upheld by Project Coordinator. Proposal rejected. Team must formulate a new topic.'
        };
      }
      if (action === 'REQUEST_REVISION') {
        return {
          nextStatus: 'revision_required',
          message: 'Coordinator requested scope revision. Form fields unlocked for edits.'
        };
      }
      break;

    case 'under_guide_review':
      if (action === 'GUIDE_APPROVE') {
        return {
          nextStatus: 'approved',
          message: 'Topic and technical feasibility approved by Faculty Guide! Project ID assigned and Stage 1 unlocked.'
        };
      }
      if (action === 'REQUEST_REVISION') {
        return {
          nextStatus: 'revision_required',
          message: 'Faculty Guide requested technical revisions before topic approval.'
        };
      }
      break;

    case 'revision_required':
      if (action === 'RESUBMIT') {
        return {
          nextStatus: 'evaluating_similarity',
          message: 'Revised proposal resubmitted. Re-evaluating similarity...'
        };
      }
      break;

    case 'approved':
      if (action === 'FINAL_PASS') {
        return {
          nextStatus: 'completed',
          message: 'All stage gates and Review 2 evaluation passed. Project archived to DBIT Historical Repository.'
        };
      }
      break;
  }

  return { nextStatus: currentStatus, message: 'No valid transition' };
}

export function getStatusBadgeDetails(status: ProposalStatus): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (status) {
    case 'draft':
      return {
        label: 'Draft',
        badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300',
        description: 'Proposal is being drafted. Editing active.'
      };
    case 'evaluating_similarity':
      return {
        label: 'Screening (SBERT)',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
        description: 'Computing contextual embeddings and cosine similarity.'
      };
    case 'flagged_conflict':
      return {
        label: 'Flagged Conflict',
        badgeClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 animate-pulse',
        description: 'Similarity >= 0.75. Pitch defense required.'
      };
    case 'coordinator_arbitration':
      return {
        label: 'In Arbitration',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
        description: 'Side-by-side pitch defense under Coordinator review.'
      };
    case 'under_guide_review':
      return {
        label: 'Under Guide Review',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300',
        description: 'Faculty Guide reviewing technical feasibility & scope.'
      };
    case 'revision_required':
      return {
        label: 'Revision Required',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300',
        description: 'Guide logged remarks; student edits unlocked.'
      };
    case 'approved':
      return {
        label: 'Approved & Active',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
        description: 'Topic locked. Stage-Gate progression active.'
      };
    case 'rejected':
      return {
        label: 'Duplicate Upheld (Rejected)',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300',
        description: 'Topic clash upheld. Submit alternative proposal.'
      };
    case 'completed':
      return {
        label: 'Completed & Published',
        badgeClass: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300',
        description: 'Final review signed off. Archived in repository.'
      };
  }
}
