import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const outputDir = 'public/assets/report_figures';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Generate Use Case Diagram
function generateUseCaseDiagram() {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = '#18191E';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // System Boundary
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(180, 40, 440, 320);
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 14px "Times New Roman"';
  ctx.fillText('DBIT ProjectTrack System Boundary', 200, 65);

  // Actors
  const drawActor = (x, y, name) => {
    ctx.fillStyle = '#18191E';
    ctx.beginPath();
    ctx.arc(x, y - 20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 20);
    ctx.lineTo(x - 15, y + 45);
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 15, y + 45);
    ctx.moveTo(x - 18, y + 5);
    ctx.lineTo(x + 18, y + 5);
    ctx.strokeStyle = '#18191E';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Times New Roman"';
    ctx.textAlign = 'center';
    ctx.fillText(name, x, y + 62);
  };

  drawActor(90, 160, 'Student Actor');
  drawActor(710, 110, 'Faculty Guide');
  drawActor(710, 250, 'Coordinator');

  // Use Cases (Ovals)
  const useCases = [
    { x: 400, y: 100, label: 'UC-01: Submit Proposal & Abstract' },
    { x: 400, y: 160, label: 'UC-02: Real-time Similarity Check' },
    { x: 400, y: 220, label: 'UC-03: Arbitrate Topic Pitch Defense' },
    { x: 400, y: 280, label: 'UC-04: Sign-off Visual Stage Gates' },
    { x: 400, y: 330, label: 'UC-05: Log Feedback & Send Alerts' }
  ];

  useCases.forEach(uc => {
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#18191E';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(uc.x, uc.y, 160, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px "Times New Roman"';
    ctx.textAlign = 'center';
    ctx.fillText(uc.label, uc.x, uc.y + 4);
  });

  // Lines
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  
  // Student to UC 1, 2
  ctx.beginPath(); ctx.moveTo(110, 150); ctx.lineTo(240, 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(110, 160); ctx.lineTo(240, 160); ctx.stroke();

  // Guide to UC 4, 5
  ctx.beginPath(); ctx.moveTo(690, 110); ctx.lineTo(560, 280); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(690, 120); ctx.lineTo(560, 330); ctx.stroke();

  // Coordinator to UC 3
  ctx.beginPath(); ctx.moveTo(690, 250); ctx.lineTo(560, 220); ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'figure_2_1_usecase.png'), buffer);
  console.log('Generated figure_2_1_usecase.png');
}

// 2. Generate Activity Diagram
function generateActivityDiagram() {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#18191E';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px "Times New Roman"';
  ctx.textAlign = 'center';
  ctx.fillText('DBIT ProjectTrack Proposal & Gate Review Process Flow', width / 2, 35);

  // Swimlanes
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(270, 50); ctx.lineTo(270, 380); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(540, 50); ctx.lineTo(540, 380); ctx.stroke();

  ctx.font = 'bold 12px "Times New Roman"';
  ctx.fillText('Student Swimlane', 135, 65);
  ctx.fillText('Similarity Engine', 405, 65);
  ctx.fillText('Faculty Guide / Coordinator', 670, 65);

  // Nodes
  const drawNode = (x, y, w, h, text, isDecision = false) => {
    ctx.fillStyle = isDecision ? '#fef3c7' : '#f1f5f9';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    if (isDecision) {
      ctx.beginPath();
      ctx.moveTo(x, y - h / 2);
      ctx.lineTo(x + w / 2, y);
      ctx.lineTo(x, y + h / 2);
      ctx.lineTo(x - w / 2, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#0f172a';
    ctx.font = '10px "Times New Roman"';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y + 3);
  };

  drawNode(135, 110, 160, 32, '1. Enter Proposal & Abstract');
  drawNode(405, 110, 160, 32, '2. Run Real-Time Screening');
  drawNode(405, 200, 140, 40, 'Similarity >= 0.75?', true);
  drawNode(670, 200, 160, 32, '3. Coordinator Arbitration Queue');
  drawNode(670, 290, 160, 32, '4. Guide Evaluates Stage Gates');
  drawNode(135, 290, 160, 32, '5. Receives Approval & Feedback');

  // Arrows
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  const drawArrow = (x1, y1, x2, y2) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };

  drawArrow(215, 110, 325, 110);
  drawArrow(405, 126, 405, 180);
  drawArrow(475, 200, 590, 200); // Yes -> Conflict
  drawArrow(405, 220, 670, 274); // No -> Guide Review
  drawArrow(670, 232, 670, 274);
  drawArrow(590, 290, 215, 290);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'figure_2_2_activity.png'), buffer);
  console.log('Generated figure_2_2_activity.png');
}

// 3. Generate State Machine Diagram
function generateStateMachineDiagram() {
  const width = 800;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#18191E';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px "Times New Roman"';
  ctx.textAlign = 'center';
  ctx.fillText('Proposal Lifecycle & State Machine Transitions', width / 2, 35);

  const states = [
    { x: 80, y: 180, label: 'DRAFT' },
    { x: 230, y: 180, label: 'EVALUATING' },
    { x: 420, y: 100, label: 'UNDER_GUIDE_REVIEW' },
    { x: 420, y: 260, label: 'FLAGGED_CONFLICT' },
    { x: 620, y: 180, label: 'APPROVED' },
    { x: 740, y: 180, label: 'ARCHIVED' }
  ];

  states.forEach((st, idx) => {
    ctx.fillStyle = idx === 4 ? '#dcfce7' : idx === 3 ? '#fee2e2' : '#f8fafc';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(st.x - 55, st.y - 20, 110, 40, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px "Times New Roman"';
    ctx.textAlign = 'center';
    ctx.fillText(st.label, st.x, st.y + 4);
  });

  // Arrows
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(135, 180); ctx.lineTo(175, 180); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(285, 170); ctx.lineTo(365, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(285, 190); ctx.lineTo(365, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(475, 110); ctx.lineTo(565, 170); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(475, 250); ctx.lineTo(565, 190); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(675, 180); ctx.lineTo(685, 180); ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'figure_2_3_state.png'), buffer);
  console.log('Generated figure_2_3_state.png');
}

// 4. Generate Gantt Chart Diagram
function generateGanttChartDiagram() {
  const width = 800;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#18191E';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px "Times New Roman"';
  ctx.textAlign = 'center';
  ctx.fillText('DBIT ProjectTrack 14-Week Engineering Work Breakdown Gantt Chart', width / 2, 35);

  // Table header
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(20, 50, 760, 30);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 50, 760, 30);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px "Times New Roman"';
  ctx.textAlign = 'left';
  ctx.fillText('Experiment / Milestone Title', 30, 70);

  ctx.textAlign = 'center';
  for (let w = 1; w <= 14; w++) {
    ctx.fillText(`W${w}`, 250 + (w - 1) * 36, 70);
  }

  const tasks = [
    { name: 'Exp 1: Empathy & Problem Framing', start: 1, duration: 3, color: '#3b82f6' },
    { name: 'Exp 2: Literature & App Benchmark', start: 4, duration: 3, color: '#3b82f6' },
    { name: 'Exp 3: User Survey & Formulation', start: 5, duration: 2, color: '#3b82f6' },
    { name: 'Exp 4: UML Diagrams & Architecture', start: 7, duration: 2, color: '#3b82f6' },
    { name: '★ Review 1 Progress Evaluation', start: 8, duration: 1, color: '#eab308' },
    { name: 'Exp 5: Similarity Engine Dev', start: 9, duration: 3, color: '#10b981' },
    { name: 'Exp 6: Web Portal UI Implementation', start: 10, duration: 3, color: '#10b981' },
    { name: 'Exp 7: Integration & Review 2 Demo', start: 12, duration: 3, color: '#6366f1' }
  ];

  tasks.forEach((t, i) => {
    const y = 90 + i * 30;
    ctx.fillStyle = i % 2 === 0 ? '#f8fafc' : '#ffffff';
    ctx.fillRect(20, y, 760, 28);
    ctx.strokeRect(20, y, 760, 28);

    ctx.fillStyle = '#0f172a';
    ctx.font = '10px "Times New Roman"';
    ctx.textAlign = 'left';
    ctx.fillText(t.name, 25, y + 18);

    // Bar
    const bx = 232 + (t.start - 1) * 36;
    const bw = t.duration * 36 - 4;
    ctx.fillStyle = t.color;
    ctx.roundRect(bx, y + 4, bw, 20, 4);
    ctx.fill();
  });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'figure_2_4_gantt.png'), buffer);
  console.log('Generated figure_2_4_gantt.png');
}

// 5. Generate UI Walkthrough Diagram
function generateUIWalkthroughDiagram() {
  const width = 800;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#18191E';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px "Times New Roman"';
  ctx.textAlign = 'center';
  ctx.fillText('Chronological 5-Screen UI User Journey & CTA Mapping', width / 2, 35);

  const screens = [
    { title: '1. Landing Cockpit', bg: '#18191E', text: '#D4F938', desc: 'Bento widgets, role switch & metrics' },
    { title: '2. Proposals View', bg: '#f1f5f9', text: '#0f172a', desc: 'Sort by Newest / Originality & filters' },
    { title: '3. Action Submission', bg: '#f1f5f9', text: '#0f172a', desc: 'Real-time similarity meter check' },
    { title: '4. Pitch Defense', bg: '#18191E', text: '#D4F938', desc: 'Side-by-side merit arbitration' },
    { title: '5. Visual Stage Gate', bg: '#f1f5f9', text: '#0f172a', desc: '7 milestones + GitHub commit sync' }
  ];

  screens.forEach((s, idx) => {
    const x = 30 + idx * 150;
    const y = 60;
    const w = 138;
    const h = 250;

    ctx.fillStyle = s.bg;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // Top Bar inside screen mock
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, w, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px "Times New Roman"';
    ctx.textAlign = 'center';
    ctx.fillText(s.title, x + w / 2, y + 16);

    // Screen body placeholder lines
    ctx.fillStyle = s.text;
    ctx.font = 'bold 10px "Times New Roman"';
    ctx.fillText('DBIT ProjectTrack', x + w / 2, y + 50);

    ctx.fillStyle = '#64748b';
    ctx.font = '8px "Times New Roman"';
    ctx.fillText(s.desc, x + w / 2, y + 80);

    // Button CTA
    ctx.fillStyle = '#D4F938';
    ctx.roundRect(x + 10, y + 200, w - 20, 22, 6);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 8px "Times New Roman"';
    ctx.fillText('Trigger CTA →', x + w / 2, y + 214);
  });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'figure_5_1_ui.png'), buffer);
  console.log('Generated figure_5_1_ui.png');
}

generateUseCaseDiagram();
generateActivityDiagram();
generateStateMachineDiagram();
generateGanttChartDiagram();
generateUIWalkthroughDiagram();
