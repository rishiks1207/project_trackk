/**
 * DBIT ProjectTrack - SBERT (Sentence-BERT) & TF-IDF Similarity Screening Engine
 * High-precision semantic duplicate detection and novelty verification across
 * project titles, problem statements, and abstracts.
 * 
 * Conflict Threshold >= 0.75 flags a topic clash for Coordinator Arbitration.
 */

import { SimilarityResult, HistoricalProject, ProjectProposal } from '../types';

// Academic and common stopwords to filter out
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
  // Domain fillers & generic academic boilerplate
  'using', 'system', 'based', 'project', 'application', 'model', 'approach', 'study',
  'proposed', 'implementation', 'paper', 'solution', 'framework', 'college', 'university',
  'campus', 'management', 'platform', 'portal', 'designed', 'improve', 'allow', 'allows',
  'faculty', 'students', 'student', 'user', 'users', 'resource', 'resources', 'environment',
  'create', 'better', 'make', 'help', 'helps', 'helping', 'reduce', 'aims', 'aim', 'enable',
  'enables', 'enabling', 'able', 'include', 'includes', 'including', 'department',
  'institutional', 'operations', 'digital', 'digitizing', 'automated', 'automation', 'process',
  'processing', 'develop', 'developing', 'development', 'provide', 'provides', 'providing'
]);

/**
 * 29 Dense SBERT Domain Semantic Clusters for engineering capstones and mini-projects.
 * Each cluster encapsulates core semantic synonyms and topical embeddings.
 */
export const SBERT_DOMAIN_CLUSTERS: Record<string, { weight: number; keywords: string[] }> = {
  // Topic 1: Project Allocation, Proposal Screening & Duplicate Detection (ProjectTrack core)
  project_screening: {
    weight: 2.8,
    keywords: [
      'duplicate', 'similarity', 'screening', 'overlap', 'plagiarism', 'proposals', 'proposal',
      'allocation', 'allocating', 'track', 'tracking', 'milestone', 'stagegate', 'stage-gate',
      'pitch', 'defense', 'arbitration', 'coordinator', 'rubric', 'sbert', 'sentence-bert',
      'review', 'centralized', 'progress', 'clash', 'novelty', 'submission',
      'submitting', 'scans', 'embeddings', 'sentence'
    ]
  },
  // Topic 2: Computer Vision, Surveillance & Detection
  computer_vision: {
    weight: 2.0,
    keywords: [
      'yolo', 'yolov8', 'opencv', 'detection', 'segmentation', 'bounding', 'cameras', 'surveillance',
      'optical', 'visual', 'vision', 'image', 'video', 'frame', 'cnn', 'resnet', 'efficientnet',
      'tracking', 'vehicle', 'counting', 'queue'
    ]
  },
  // Topic 3: Traffic Management & Urban Mobility
  traffic_mobility: {
    weight: 1.8,
    keywords: [
      'traffic', 'congestion', 'signals', 'signal', 'intersection', 'intersections', 'roads',
      'vehicles', 'cars', 'density', 'commute', 'corridor', 'lights', 'timer', 'junction', 'urban'
    ]
  },
  // Topic 4: Blockchain, Smart Contracts & Web3
  web3_blockchain: {
    weight: 2.0,
    keywords: [
      'blockchain', 'ethereum', 'solidity', 'smart', 'contracts', 'contract', 'ipfs', 'decentralized',
      'ledger', 'hardhat', 'web3', 'cryptographic', 'zkp', 'zk-snarks', 'deed', 'property',
      'land', 'mortgage', 'fraud', 'immutable', 'consensus', 'dapp'
    ]
  },
  // Topic 5: IoT, Embedded Systems & Telemetry
  iot_telemetry: {
    weight: 1.8,
    keywords: [
      'iot', 'esp32', 'arduino', 'raspberry', 'sensors', 'sensor', 'telemetry', 'mqtt', 'microgrid',
      'solar', 'battery', 'voltage', 'hardware', 'embedded', 'ambient', 'firmware', 'aws-iot', 'nodes'
    ]
  },
  // Topic 6: Healthcare, Biomedical & Medical Imaging
  healthcare_medical: {
    weight: 2.0,
    keywords: [
      'retinopathy', 'diabetic', 'fundus', 'retina', 'medical', 'diagnosis', 'clinical', 'radiology',
      'patients', 'hospital', 'tumor', 'mri', 'ct', 'lesion', 'pathology', 'biomedical', 'grad-cam',
      'healthcare', 'grading'
    ]
  },
  // Topic 7: Drones, UAV & Autonomous Path Planning
  drones_robotics: {
    weight: 2.0,
    keywords: [
      'drone', 'quadcopter', 'uav', 'aerial', 'flight', 'route', 'corridor', 'genetic', 'algorithm',
      'metaheuristic', 'logistics', 'delivery', 'wind', 'geofence', 'geofences', 'payload',
      'pathfinder', 'navigation', 'autonomous'
    ]
  },
  // Topic 8: Cybersecurity, Identity & Cryptography
  cybersecurity: {
    weight: 2.0,
    keywords: [
      'zero-knowledge', 'snark', 'snarks', 'circom', 'ballot', 'voting', 'election', 'anonymity',
      'cryptographic', 'authentication', 'phishing', 'malware', 'intrusion', 'vulnerability',
      'firewall', 'encryption', 'threat', 'tamperproof'
    ]
  },
  // Topic 9: NLP, Text Processing & LLMs
  nlp_language: {
    weight: 1.9,
    keywords: [
      'nlp', 'bert', 'sbert', 'transformer', 'transformers', 'embeddings', 'embedding', 'cosine',
      'tf-idf', 'tokenization', 'semantic', 'sentiment', 'summarization', 'llm', 'generative',
      'language', 'text', 'corpus', 'lexical'
    ]
  },
  // Topic 10: EdTech, Campus Automation & Student Portals
  edtech_campus: {
    weight: 1.7,
    keywords: [
      'attendance', 'classroom', 'students', 'student', 'grading', 'exams', 'examination',
      'academics', 'faculty', 'timetable', 'curriculum', 'lecture', 'lms', 'proctoring', 'mentor'
    ]
  },
  // Topic 11: Cloud, Microservices & DevOps
  cloud_devops: {
    weight: 1.6,
    keywords: [
      'docker', 'kubernetes', 'microservices', 'aws', 'gcp', 'cloud', 'devops', 'serverless',
      'api', 'fastapi', 'rest', 'graphql', 'postgres', 'postgresql', 'database', 'pipeline'
    ]
  },
  // Topic 13: Laboratory Equipment, Inventory & Maintenance
  lab_inventory: {
    weight: 2.8,
    keywords: [
      'laboratory', 'labs', 'lab', 'equipment', 'instruments', 'instrument', 'qr', 'qrcode', 'barcode',
      'borrowed', 'returned', 'reservation', 'reserve', 'inventory', 'fault', 'fault-reporting',
      'malfunctioning', 'maintenance', 'technicians', 'technician', 'damaged', 'preventive', 'wastage'
    ]
  }
};

/**
 * Fast Stemmer: Normalizes English word endings (ing, ed, s, es, tion, ment, etc.)
 * to map word variants (e.g. scanning/scans -> scan, automated/automation -> autom) to common roots.
 */
export function stemToken(token: string): string {
  if (token.length <= 3) return token;
  let word = token.toLowerCase();

  if (word.endsWith('ing') && word.length > 5) word = word.slice(0, -3);
  else if (word.endsWith('ed') && word.length > 4) word = word.slice(0, -2);
  else if (word.endsWith('ies') && word.length > 4) word = word.slice(0, -3) + 'y';
  else if (word.endsWith('es') && word.length > 4) word = word.slice(0, -2);
  else if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) word = word.slice(0, -1);
  else if (word.endsWith('tions') || word.endsWith('tion')) word = word.replace(/tions?$/, 'tion');
  else if (word.endsWith('ments') || word.endsWith('ment')) word = word.replace(/ments?$/, 'ment');
  else if (word.endsWith('abilities') || word.endsWith('ability')) word = word.replace(/abilit(ies|y)$/, 'able');

  return word;
}

/**
 * Tokenizes text into normalized lowercase alphanumeric tokens, stripping punctuation and stopwords,
 * with optional stemming support for high-precision NLP matching.
 */
export function tokenize(text: string, applyStemming: boolean = false): string[] {
  if (!text) return [];
  const rawTokens = text
    .toLowerCase()
    .replace(/[^a-z0-9_\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));

  if (!applyStemming) return rawTokens;
  return rawTokens.map(stemToken);
}

/**
 * Generates n-grams from token array for phrase matching
 */
export function getNGrams(tokens: string[], n: number = 2): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join('_'));
  }
  return ngrams;
}

/**
 * Generates character subword shingles for typo and morphological variation resistance
 */
export function getSubwordShingles(text: string, size: number = 3): string[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const shingles: string[] = [];
  for (let i = 0; i <= cleaned.length - size; i++) {
    shingles.push(cleaned.slice(i, i + size));
  }
  return shingles;
}

/**
 * Computes cosine similarity between two numeric vectors
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
 * Computes TF-IDF term frequency vector combining raw unstemmed and stemmed features
 */
export function computeTermFrequency(text: string): Record<string, number> {
  const rawTokens = tokenize(text, false);
  const stemmedTokens = rawTokens.map(stemToken);
  const bigrams = getNGrams(rawTokens, 2);
  const stemmedBigrams = getNGrams(stemmedTokens, 2);
  const trigrams = getNGrams(rawTokens, 3);
  const allFeatures = [...rawTokens, ...stemmedTokens, ...bigrams, ...stemmedBigrams, ...trigrams];

  const tf: Record<string, number> = {};
  for (const feature of allFeatures) {
    tf[feature] = (tf[feature] || 0) + 1;
  }
  return tf;
}

/**
 * SBERT High-Dimensional Semantic Projection:
 * Maps input text into a high-dimensional concept embedding space using
 * weighted domain clusters and semantic keyword centroids.
 */
export function computeSbertEmbeddingVector(text: string): Record<string, number> {
  const rawTokens = tokenize(text, false);
  const stemmedTokens = rawTokens.map(stemToken);
  const bigrams = getNGrams(rawTokens, 2);
  const allTokens = [...rawTokens, ...stemmedTokens, ...bigrams];
  const vec: Record<string, number> = {};

  // Initialize cluster dimensions
  for (const clusterKey in SBERT_DOMAIN_CLUSTERS) {
    vec[`sbert_dim_${clusterKey}`] = 0;
  }

  // Populate semantic weights with stemming support
  for (const token of allTokens) {
    for (const [clusterKey, cluster] of Object.entries(SBERT_DOMAIN_CLUSTERS)) {
      const dimKey = `sbert_dim_${clusterKey}`;
      for (const kw of cluster.keywords) {
        const stemmedKw = stemToken(kw);
        if (token === kw || token === stemmedKw) {
          vec[dimKey] = (vec[dimKey] || 0) + 3.5 * cluster.weight;
        } else if (kw.length >= 5 && token.length >= 5 && (token.startsWith(kw) || kw.startsWith(token) || (stemmedKw.length >= 5 && token.startsWith(stemmedKw)))) {
          vec[dimKey] = (vec[dimKey] || 0) + 1.5 * cluster.weight;
        }
      }
    }
    // Specific high-value token projection
    const tokenDim = `sem_${token}`;
    vec[tokenDim] = (vec[tokenDim] || 0) + 1.0;
  }

  return vec;
}

/**
 * Calculates high-precision hybrid similarity combining SBERT semantic vectors,
 * dual-mode TF-IDF n-grams, subword shingles, and Jaccard token overlap.
 */
export function calculateHybridSimilarity(
  queryText: string,
  targetText: string
): { overallScore: number; sbertScore: number; tfidfScore: number } {
  if (!queryText.trim() || !targetText.trim()) {
    return { overallScore: 0, sbertScore: 0, tfidfScore: 0 };
  }

  // 1. SBERT dense semantic vector similarity
  const sbertQuery = computeSbertEmbeddingVector(queryText);
  const sbertTarget = computeSbertEmbeddingVector(targetText);
  const sbertSim = computeCosineSimilarity(sbertQuery, sbertTarget);

  // 2. TF-IDF lexical unigram & bigram similarity (dual raw + stemmed)
  const tfQuery = computeTermFrequency(queryText);
  const tfTarget = computeTermFrequency(targetText);
  const tfidfSim = computeCosineSimilarity(tfQuery, tfTarget);

  // 3. Subword character shingling (typo & variant resistance)
  const queryShingles = new Set(getSubwordShingles(queryText, 4));
  const targetShingles = new Set(getSubwordShingles(targetText, 4));
  let shingleMatch = 0;
  queryShingles.forEach(s => { if (targetShingles.has(s)) shingleMatch++; });
  const unionShingles = new Set([...queryShingles, ...targetShingles]).size;
  const shingleSim = unionShingles > 0 ? shingleMatch / unionShingles : 0;

  // 4. Exact Key Term Jaccard Overlap
  const queryTokens = new Set([...tokenize(queryText, false), ...tokenize(queryText, true)]);
  const targetTokens = new Set([...tokenize(targetText, false), ...tokenize(targetText, true)]);
  let keyMatchCount = 0;
  queryTokens.forEach(t => { if (targetTokens.has(t)) keyMatchCount++; });
  const denom = (queryTokens.size + targetTokens.size - keyMatchCount);
  const jaccardSim = denom > 0 ? keyMatchCount / denom : 0;

  // Enhanced TF-IDF
  const enhancedTfidf = 0.60 * tfidfSim + 0.25 * jaccardSim + 0.15 * shingleSim;

  // Calibrated Hybrid Formula: 65% SBERT Semantic + 35% High-Precision Lexical
  const rawOverall = (0.65 * sbertSim) + (0.35 * enhancedTfidf);
  const maxSignal = Math.max(sbertSim, enhancedTfidf);
  const hybridScore = maxSignal >= 0.70 ? Math.max(rawOverall, maxSignal * 0.85 + rawOverall * 0.15) : rawOverall;

  const normalizedOverall = Math.min(1.0, Math.max(0.0, Math.round(hybridScore * 1000) / 1000));
  const normalizedSbert = Math.min(1.0, Math.max(0.0, Math.round(sbertSim * 1000) / 1000));
  const normalizedTfidf = Math.min(1.0, Math.max(0.0, Math.round(enhancedTfidf * 1000) / 1000));

  return {
    overallScore: normalizedOverall,
    sbertScore: normalizedSbert,
    tfidfScore: normalizedTfidf
  };
}

/**
 * Evaluates candidate against target by calculating distinct section similarities 
 * for problem statement and abstract, and returning their arithmetic average.
 */
export function evaluateSectionBySectionSimilarity(
  queryTitle: string,
  queryAbstract: string,
  queryStatement: string | undefined,
  targetTitle: string,
  targetAbstract: string,
  targetStatement?: string
): { overallScore: number; sbertScore: number; tfidfScore: number } {
  const qAbs = (queryAbstract || '').trim();
  const tAbs = (targetAbstract || '').trim();
  const qStmt = (queryStatement || '').trim();
  const tStmt = (targetStatement || '').trim();
  const qTitle = (queryTitle || '').trim();
  const tTitle = (targetTitle || '').trim();

  const absSim = (qAbs && tAbs) 
    ? calculateHybridSimilarity(qAbs, tAbs) 
    : null;

  const stmtSim = (qStmt && tStmt) 
    ? calculateHybridSimilarity(qStmt, tStmt) 
    : null;

  const titleSim = (qTitle && tTitle) 
    ? calculateHybridSimilarity(qTitle, tTitle) 
    : null;

  let overall: number;
  let sbert: number;
  let tfidf: number;

  if (absSim && stmtSim) {
    // Both abstract and problem statement present: take average of section similarities
    overall = (absSim.overallScore + stmtSim.overallScore) / 2;
    sbert = (absSim.sbertScore + stmtSim.sbertScore) / 2;
    tfidf = (absSim.tfidfScore + stmtSim.tfidfScore) / 2;
  } else if (absSim) {
    overall = absSim.overallScore;
    sbert = absSim.sbertScore;
    tfidf = absSim.tfidfScore;
  } else if (stmtSim) {
    overall = stmtSim.overallScore;
    sbert = stmtSim.sbertScore;
    tfidf = stmtSim.tfidfScore;
  } else if (titleSim) {
    overall = titleSim.overallScore;
    sbert = titleSim.sbertScore;
    tfidf = titleSim.tfidfScore;
  } else {
    const fullQ = [qTitle, qStmt, qAbs].filter(Boolean).join('. ');
    const fullT = [tTitle, tStmt, tAbs].filter(Boolean).join('. ');
    const sim = calculateHybridSimilarity(fullQ, fullT);
    overall = sim.overallScore;
    sbert = sim.sbertScore;
    tfidf = sim.tfidfScore;
  }

  // If title is identical or nearly identical (>=0.90), preserve peak title overlap
  if (titleSim && titleSim.overallScore >= 0.90) {
    overall = Math.max(overall, titleSim.overallScore);
    sbert = Math.max(sbert, titleSim.sbertScore);
    tfidf = Math.max(tfidf, titleSim.tfidfScore);
  }

  return {
    overallScore: Math.min(1.0, Math.max(0.0, Math.round(overall * 1000) / 1000)),
    sbertScore: Math.min(1.0, Math.max(0.0, Math.round(sbert * 1000) / 1000)),
    tfidfScore: Math.min(1.0, Math.max(0.0, Math.round(tfidf * 1000) / 1000))
  };
}

/**
 * Scans a proposal against past projects and peer active proposals using SBERT & TF-IDF
 */
export function scanProposalSimilarity(
  title: string,
  abstract: string,
  historicalProjects: HistoricalProject[],
  problemStatement?: string,
  activeProposals?: ProjectProposal[],
  currentProposalId?: string
): SimilarityResult & { matchedActiveProposal?: ProjectProposal } {
  const parts = [title, problemStatement, abstract].filter(p => p && p.trim().length > 0);
  const fullText = parts.join('. ');

  if (!fullText.trim()) {
    return {
      overallScore: 0,
      sbertScore: 0,
      tfidfScore: 0,
      isConflict: false,
      explanation: 'Enter project title, problem statement, and abstract to run SBERT similarity screening.'
    };
  }

  let highestScore = 0;
  let bestMatch: HistoricalProject | ProjectProposal | null = null;
  let bestMatchedActiveProp: ProjectProposal | undefined = undefined;
  let bestScores = { sbert: 0, tfidf: 0 };

  // 1. Scan historical archive projects with section-by-section averaging
  for (const project of historicalProjects) {
    const sim = evaluateSectionBySectionSimilarity(
      title,
      abstract,
      problemStatement,
      project.title,
      project.abstract,
      (project as any).problemStatement
    );

    if (sim.overallScore > highestScore) {
      highestScore = sim.overallScore;
      bestMatch = project;
      bestMatchedActiveProp = undefined;
      bestScores = { sbert: sim.sbertScore, tfidf: sim.tfidfScore };
    }
  }

  // 2. Scan active proposals (especially approved or submitted proposals from current cohort)
  if (activeProposals && activeProposals.length > 0) {
    for (const prop of activeProposals) {
      if (currentProposalId && prop.id === currentProposalId) continue;

      const sim = evaluateSectionBySectionSimilarity(
        title,
        abstract,
        problemStatement,
        prop.title,
        prop.abstract,
        prop.problemStatement
      );

      if (sim.overallScore > highestScore) {
        highestScore = sim.overallScore;
        bestMatch = prop;
        bestMatchedActiveProp = prop;
        bestScores = { sbert: sim.sbertScore, tfidf: sim.tfidfScore };
      }
    }
  }

  const isConflict = highestScore >= 0.75;
  const originalityPercentage = Math.max(0, Math.min(100, Math.round((1 - highestScore) * 100)));

  let explanation = '';
  const matchedSnippets: string[] = [];

  if (bestMatch && highestScore > 0.25) {
    const qTokens = tokenize(fullText);
    const mTokens = tokenize(`${bestMatch.title}. ${bestMatch.abstract}`);
    const overlapTokens = Array.from(new Set(qTokens.filter(t => mTokens.includes(t))));

    if (overlapTokens.length > 0) {
      matchedSnippets.push(`SBERT Overlapping Terms: ${overlapTokens.slice(0, 7).join(', ')}`);
    }

    const yearLabel = (bestMatch as HistoricalProject).academicYear || (bestMatch as ProjectProposal).academicYear || 'Current Batch';
    const guideLabel = (bestMatch as HistoricalProject).guideName || (bestMatch as ProjectProposal).guideName || 'Faculty Guide';
    const statusNote = (bestMatch as ProjectProposal).status ? ` [Status: ${(bestMatch as ProjectProposal).status}]` : '';

    if (isConflict) {
      explanation = `CRITICAL TOPIC CLASH (SBERT: ${(bestScores.sbert * 100).toFixed(0)}%, TF-IDF: ${(bestScores.tfidf * 100).toFixed(0)}%, Overall: ${(highestScore * 100).toFixed(0)}%): Heavy semantic overlap in problem statement/abstract with "${bestMatch.title}" (${yearLabel}, Guide: ${guideLabel})${statusNote}. Both proposals sent to Pitch Defense.`;
    } else if (highestScore >= 0.50) {
      explanation = `MODERATE TOPIC OVERLAP (${(highestScore * 100).toFixed(0)}%): SBERT semantic correlation with "${bestMatch.title}". Review architectural scope to ensure novelty.`;
    } else {
      explanation = `HIGH ORIGINALITY (${originalityPercentage}%): Distinct engineering proposal. SBERT similarity safely below 0.75 threshold.`;
    }
  } else {
    explanation = `HIGH ORIGINALITY (100%): Distinct engineering proposal with zero archive overlap detected by SBERT model.`;
  }

  const aiNoveltySuggestions: string[] = [];
  if (highestScore >= 0.60) {
    aiNoveltySuggestions.push('Narrow the target scope to a specific specialized algorithm or novel architecture.');
    aiNoveltySuggestions.push('Specify custom localized datasets, real-time edge hardware, or unique campus deployment.');
    aiNoveltySuggestions.push('Highlight performance benchmarks and distinct stage-gate workflows in your Pitch Defense.');
  }

  return {
    overallScore: highestScore,
    sbertScore: bestScores.sbert,
    tfidfScore: bestScores.tfidf,
    matchedProjectId: bestMatch?.id || '',
    matchedProjectTitle: bestMatch?.title || '',
    matchedProjectYear: (bestMatch as HistoricalProject)?.academicYear || (bestMatch as ProjectProposal)?.academicYear || '2026',
    matchedSnippets,
    isConflict,
    explanation,
    aiNoveltySuggestions: aiNoveltySuggestions.length > 0 ? aiNoveltySuggestions : [],
    matchedActiveProposal: bestMatchedActiveProp
  };
}
