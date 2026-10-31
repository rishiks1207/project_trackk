/**
 * DBIT ProjectTrack - Similarity & Duplicate Detection Engine
 * Evaluates semantic and text overlap across project titles, problem statements, and abstracts.
 * Threshold >= 0.75 flags a topic conflict.
 */

import { SimilarityResult, HistoricalProject } from '../types';

// Common words list to ignore during matching
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
  'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'using', 'system', 'based', 'project', 'application', 'portal', 'platform', 'model', 'approach'
]);

// Topic domain concept clusters to capture conceptual similarity
const TOPIC_CLUSTERS: Record<string, string[]> = {
  traffic: ['traffic', 'congestion', 'signals', 'vehicles', 'intersections', 'roads', 'transport', 'cars'],
  vision: ['vision', 'yolo', 'opencv', 'cameras', 'surveillance', 'object', 'detection', 'image', 'visual'],
  blockchain: ['blockchain', 'web3', 'smart', 'contracts', 'ethereum', 'solidity', 'decentralized', 'ledger', 'crypto'],
  health: ['healthcare', 'medical', 'diagnosis', 'patients', 'hospital', 'clinical', 'radiology', 'mri', 'ct', 'tumor'],
  agriculture: ['agriculture', 'crop', 'farming', 'soil', 'irrigation', 'plants', 'fertilizer', 'harvest'],
  project_track: ['similarity', 'duplicate', 'proposals', 'review', 'screening', 'tracking', 'milestone', 'portal'],
  education: ['attendance', 'students', 'grading', 'classroom', 'exams', 'learning', 'academics', 'faculty'],
  security: ['cybersecurity', 'phishing', 'malware', 'intrusion', 'vulnerability', 'firewall', 'encryption', 'threat'],
  iot: ['iot', 'sensors', 'esp32', 'arduino', 'raspberry', 'hardware', 'telemetry'],
  voice: ['speech', 'voice', 'audio', 'transcription', 'microphone']
};

/**
 * Tokenizes text into normalized lowercase alphanumeric tokens, stripping common words
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Generates n-grams from token array
 */
export function getNGrams(tokens: string[], n: number = 2): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join('_'));
  }
  return ngrams;
}

/**
 * Computes cosine similarity between two term-frequency maps
 */
export function computeCosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key in vecA) {
    const valA = vecA[key];
    normA += valA * valA;
    if (key in vecB) {
      dotProduct += valA * vecB[key];
    }
  }

  for (const key in vecB) {
    normB += vecB[key] * vecB[key];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes term frequency vector for text
 */
export function computeTermFrequency(text: string): Record<string, number> {
  const tokens = tokenize(text);
  const bigrams = getNGrams(tokens, 2);
  const allFeatures = [...tokens, ...bigrams];

  const tf: Record<string, number> = {};
  for (const feature of allFeatures) {
    tf[feature] = (tf[feature] || 0) + 1;
  }
  return tf;
}

/**
 * Creates concept topic vector representing domain themes
 */
export function createTopicVector(text: string): Record<string, number> {
  const tokens = tokenize(text);
  const vec: Record<string, number> = {};

  for (const clusterKey in TOPIC_CLUSTERS) {
    vec[clusterKey] = 0;
  }

  for (const token of tokens) {
    for (const [clusterKey, keywords] of Object.entries(TOPIC_CLUSTERS)) {
      if (keywords.includes(token) || keywords.some(k => token.includes(k) || k.includes(token))) {
        vec[clusterKey] = (vec[clusterKey] || 0) + 2.0;
      }
    }
    const generalKey = `kw_${token}`;
    vec[generalKey] = (vec[generalKey] || 0) + 1.0;
  }

  return vec;
}

/**
 * Calculates similarity between two text snippets
 */
export function calculateHybridSimilarity(
  queryText: string,
  targetText: string
): { overallScore: number; sbertScore: number; tfidfScore: number } {
  if (!queryText.trim() || !targetText.trim()) {
    return { overallScore: 0, sbertScore: 0, tfidfScore: 0 };
  }

  // 1. Text word & bigram similarity
  const tfQuery = computeTermFrequency(queryText);
  const tfTarget = computeTermFrequency(targetText);
  const textSim = computeCosineSimilarity(tfQuery, tfTarget);

  // 2. Topic domain similarity
  const topicQuery = createTopicVector(queryText);
  const topicTarget = createTopicVector(targetText);
  const topicSim = computeCosineSimilarity(topicQuery, topicTarget);

  // 3. Jaccard token overlap
  const qTokens = new Set(tokenize(queryText));
  const tTokens = new Set(tokenize(targetText));
  let intersection = 0;
  qTokens.forEach(t => { if (tTokens.has(t)) intersection++; });
  const union = new Set([...qTokens, ...tTokens]).size;
  const jaccardSim = union > 0 ? intersection / union : 0;

  // Blended similarity score
  const blended = 0.55 * topicSim + 0.35 * textSim + 0.10 * jaccardSim;

  const normalizedOverall = Math.min(1.0, Math.max(0.0, Math.round(blended * 1000) / 1000));
  const normalizedTopic = Math.min(1.0, Math.max(0.0, Math.round(topicSim * 1000) / 1000));
  const normalizedText = Math.min(1.0, Math.max(0.0, Math.round(textSim * 1000) / 1000));

  return {
    overallScore: normalizedOverall,
    sbertScore: normalizedTopic,
    tfidfScore: normalizedText
  };
}

/**
 * Scans a proposal (including title, problem statement, and abstract) against past projects
 */
export function scanProposalSimilarity(
  title: string,
  abstract: string,
  historicalProjects: HistoricalProject[],
  problemStatement?: string
): SimilarityResult {
  const parts = [title, problemStatement, abstract].filter(p => p && p.trim().length > 0);
  const fullText = parts.join('. ');

  if (!fullText.trim()) {
    return {
      overallScore: 0,
      sbertScore: 0,
      tfidfScore: 0,
      isConflict: false,
      explanation: 'Enter project details to calculate topic similarity.'
    };
  }

  let highestScore = 0;
  let bestMatch: HistoricalProject | null = null;
  let bestScores = { topicSim: 0, textSim: 0 };

  for (const project of historicalProjects) {
    const targetText = [
      project.title,
      (project as any).problemStatement,
      project.abstract
    ].filter(p => p && p.trim().length > 0).join('. ');

    const sim = calculateHybridSimilarity(fullText, targetText);

    if (sim.overallScore > highestScore) {
      highestScore = sim.overallScore;
      bestMatch = project;
      bestScores = { topicSim: sim.sbertScore, textSim: sim.tfidfScore };
    }
  }

  const isConflict = highestScore >= 0.75;
  const originalityPercentage = Math.max(0, Math.min(100, Math.round((1 - highestScore) * 100)));

  // Simple, clean explanation text without technical jargon
  let explanation = '';
  const matchedSnippets: string[] = [];

  if (bestMatch && highestScore > 0.3) {
    const qTokens = tokenize(fullText);
    const mTokens = tokenize(`${bestMatch.title}. ${bestMatch.abstract}`);
    const overlapTokens = Array.from(new Set(qTokens.filter(t => mTokens.includes(t))));

    if (overlapTokens.length > 0) {
      matchedSnippets.push(`Matching keywords: ${overlapTokens.slice(0, 6).join(', ')}`);
    }

    if (isConflict) {
      explanation = `Topic Conflict Flagged (${(highestScore * 100).toFixed(0)}% similarity): High similarity detected with "${bestMatch.title}" (${bestMatch.academicYear}, Guide: ${bestMatch.guideName}). Pitch defense required for coordinator review.`;
    } else if (highestScore >= 0.50) {
      explanation = `Moderate Similarity (${(highestScore * 100).toFixed(0)}%): Some topic overlap with "${bestMatch.title}".`;
    } else {
      explanation = `High Originality (${originalityPercentage}%): Distinct topic proposal with low overlap.`;
    }
  } else {
    explanation = `High Originality (100%): Novel proposal. Zero project overlap detected.`;
  }

  const aiNoveltySuggestions: string[] = [];
  if (highestScore >= 0.60) {
    aiNoveltySuggestions.push('Narrow the target scope to a specific specialized feature or workflow.');
    aiNoveltySuggestions.push('Specify custom datasets, hardware integration, or unique deployment targets.');
    aiNoveltySuggestions.push('Highlight performance benchmarks in your Pitch Defense.');
  }

  return {
    overallScore: highestScore,
    sbertScore: bestScores.topicSim,
    tfidfScore: bestScores.textSim,
    matchedProjectId: bestMatch?.id,
    matchedProjectTitle: bestMatch?.title,
    matchedProjectYear: bestMatch?.academicYear,
    matchedSnippets,
    isConflict,
    explanation,
    aiNoveltySuggestions: aiNoveltySuggestions.length > 0 ? aiNoveltySuggestions : undefined
  };
}
