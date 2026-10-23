import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { 
  seedInitialDataIfNeeded, 
  getAllProposals, 
  getAllHistoricalProjects,
  insertProposal,
  updateProposalStatus,
  updateStageGate,
  insertFeedback
} from './src/db/queries.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Get all proposals with stage-gates and feedback
app.get('/api/proposals', async (_req, res) => {
  try {
    const data = await getAllProposals();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch proposals' });
  }
});

// 2. Get historical projects
app.get('/api/historical-projects', async (_req, res) => {
  try {
    const data = await getAllHistoricalProjects();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching historical projects:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch historical projects' });
  }
});

// 3. Create new proposal
app.post('/api/proposals', async (req, res) => {
  try {
    const newProposal = await insertProposal(req.body);
    res.status(201).json(newProposal);
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: error.message || 'Failed to create proposal' });
  }
});

// 4. Update proposal status (arbitration, guide approval)
app.put('/api/proposals/:id/status', async (req, res) => {
  try {
    const { status, lockedTopic } = req.body;
    const updated = await updateProposalStatus(req.params.id, status, lockedTopic);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ error: error.message || 'Failed to update proposal status' });
  }
});

// 5. Update stage gate
app.put('/api/stage-gates/:id', async (req, res) => {
  try {
    const updated = await updateStageGate(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating stage gate:', error);
    res.status(500).json({ error: error.message || 'Failed to update stage gate' });
  }
});

// 6. Log feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = await insertFeedback(req.body);
    res.status(201).json(feedback);
  } catch (error: any) {
    console.error('Error logging feedback:', error);
    res.status(500).json({ error: error.message || 'Failed to log feedback' });
  }
});

// Health / status endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    database: 'Cloud SQL PostgreSQL (Developer Edition)',
    region: 'asia-southeast1',
    orm: 'Drizzle ORM',
    sbertThreshold: 0.75
  });
});

async function startServer() {
  // Seed PostgreSQL tables if first boot
  try {
    await seedInitialDataIfNeeded();
  } catch (e) {
    console.warn('Initial seed deferred:', e);
  }

  // Mount Vite middlewares in dev mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DBIT ProjectTrack full-stack server running on http://0.0.0.0:${PORT} with Cloud SQL PostgreSQL`);
  });
}

startServer();
