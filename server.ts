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
  insertFeedback,
  getAllUsers,
  createUserAccount,
  deleteUserAccount,
  updateUserPassword,
  createGuideMessage,
  getGuideMessages,
  authenticateUser
} from './src/db/queries.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ---------------- AUTH & USER ACCOUNT APIS ----------------

// 1. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify email and password.' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
});

// 2. Get All Users (for Admin Panel & Project linkage)
app.get('/api/users', async (_req, res) => {
  try {
    const userList = await getAllUsers();
    res.json(userList);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

// 3. Admin: Create New Account
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, password, rollNo, department, cohort, groupNo, trackNo } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required.' });
    }
    const newUser = await createUserAccount({
      name,
      email,
      role,
      password,
      rollNo,
      department,
      cohort,
      groupNo,
      trackNo
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user account:', error);
    res.status(500).json({ error: error.message || 'Failed to create user account' });
  }
});

// 4. Admin / Self: Update User Password
app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.trim().length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }
    const updated = await updateUserPassword(parseInt(req.params.id), password);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'Password updated successfully.', user: updated });
  } catch (error: any) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: error.message || 'Failed to update password' });
  }
});

// 5. Admin: Delete User Account
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await deleteUserAccount(parseInt(req.params.id));
    res.json(deleted);
  } catch (error: any) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: error.message || 'Failed to delete user account' });
  }
});

// 6. Guide Messages (Direct notices to student groups)
app.get('/api/messages', async (req, res) => {
  try {
    const groupNo = req.query.groupNo ? Number(req.query.groupNo) : undefined;
    const messages = await getGuideMessages(groupNo);
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching guide messages:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch guide messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { senderName, senderRole, targetGroupNo, subject, message, urgency } = req.body;
    if (!senderName || !targetGroupNo || !subject || !message) {
      return res.status(400).json({ error: 'Sender, target group, subject, and message are required.' });
    }
    const newMsg = await createGuideMessage({
      senderName,
      senderRole,
      targetGroupNo,
      subject,
      message,
      urgency
    });
    res.status(201).json(newMsg);
  } catch (error: any) {
    console.error('Error creating guide message:', error);
    res.status(500).json({ error: error.message || 'Failed to create guide message' });
  }
});

app.post('/api/messages/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { senderName, senderRole, senderEmail, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }
    const reply = {
      id: `reply-${Date.now()}`,
      senderName: senderName || 'User',
      senderRole: senderRole || 'student',
      senderEmail: senderEmail || '',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    res.status(201).json(reply);
  } catch (error: any) {
    console.error('Error recording message reply:', error);
    res.status(500).json({ error: error.message || 'Failed to record reply' });
  }
});

// ---------------- PROPOSAL & STAGE-GATE APIS ----------------

// 5. Get all proposals with stage-gates and feedback
app.get('/api/proposals', async (_req, res) => {
  try {
    const data = await getAllProposals();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch proposals' });
  }
});

// 6. Get historical projects
app.get('/api/historical-projects', async (_req, res) => {
  try {
    const data = await getAllHistoricalProjects();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching historical projects:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch historical projects' });
  }
});

// 7. Create new proposal
app.post('/api/proposals', async (req, res) => {
  try {
    const newProposal = await insertProposal(req.body);
    res.status(201).json(newProposal);
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: error.message || 'Failed to create proposal' });
  }
});

// 8. Update proposal status (arbitration, guide approval)
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

// 9. Update stage gate
app.put('/api/stage-gates/:id', async (req, res) => {
  try {
    const updated = await updateStageGate(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating stage gate:', error);
    res.status(500).json({ error: error.message || 'Failed to update stage gate' });
  }
});

// 10. Log feedback
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
