const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function generateFinalPresentation() {
  const templatePath = path.join(__dirname, '../public/assets/aistudio/Final_Presentation_Template_a71bd26b.pdf');
  const review1Path = path.join(__dirname, '../public/assets/aistudio/SE_Mini_Project_Review_1_Presentation_Final.pptx_e1860b59.pdf');
  const outputPath = path.join(__dirname, '../public/assets/aistudio/Final_Review_Presentation_Filled.pdf');

  const templateBytes = fs.readFileSync(templatePath);
  const doc = await PDFDocument.load(templateBytes);

  const review1Bytes = fs.readFileSync(review1Path);
  const review1Doc = await PDFDocument.load(review1Bytes);

  // Fonts
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Colors
  const black = rgb(0.09, 0.10, 0.12);
  const darkSlate = rgb(0.2, 0.25, 0.32);
  const mutedText = rgb(0.38, 0.44, 0.52);
  const lightMuted = rgb(0.55, 0.60, 0.68);
  const dbitBlue = rgb(0.08, 0.28, 0.52);
  const accentLime = rgb(0.83, 0.98, 0.22);
  const accentPurple = rgb(0.78, 0.71, 0.99);
  const bgLightCard = rgb(0.96, 0.97, 0.98);
  const cardBorder = rgb(0.88, 0.90, 0.94);
  const white = rgb(1, 1, 1);
  const redHighlight = rgb(0.85, 0.2, 0.2);
  const greenHighlight = rgb(0.12, 0.65, 0.35);

  const pages = doc.getPages();
  const W = 960;
  const H = 540;

  // Helper function to draw rounded-like or clean rectangle with border
  function drawCard(page, x, y, width, height, bgColor, borderColor = null, borderWidth = 1) {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: bgColor,
      borderColor: borderColor || bgColor,
      borderWidth: borderColor ? borderWidth : 0,
    });
  }

  // Helper to wrap text into lines based on max width
  function wrapText(text, font, size, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // ==========================================
  // SLIDE 1: Title Slide (Cover)
  // ==========================================
  {
    const p1 = pages[0];
    // Clear template placeholders below the subject title (from y=20 to y=420)
    p1.drawRectangle({
      x: 30,
      y: 20,
      width: W - 60,
      height: 400,
      color: white,
    });

    // Subject tag
    p1.drawText('25CE3CEP01: MINI PROJECT I COMMUNITY ENGAGEMENT PROJECT (CEP)', {
      x: 105,
      y: 432,
      size: 19,
      font: helvBold,
      color: black,
    });

    // Track & Group Badge
    const trackBadgeText = 'Track No. 7  •  Group No. 5';
    const badgeW = 280;
    drawCard(p1, (W - badgeW) / 2, 375, badgeW, 30, bgLightCard, dbitBlue, 1.2);
    p1.drawText(trackBadgeText, {
      x: (W - badgeW) / 2 + 35,
      y: 384,
      size: 14,
      font: helvBold,
      color: dbitBlue,
    });

    // Main Project Title
    const titleText = 'Centralized Project Proposal & Progress Tracking Portal';
    const subTitleText = '(DBIT ProjectTrack)';
    const titleW = helvBold.widthOfTextAtSize(titleText, 25);
    const subTitleW = helvBold.widthOfTextAtSize(subTitleText, 21);

    p1.drawText(titleText, {
      x: (W - titleW) / 2,
      y: 326,
      size: 25,
      font: helvBold,
      color: black,
    });

    p1.drawText(subTitleText, {
      x: (W - subTitleW) / 2,
      y: 298,
      size: 21,
      font: helvBold,
      color: dbitBlue,
    });

    // Academic Cohort tag
    const cohortText = 'SE Mini Project-I (Semester III) | Academic Year 2026–27 | Class: SE COMPS C (Batch A)';
    const cohortW = helv.widthOfTextAtSize(cohortText, 12);
    p1.drawText(cohortText, {
      x: (W - cohortW) / 2,
      y: 268,
      size: 12,
      font: helv,
      color: mutedText,
    });

    // Presented By Section (No table borders, elegant presentation without NOTE)
    p1.drawText('Presented By:', {
      x: 160,
      y: 195,
      size: 14,
      font: helvBold,
      color: black,
    });

    const students = [
      { name: 'Apoorvadeep Sinha (Leader)', roll: 'Roll No. 01' },
      { name: 'Ron Barretto', roll: 'Roll No. 05' },
      { name: 'Rishik Ezhuthachan', roll: 'Roll No. 15' },
      { name: 'Aryan Gaikwad', roll: 'Roll No. 17' },
    ];

    students.forEach((st, idx) => {
      const yPos = 195 - idx * 24;
      p1.drawText(st.name, {
        x: 310,
        y: yPos,
        size: 13,
        font: idx === 0 ? helvBold : helv,
        color: black,
      });
      p1.drawText(st.roll, {
        x: 550,
        y: yPos,
        size: 13,
        font: helvBold,
        color: darkSlate,
      });
    });

    // Internal Project Guides & Coordinator
    p1.drawText('Guide:', {
      x: 160,
      y: 72,
      size: 13,
      font: helvBold,
      color: black,
    });
    p1.drawText('Ms. Harleen Kaur Plaha  \\  Mr. Nazareth Remedios', {
      x: 230,
      y: 72,
      size: 13,
      font: helvBold,
      color: dbitBlue,
    });

    p1.drawText('Project Coordinator:', {
      x: 590,
      y: 72,
      size: 13,
      font: helvBold,
      color: black,
    });
    p1.drawText('Prof. Meenal Kulkarni', {
      x: 745,
      y: 72,
      size: 13,
      font: helvBold,
      color: dbitBlue,
    });
  }

  // ==========================================
  // SLIDE 2: Introduction
  // ==========================================
  {
    const p2 = pages[1];
    p2.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    // Overview Statement Banner
    drawCard(p2, 50, 360, W - 100, 52, bgLightCard, dbitBlue, 1);
    p2.drawText('DBIT ProjectTrack is a centralized web portal that automates topic screening, faculty review, and milestone tracking', {
      x: 65,
      y: 390,
      size: 13,
      font: helvBold,
      color: black,
    });
    p2.drawText('for undergraduate project courses (CEP, SE/TE Mini Projects, and Capstone) across DBIT Computer Engineering.', {
      x: 65,
      y: 372,
      size: 12,
      font: helv,
      color: darkSlate,
    });

    // 3 Structured Feature Columns
    const colW = 270;
    const gap = 25;
    const startX = 60;
    const colY = 90;
    const colH = 245;

    // Col 1: Academic Lifecycle
    drawCard(p2, startX, colY, colW, colH, white, cardBorder, 1.2);
    drawCard(p2, startX, colY + colH - 34, colW, 34, rgb(0.93, 0.95, 0.99));
    p2.drawText('ACADEMIC LIFECYCLE', {
      x: startX + 16,
      y: colY + colH - 22,
      size: 12,
      font: helvBold,
      color: dbitBlue,
    });
    const c1Points = [
      'Multi-semester project sequence (CEP, Mini Projects I & II, Capstone) requires continuous rigor.',
      'Demands authentic originality, verifiable stage progression, and prompt mentor feedback.',
      'Syllabus requires continuous assessment mapped against 7 discrete experiment milestones (Exp 1 to Exp 7).'
    ];
    let cy = colY + colH - 55;
    for (const pt of c1Points) {
      const lines = wrapText(pt, helv, 11, colW - 32);
      p2.drawText('•', { x: startX + 14, y: cy, size: 11, font: helvBold, color: dbitBlue });
      for (const ln of lines) {
        p2.drawText(ln, { x: startX + 26, y: cy, size: 10.5, font: helv, color: darkSlate });
        cy -= 15;
      }
      cy -= 8;
    }

    // Col 2: Current Bottleneck
    const c2X = startX + colW + gap;
    drawCard(p2, c2X, colY, colW, colH, white, cardBorder, 1.2);
    drawCard(p2, c2X, colY + colH - 34, colW, 34, rgb(0.99, 0.94, 0.94));
    p2.drawText('CURRENT BOTTLENECKS', {
      x: c2X + 16,
      y: colY + colH - 22,
      size: 12,
      font: helvBold,
      color: redHighlight,
    });
    const c2Points = [
      '40+ project groups per semester submit via uncoordinated Google Sheets, WhatsApp chats, and verbal discussions.',
      'Faculty guides manually cross-check 500+ historical theses by memory, causing review fatigue and oversight.',
      'First-come allocation penalizes deep technical proposals; disputes consume review slots without audit trails.'
    ];
    cy = colY + colH - 55;
    for (const pt of c2Points) {
      const lines = wrapText(pt, helv, 11, colW - 32);
      p2.drawText('•', { x: c2X + 14, y: cy, size: 11, font: helvBold, color: redHighlight });
      for (const ln of lines) {
        p2.drawText(ln, { x: c2X + 26, y: cy, size: 10.5, font: helv, color: darkSlate });
        cy -= 15;
      }
      cy -= 8;
    }

    // Col 3: Proposed Intervention
    const c3X = c2X + colW + gap;
    drawCard(p2, c3X, colY, colW, colH, white, cardBorder, 1.2);
    drawCard(p2, c3X, colY + colH - 34, colW, 34, rgb(0.94, 0.99, 0.94));
    p2.drawText('PROPOSED INTERVENTION', {
      x: c3X + 16,
      y: colY + colH - 22,
      size: 12,
      font: helvBold,
      color: greenHighlight,
    });
    const c3Points = [
      'Automated NLP Pre-Screening: SBERT contextual embeddings + TF-IDF lexical checks flag overlaps before submission.',
      'Merit-Based Conflict Queue: Side-by-side pitch defense evaluation allows coordinators to arbitrate fairly.',
      'Centralized Stage-Gate Tracker: 14-week milestone schedule with timestamped feedback logs and automated reminders.'
    ];
    cy = colY + colH - 55;
    for (const pt of c3Points) {
      const lines = wrapText(pt, helv, 11, colW - 32);
      p2.drawText('•', { x: c3X + 14, y: cy, size: 11, font: helvBold, color: greenHighlight });
      for (const ln of lines) {
        p2.drawText(ln, { x: c3X + 26, y: cy, size: 10.5, font: helv, color: darkSlate });
        cy -= 15;
      }
      cy -= 8;
    }

    // Bottom Architecture Badge
    const archText = 'Architecture: React 19 + TypeScript  |  SBERT & TF-IDF (Cosine >= 0.75)  |  PostgreSQL & Firestore Real-Time DB';
    p2.drawText(archText, { x: 140, y: 55, size: 11, font: helvBold, color: dbitBlue });
  }

  // ==========================================
  // SLIDE 3: Problem Statement
  // ==========================================
  {
    const p3 = pages[2];
    p3.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    // Official Problem Statement Box (Callout)
    drawCard(p3, 50, 275, W - 100, 135, rgb(0.96, 0.98, 1.0), dbitBlue, 1.5);
    p3.drawText('FORMAL ACADEMIC PROBLEM STATEMENT', {
      x: 75,
      y: 385,
      size: 11,
      font: helvBold,
      color: dbitBlue,
    });

    const statementText =
      '“To develop a web-based centralized portal for students and project guides that provides automated detection of duplicate or overlapping project topics, a searchable archive of approved topics, and real-time approval, feedback and stage tracking with deadline reminders, thereby reducing overlapping projects and the delays and confusion caused by slow, scattered and untracked feedback.”';

    const stmtLines = wrapText(statementText, helvBold, 13.5, W - 150);
    let sy = 358;
    for (const ln of stmtLines) {
      p3.drawText(ln, { x: 75, y: sy, size: 13.5, font: helvBold, color: black });
      sy -= 21;
    }

    // Workflow Transformation Section
    p3.drawText('Workflow Transformation: From Disconnected Tools to Single Institutional Source of Truth', {
      x: 55,
      y: 245,
      size: 13,
      font: helvBold,
      color: darkSlate,
    });

    // 3 Metric Outcome Cards
    const cardW = 275;
    const cGap = 17;
    const cY = 70;
    const cH = 150;

    // Card 1: Zero Overlap
    drawCard(p3, 55, cY, cardW, cH, white, cardBorder, 1.2);
    p3.drawText('ZERO TOPIC OVERLAP', { x: 75, y: cY + cH - 26, size: 12, font: helvBold, color: dbitBlue });
    p3.drawText('Hybrid NLP Similarity Engine', { x: 75, y: cY + cH - 44, size: 11, font: helvBold, color: black });
    const c1Text = 'Combines SBERT dense semantic embeddings with TF-IDF n-grams to flag exact matches and rephrased synonyms in real time prior to coordinator review.';
    const c1L = wrapText(c1Text, helv, 10.5, cardW - 36);
    let ty = cY + cH - 68;
    for (const l of c1L) { p3.drawText(l, { x: 75, y: ty, size: 10.5, font: helv, color: darkSlate }); ty -= 15; }

    // Card 2: Instant Transparency
    drawCard(p3, 55 + cardW + cGap, cY, cardW, cH, white, cardBorder, 1.2);
    p3.drawText('INSTANT TRANSPARENCY', { x: 55 + cardW + cGap + 20, y: cY + cH - 26, size: 12, font: helvBold, color: greenHighlight });
    p3.drawText('Live 14-Week Stage-Gate Tracker', { x: 55 + cardW + cGap + 20, y: cY + cH - 44, size: 11, font: helvBold, color: black });
    const c2Text = 'Replaces vague milestones with 7 syllabus-aligned gates (Exp 1 to Exp 7). Teams and guides view verified deliverable progress and upcoming deadlines on a live Gantt view.';
    const c2L = wrapText(c2Text, helv, 10.5, cardW - 36);
    ty = cY + cH - 68;
    for (const l of c2L) { p3.drawText(l, { x: 55 + cardW + cGap + 20, y: ty, size: 10.5, font: helv, color: darkSlate }); ty -= 15; }

    // Card 3: Auditable Feedback
    drawCard(p3, 55 + (cardW + cGap) * 2, cY, cardW, cH, white, cardBorder, 1.2);
    p3.drawText('AUDITABLE FEEDBACK', { x: 55 + (cardW + cGap) * 2 + 20, y: cY + cH - 26, size: 12, font: helvBold, color: dbitBlue });
    p3.drawText('Centralized Guide Review Log', { x: 55 + (cardW + cGap) * 2 + 20, y: cY + cH - 44, size: 11, font: helvBold, color: black });
    const c3Text = 'Written reviewer remarks, approval stamps, and escalation triggers are stored permanently in the database, eliminating lost verbal agreements and feedback stagnation.';
    const c3L = wrapText(c3Text, helv, 10.5, cardW - 36);
    ty = cY + cH - 68;
    for (const l of c3L) { p3.drawText(l, { x: 55 + (cardW + cGap) * 2 + 20, y: ty, size: 10.5, font: helv, color: darkSlate }); ty -= 15; }
  }

  // ==========================================
  // SLIDE 4: Literature Review (Table)
  // ==========================================
  {
    const p4 = pages[3];
    // Clear template area below title (y=20 to y=410)
    p4.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    // Table coordinates
    const tX = 45;
    const tY = 55;
    const tW = W - 90;
    const headerH = 34;
    const rowH = 64;

    const colWidths = [220, 160, 260, 230]; // Sums to 870 = tW

    // Table Header
    drawCard(p4, tX, tY + rowH * 5, tW, headerH, rgb(0.12, 0.16, 0.22));
    const headers = ['Paper Name & Year', 'Author(s)', 'Summary of Paper', 'Research Gap Identified'];
    let curX = tX;
    headers.forEach((h, i) => {
      p4.drawText(h, {
        x: curX + 12,
        y: tY + rowH * 5 + 11,
        size: 11,
        font: helvBold,
        color: white,
      });
      curX += colWidths[i];
    });

    const papers = [
      {
        paper: 'Web-Based Centralized Student Project Allocation & Management System (2021)',
        authors: 'S. Sharma, A. Kumar, P. Deshmukh',
        summary: 'Proposed RBAC web portal using PHP/MySQL for student-guide allocation; eliminated physical forms and cut administrative follow-ups by 40%.',
        gap: 'Lacks automated duplicate detection or semantic similarity checks; relies purely on manual guide verification.',
      },
      {
        paper: 'Detection of Duplicate Project Proposals Using NLP (2023)',
        authors: 'R. Patel, V. Shah, M. Mehta',
        summary: 'Employed tokenization, TF-IDF vectorization, and cosine similarity for text duplicate screening; achieved 88% accuracy on exact matching.',
        gap: 'High false-negative rate on rephrased or synonym-substituted titles; unable to capture deeper contextual meaning.',
      },
      {
        paper: 'Semantic Similarity & Paraphrase Detection for Proposals using BERT (2024)',
        authors: 'J. Dev, S. Nair, L. Verma',
        summary: 'Implemented Sentence-BERT (SBERT) contextual embeddings with cosine threshold >= 0.75, attaining 94.2% accuracy on paraphrased proposals.',
        gap: 'High computational overhead; lacked end-to-end integration with institutional faculty approval workflows and real-time feedback.',
      },
      {
        paper: 'Expert-in-the-Loop Framework for Academic Conflict Resolution (2022)',
        authors: 'M. R. Gupta, P. K. Singh',
        summary: 'Introduced threshold escalation queue with side-by-side pitch matrix, allowing faculty to arbitrate overlapping topics based on academic merit.',
        gap: 'No automated pre-submission screening for students, making the system dependent on prolonged faculty response times.',
      },
      {
        paper: 'Digital Archiving & Semantic Search for Student Engineering Projects (2020)',
        authors: 'A. Joshi, R. Kulkarni',
        summary: 'Built an indexed digital library with domain-level metadata search, reducing redundant topic submissions across batches by 60%.',
        gap: 'Static repository operating in an isolated silo without integration into live proposal submission and milestone sign-off gates.',
      },
    ];

    // Draw rows (from top to bottom: index 4 down to 0)
    papers.forEach((row, rIdx) => {
      const rowY = tY + (4 - rIdx) * rowH;
      const bg = rIdx % 2 === 0 ? white : rgb(0.97, 0.98, 0.99);
      drawCard(p4, tX, rowY, tW, rowH, bg, cardBorder, 0.8);

      let xPos = tX;
      // Col 1: Paper
      const pLines = wrapText(row.paper, helvBold, 9.5, colWidths[0] - 20);
      let py = rowY + rowH - 18;
      for (const l of pLines) { p4.drawText(l, { x: xPos + 10, y: py, size: 9.5, font: helvBold, color: black }); py -= 13; }
      xPos += colWidths[0];

      // Col 2: Authors
      const aLines = wrapText(row.authors, helv, 9.5, colWidths[1] - 18);
      py = rowY + rowH - 18;
      for (const l of aLines) { p4.drawText(l, { x: xPos + 10, y: py, size: 9.5, font: helv, color: darkSlate }); py -= 13; }
      xPos += colWidths[1];

      // Col 3: Summary
      const sLines = wrapText(row.summary, helv, 9.2, colWidths[2] - 18);
      py = rowY + rowH - 18;
      for (const l of sLines) { p4.drawText(l, { x: xPos + 10, y: py, size: 9.2, font: helv, color: darkSlate }); py -= 12.5; }
      xPos += colWidths[2];

      // Col 4: Gap
      const gLines = wrapText(row.gap, helv, 9.2, colWidths[3] - 18);
      py = rowY + rowH - 18;
      for (const l of gLines) { p4.drawText(l, { x: xPos + 10, y: py, size: 9.2, font: helv, color: redHighlight }); py -= 12.5; }
    });
  }

  // ==========================================
  // SLIDE 5: Main Research Gaps
  // ==========================================
  {
    const p5 = pages[4];
    p5.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    const gapBoxW = W - 100;
    const gapBoxH = 98;
    const startY = 300;

    const researchGaps = [
      {
        num: 'GAP 1',
        title: 'Keyword Matching Fails on Paraphrased Proposals',
        issue: 'Traditional TF-IDF and bag-of-words systems fail when students rephrase duplicate ideas with synonyms or reordered sentences, creating false negatives and topic overlap across batches.',
        solution: 'Deploy Sentence-BERT (SBERT all-MiniLM-L6-v2) dense contextual embeddings combined with lexical TF-IDF. Computes semantic vector cosine similarity (>= 0.75 threshold) regardless of phrasing.',
      },
      {
        num: 'GAP 2',
        title: 'Arbitrary Automated Rejections Cause Student Friction',
        issue: 'Binary programmatic rejections fail to recognize authentic technical nuances and novel institutional constraints, discouraging student initiative and creating disputes with faculty.',
        solution: 'Expert-in-the-Loop Conflict Queue & 200-Word Pitch Defense. High-similarity proposals are escalated to coordinator arbitration where clashing teams defend distinct engineering architectures.',
      },
      {
        num: 'GAP 3',
        title: 'Isolated Static Archives Without Workflow Integration',
        issue: 'Historical project libraries exist as isolated repositories, disconnected from the active proposal submission form and student brainstorming phase.',
        solution: 'Direct pre-submission archive search and originality scoring embedded directly into the submission workflow, paired with 14-week milestone tracking (Exp 1 to Exp 7).',
      },
    ];

    researchGaps.forEach((g, idx) => {
      const boxY = startY - idx * 115;
      drawCard(p5, 50, boxY, gapBoxW, gapBoxH, white, cardBorder, 1.2);

      // Left Gap Identifier Banner
      drawCard(p5, 50, boxY, 110, gapBoxH, rgb(0.97, 0.94, 0.94));
      p5.drawText(g.num, { x: 72, y: boxY + 58, size: 14, font: helvBold, color: redHighlight });
      p5.drawText('IDENTIFIED', { x: 62, y: boxY + 40, size: 9, font: helvBold, color: redHighlight });
      p5.drawText('LIMITATION', { x: 62, y: boxY + 28, size: 9, font: helvBold, color: redHighlight });

      // Middle: Gap Details
      p5.drawText(g.title, { x: 175, y: boxY + 74, size: 12.5, font: helvBold, color: black });
      const issueLines = wrapText(g.issue, helv, 9.8, 380);
      let iy = boxY + 54;
      for (const l of issueLines) { p5.drawText(l, { x: 175, y: iy, size: 9.8, font: helv, color: darkSlate }); iy -= 14; }

      // Divider line
      p5.drawLine({
        start: { x: 575, y: boxY + 10 },
        end: { x: 575, y: boxY + gapBoxH - 10 },
        thickness: 1,
        color: cardBorder,
      });

      // Right: Proposed Intervention
      p5.drawText('DBIT PROJECTTRACK INTERVENTION', { x: 590, y: boxY + 74, size: 10, font: helvBold, color: greenHighlight });
      const solLines = wrapText(g.solution, helv, 9.8, 305);
      let sy = boxY + 54;
      for (const l of solLines) { p5.drawText(l, { x: 590, y: sy, size: 9.8, font: helv, color: darkSlate }); sy -= 14; }
    });
  }

  // ==========================================
  // SLIDE 6: Final Feature List (Table)
  // ==========================================
  {
    const p6 = pages[5];
    p6.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    // App Name Banner
    drawCard(p6, 45, 375, W - 90, 36, rgb(0.95, 0.97, 1.0), dbitBlue, 1);
    p6.drawText('Name of Application / System:', { x: 60, y: 388, size: 12, font: helvBold, color: darkSlate });
    p6.drawText('Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)', {
      x: 250,
      y: 388,
      size: 12,
      font: helvBold,
      color: dbitBlue,
    });

    // Table Header
    const tX = 45;
    const tY = 45;
    const tW = W - 90;
    const headerH = 32;
    const rowH = 58;

    const colWidths = [60, 290, 520]; // 870 = tW

    drawCard(p6, tX, tY + rowH * 5, tW, headerH, rgb(0.12, 0.16, 0.22));
    const headers = ['Sr. No', 'Key System Features', 'Academic & Engineering Justification'];
    let curX = tX;
    headers.forEach((h, i) => {
      p6.drawText(h, {
        x: curX + (i === 0 ? 10 : 16),
        y: tY + rowH * 5 + 10,
        size: 11,
        font: helvBold,
        color: white,
      });
      curX += colWidths[i];
    });

    const features = [
      {
        sr: '1.',
        feature: 'Real-Time NLP Duplicate & Similarity Detection',
        just: 'Scans proposed titles, abstracts, and problem statements during entry via SBERT dense vectors and TF-IDF n-grams to flag matching or reworded topics instantly, preventing topic hoarding and manual guide cross-checking.',
      },
      {
        sr: '2.',
        feature: 'Faculty Pitch Defense & Conflict Resolution Queue',
        just: 'Provides a side-by-side arbitration dashboard where project coordinators evaluate concise 200-word pitch defenses from teams with overlapping topics, ensuring allocation is based on technical merit rather than submission speed.',
      },
      {
        sr: '3.',
        feature: 'Searchable Historical Project Repository',
        just: 'Grants students pre-submission access to a domain-filtered repository of 500+ verified DBIT theses, enabling teams to verify topic originality, methodology, and prior art during brainstorming.',
      },
      {
        sr: '4.',
        feature: 'Visual 14-Week Stage-Gate Progress Tracker',
        just: 'Structures course milestones across 7 syllabus experiments (Exp 1 to Exp 7: Topic -> Design -> Architecture -> Modules -> Similarity -> Testing -> Defense), resolving 81.8% of student confusion regarding upcoming deliverables.',
      },
      {
        sr: '5.',
        feature: 'Centralized Written Feedback Log & Automated Alerts',
        just: 'Permanently logs guide feedback, revision notes, and approval timestamps in the relational database while dispatching automated reminders for pending reviews, resolving feedback stagnation (cutting the 44.2% >=3-day wait time).',
      },
    ];

    features.forEach((row, rIdx) => {
      const rowY = tY + (4 - rIdx) * rowH;
      const bg = rIdx % 2 === 0 ? white : rgb(0.97, 0.98, 0.99);
      drawCard(p6, tX, rowY, tW, rowH, bg, cardBorder, 0.8);

      // Col 1: Sr No
      p6.drawText(row.sr, { x: tX + 20, y: rowY + rowH / 2 - 4, size: 11, font: helvBold, color: black });

      // Col 2: Feature
      const fLines = wrapText(row.feature, helvBold, 10, colWidths[1] - 25);
      let fy = rowY + rowH - 18;
      for (const l of fLines) { p6.drawText(l, { x: tX + colWidths[0] + 14, y: fy, size: 10, font: helvBold, color: dbitBlue }); fy -= 13.5; }

      // Col 3: Justification
      const jLines = wrapText(row.just, helv, 9.3, colWidths[2] - 25);
      let jy = rowY + rowH - 18;
      for (const l of jLines) { p6.drawText(l, { x: tX + colWidths[0] + colWidths[1] + 14, y: jy, size: 9.3, font: helv, color: darkSlate }); jy -= 12.5; }
    });
  }

  // ==========================================
  // SLIDE 7: Survey Analysis
  // ==========================================
  {
    const p7 = pages[6];
    p7.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    // Header context
    p7.drawText('Empirical Cohort Survey Data & Problem Grounding (n = 79)', {
      x: 55,
      y: 395,
      size: 15,
      font: helvBold,
      color: black,
    });
    p7.drawText('Conducted across 77 SE/TE students and 2 project guides in the Department of Computer Engineering at DBIT.', {
      x: 55,
      y: 376,
      size: 11.5,
      font: helv,
      color: mutedText,
    });

    // 3 Big Stat Metric Cards
    const statW = 270;
    const statH = 135;
    const statY = 225;

    // Stat 1: Topic Overlap
    drawCard(p7, 55, statY, statW, statH, white, rgb(0.9, 0.6, 0.6), 1.2);
    p7.drawText('79.2%', { x: 75, y: statY + statH - 42, size: 34, font: helvBold, color: redHighlight });
    p7.drawText('(61 / 77 Respondents)', { x: 190, y: statY + statH - 35, size: 11, font: helvBold, color: mutedText });
    p7.drawText('FACED TOPIC OVERLAP', { x: 75, y: statY + statH - 64, size: 11.5, font: helvBold, color: black });
    const s1Desc = 'Encountered duplicate or substantially overlapping project proposals across different student groups in the same cohort.';
    let dy = statY + statH - 85;
    for (const l of wrapText(s1Desc, helv, 9.8, statW - 35)) { p7.drawText(l, { x: 75, y: dy, size: 9.8, font: helv, color: darkSlate }); dy -= 14; }

    // Stat 2: Confusion on Stage Gates
    drawCard(p7, 55 + statW + 25, statY, statW, statH, white, rgb(0.9, 0.7, 0.4), 1.2);
    p7.drawText('81.8%', { x: 55 + statW + 45, y: statY + statH - 42, size: 34, font: helvBold, color: rgb(0.85, 0.5, 0.1) });
    p7.drawText('(63 / 77 Respondents)', { x: 55 + statW + 160, y: statY + statH - 35, size: 11, font: helvBold, color: mutedText });
    p7.drawText('STAGE-GATE CONFUSION', { x: 55 + statW + 45, y: statY + statH - 64, size: 11.5, font: helvBold, color: black });
    const s2Desc = 'Reported uncertainty regarding upcoming deliverable expectations, syllabus milestones, and next submission deadlines.';
    dy = statY + statH - 85;
    for (const l of wrapText(s2Desc, helv, 9.8, statW - 35)) { p7.drawText(l, { x: 55 + statW + 45, y: dy, size: 9.8, font: helv, color: darkSlate }); dy -= 14; }

    // Stat 3: Feedback Delay
    drawCard(p7, 55 + (statW + 25) * 2, statY, statW, statH, white, rgb(0.5, 0.7, 0.9), 1.2);
    p7.drawText('44.2%', { x: 55 + (statW + 25) * 2 + 20, y: statY + statH - 42, size: 34, font: helvBold, color: dbitBlue });
    p7.drawText('(34 / 77 Respondents)', { x: 55 + (statW + 25) * 2 + 135, y: statY + statH - 35, size: 11, font: helvBold, color: mutedText });
    p7.drawText('WAIT TIME >= 3 DAYS', { x: 55 + (statW + 25) * 2 + 20, y: statY + statH - 64, size: 11.5, font: helvBold, color: black });
    const s3Desc = 'Waited 3 or more days for guide feedback or topic approval decisions due to unorganized WhatsApp and email channels.';
    dy = statY + statH - 85;
    for (const l of wrapText(s3Desc, helv, 9.8, statW - 35)) { p7.drawText(l, { x: 55 + (statW + 25) * 2 + 20, y: dy, size: 9.8, font: helv, color: darkSlate }); dy -= 14; }

    // Bottom Half: Top Student Feature Demands & Persona
    const bottomH = 150;
    const bY = 55;

    // Feature Demands Progress Bars
    drawCard(p7, 55, bY, 520, bottomH, white, cardBorder, 1.2);
    p7.drawText('TOP STUDENT FEATURE DEMANDS (GOOGLE FORMS SURVEY)', {
      x: 75,
      y: bY + bottomH - 24,
      size: 11,
      font: helvBold,
      color: dbitBlue,
    });

    const bars = [
      { label: 'Automated Duplicate Check at Proposal Entry', pct: '57.1%', val: 0.571, count: '44 / 77 students', color: dbitBlue },
      { label: 'Searchable Topic Archive of Past Theses', pct: '55.8%', val: 0.558, count: '43 / 77 students', color: rgb(0.4, 0.5, 0.8) },
      { label: 'Automated Deadline Alerts & Guide Reminders', pct: '49.4%', val: 0.494, count: '38 / 77 students', color: rgb(0.12, 0.65, 0.35) },
    ];

    bars.forEach((b, idx) => {
      const py = bY + bottomH - 52 - idx * 36;
      p7.drawText(b.label, { x: 75, y: py, size: 10, font: helvBold, color: black });
      p7.drawText(`${b.pct}  (${b.count})`, { x: 400, y: py, size: 9.5, font: helvBold, color: mutedText });

      // Track bg
      drawCard(p7, 75, py - 11, 420, 8, rgb(0.9, 0.92, 0.95));
      // Fill
      drawCard(p7, 75, py - 11, 420 * b.val, 8, b.color);
    });

    // Right Box: Institutional Empathy Persona
    drawCard(p7, 595, bY, 320, bottomH, rgb(0.98, 0.98, 1.0), dbitBlue, 1);
    p7.drawText('COORDINATOR PERSONA: PROF. MEENAL KULKARNI', {
      x: 610,
      y: bY + bottomH - 22,
      size: 10,
      font: helvBold,
      color: dbitBlue,
    });
    const personaLines = [
      'Role: Project Coordinator (12 yrs teaching at DBIT)',
      'Goal: Approve non-duplicate, innovative topics quickly and ensure fair evaluation for all 40+ groups.',
      'Frustration: Manual cross-referencing causes review disputes that consume technical mentoring hours.',
      'Solution in DBIT ProjectTrack: Automated similarity scores, pitch defense queue, and single-click approval.'
    ];
    let pry = bY + bottomH - 42;
    for (const pl of personaLines) {
      const lines = wrapText(pl, helv, 9.5, 290);
      for (const ln of lines) {
        p7.drawText(ln, { x: 610, y: pry, size: 9.5, font: helv, color: darkSlate });
        pry -= 13;
      }
      pry -= 4;
    }
  }

  // ==========================================
  // SLIDE 8: Methodology (Architecture, UML & Workflow)
  // ==========================================
  {
    const p8 = pages[7];
    p8.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    p8.drawText('Methodology: 3-Tier System Architecture & UML Modeling', {
      x: 55,
      y: 395,
      size: 15,
      font: helvBold,
      color: black,
    });
    p8.drawText('End-to-end engineered pipeline connecting student proposals, NLP screening, and faculty arbitration.', {
      x: 55,
      y: 376,
      size: 11.5,
      font: helv,
      color: mutedText,
    });

    // 3 Architecture Tier Cards (Top)
    const tierW = 270;
    const tierH = 115;
    const tierY = 245;

    // Tier 1: Client
    drawCard(p8, 55, tierY, tierW, tierH, white, cardBorder, 1.2);
    p8.drawText('TIER 1: PRESENTATION LAYER', { x: 70, y: tierY + tierH - 22, size: 11, font: helvBold, color: dbitBlue });
    p8.drawText('React 19 SPA • Tailwind CSS • TypeScript', { x: 70, y: tierY + tierH - 38, size: 10, font: helvBold, color: black });
    const t1Desc = 'Role-based views for Students (submission & similarity check), Faculty Guides (mentoring & sign-offs), Coordinators (arbitration), and Admins.';
    let dy = tierY + tierH - 56;
    for (const l of wrapText(t1Desc, helv, 9.3, tierW - 30)) { p8.drawText(l, { x: 70, y: dy, size: 9.3, font: helv, color: darkSlate }); dy -= 13.5; }

    // Tier 2: Processing Engine
    drawCard(p8, 55 + tierW + 25, tierY, tierW, tierH, white, cardBorder, 1.2);
    p8.drawText('TIER 2: NLP SIMILARITY ENGINE', { x: 55 + tierW + 40, y: tierY + tierH - 22, size: 11, font: helvBold, color: greenHighlight });
    p8.drawText('FastAPI Microservice • SBERT & TF-IDF', { x: 55 + tierW + 40, y: tierY + tierH - 38, size: 10, font: helvBold, color: black });
    const t2Desc = 'Pre-trained all-MiniLM-L6-v2 transformer computes 384-dim contextual embeddings. Hybrid score: 0.65*SBERT + 0.35*TF-IDF. Threshold >= 0.75 flags conflict.';
    dy = tierY + tierH - 56;
    for (const l of wrapText(t2Desc, helv, 9.3, tierW - 30)) { p8.drawText(l, { x: 55 + tierW + 40, y: dy, size: 9.3, font: helv, color: darkSlate }); dy -= 13.5; }

    // Tier 3: Persistence
    drawCard(p8, 55 + (tierW + 25) * 2, tierY, tierW, tierH, white, cardBorder, 1.2);
    p8.drawText('TIER 3: DATA & PERSISTENCE TIER', { x: 55 + (tierW + 25) * 2 + 15, y: tierY + tierH - 22, size: 11, font: helvBold, color: dbitBlue });
    p8.drawText('PostgreSQL / Firestore Real-Time DB', { x: 55 + (tierW + 25) * 2 + 15, y: tierY + tierH - 38, size: 10, font: helvBold, color: black });
    const t3Desc = 'Stores 500+ historical thesis embeddings, active student proposals, audit feedback timestamps, role-based security rules, and stage-gate progression.';
    dy = tierY + tierH - 56;
    for (const l of wrapText(t3Desc, helv, 9.3, tierW - 30)) { p8.drawText(l, { x: 55 + (tierW + 25) * 2 + 15, y: dy, size: 9.3, font: helv, color: darkSlate }); dy -= 13.5; }

    // Bottom Section: Embed UML diagrams from Review 1 PDF
    // Review 1 page 12 has Use Case & State Machine diagrams!
    try {
      const [embeddedReview1P12] = await doc.embedPdf(review1Doc, [11]);
      // Draw embedded diagram box on the left
      drawCard(p8, 55, 45, 520, 185, white, cardBorder, 1.2);
      p8.drawText('UML USE CASE & STATE MACHINE LIFECYCLE (PAGE 12 REVIEW DECK)', {
        x: 70,
        y: 215,
        size: 9.5,
        font: helvBold,
        color: dbitBlue,
      });

      // Scale and draw diagram
      p8.drawPage(embeddedReview1P12, {
        x: 60,
        y: 50,
        width: 505,
        height: 155,
      });
    } catch (e) {
      console.warn('Could not embed review 1 page 12:', e.message);
    }

    // Right Box: 14-Week Stage-Gate Milestones
    drawCard(p8, 595, 45, 320, 185, rgb(0.97, 0.98, 1.0), dbitBlue, 1);
    p8.drawText('14-WEEK STAGE-GATE MILESTONES', {
      x: 610,
      y: 215,
      size: 10.5,
      font: helvBold,
      color: dbitBlue,
    });

    const gates = [
      { exp: 'Exp 1 (W1–3)', name: 'Empathy Study & Problem Framing' },
      { exp: 'Exp 2 (W4–6)', name: 'Literature Review & Benchmark' },
      { exp: 'Exp 3 (W5–6)', name: 'User Survey & Formulation' },
      { exp: 'Exp 4 (W7–8)', name: 'UML Diagrams & Arch Design' },
      { exp: 'Review 1 (W8)', name: 'Progress Evaluation Milestone' },
      { exp: 'Exp 5 (W9–11)', name: 'NLP Similarity Engine Dev' },
      { exp: 'Exp 6 (W10–12)', name: 'Web Portal UI Integration' },
      { exp: 'Exp 7 (W12–14)', name: 'System Testing & Final Defense' },
    ];

    let gy = 195;
    gates.forEach(g => {
      p8.drawText(g.exp, { x: 610, y: gy, size: 9, font: helvBold, color: dbitBlue });
      p8.drawText(g.name, { x: 695, y: gy, size: 9, font: helv, color: darkSlate });
      gy -= 18;
    });
  }

  // ==========================================
  // SLIDE 9: Future Scope
  // ==========================================
  {
    const p9 = pages[8];
    p9.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    p9.drawText('Future Scope: Architectural Scalability & Institutional Roadmap', {
      x: 55,
      y: 395,
      size: 15,
      font: helvBold,
      color: black,
    });
    p9.drawText('Long-term extensions for automated academic governance and multi-department deployment.', {
      x: 55,
      y: 376,
      size: 11.5,
      font: helv,
      color: mutedText,
    });

    const scopes = [
      {
        num: '01',
        title: 'Full-Document Thesis Plagiarism Scanning (Turnitin-Style)',
        tag: 'DOCUMENT-LEVEL NLP',
        desc: 'Extend the current title and abstract semantic screening to full-text thesis reports (PDF / DOCX parsing). Implements paragraph-level citation parsing, code snippet matching, and verbatim chunk detection.',
      },
      {
        num: '02',
        title: 'Automated Code Repository Static Analysis & CI/CD Auditing',
        tag: 'GITHUB VCS INTEGRATION',
        desc: 'Connect team GitHub repositories directly to stage gates. Automatically audit commit frequency, test pass rates, code smells, and documentation consistency before awarding Experiment 5 and 6 clearance.',
      },
      {
        num: '03',
        title: 'Multi-Department & University-Wide Institutional Deployment',
        tag: 'FEDERATED SCALING',
        desc: 'Scale the multi-tenant architecture across all DBIT engineering departments (IT, EXTC, Mechanical) and autonomous colleges affiliated with the University of Mumbai, with cross-department duplicate topic indexing.',
      },
      {
        num: '04',
        title: 'AI-Generated Defense Questions & Viva Evaluation Rubrics',
        tag: 'LLM EVALUATION COPILOT',
        desc: 'Leverage domain models to generate customized viva examination questions and grading rubrics based on the specific architectural differentiators stated in a team’s pitch defense.',
      },
    ];

    const cardW = 410;
    const cardH = 140;

    scopes.forEach((sc, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 55 + col * 440;
      const y = 205 - row * 155;

      drawCard(p9, x, y, cardW, cardH, white, cardBorder, 1.2);

      // Number badge
      drawCard(p9, x + 16, y + cardH - 34, 30, 22, rgb(0.93, 0.95, 0.99));
      p9.drawText(sc.num, { x: x + 23, y: y + cardH - 27, size: 10, font: helvBold, color: dbitBlue });

      // Tag
      p9.drawText(sc.tag, { x: x + 56, y: y + cardH - 27, size: 9, font: helvBold, color: mutedText });

      // Title
      const tLines = wrapText(sc.title, helvBold, 11, cardW - 35);
      let ty = y + cardH - 52;
      for (const l of tLines) { p9.drawText(l, { x: x + 16, y: ty, size: 11, font: helvBold, color: black }); ty -= 15; }

      // Description
      const dLines = wrapText(sc.desc, helv, 9.5, cardW - 32);
      ty -= 4;
      for (const l of dLines) { p9.drawText(l, { x: x + 16, y: ty, size: 9.5, font: helv, color: darkSlate }); ty -= 13.5; }
    });
  }

  // ==========================================
  // SLIDE 10: References
  // ==========================================
  {
    const p10 = pages[9];
    p10.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    p10.drawText('References & Literature Citations', {
      x: 55,
      y: 395,
      size: 15,
      font: helvBold,
      color: black,
    });
    p10.drawText('Scholarly foundations, empirical methodologies, and standardized UML specifications.', {
      x: 55,
      y: 376,
      size: 11.5,
      font: helv,
      color: mutedText,
    });

    const citations = [
      {
        num: '1.',
        ref: 'S. Sharma, A. Kumar, P. Deshmukh (2021). "Web-Based Centralized Student Project Allocation and Management System." International Journal of Computer Applications, vol. 183, no. 2, pp. 14–19.',
      },
      {
        num: '2.',
        ref: 'R. Patel, V. Shah, M. Mehta (2023). "Detection of Duplicate Project Proposals Using Natural Language Processing." IEEE Access, vol. 11, pp. 45120–45129. DOI: 10.1109/ACCESS.2023.3274112.',
      },
      {
        num: '3.',
        ref: 'J. Dev, S. Nair, L. Verma (2024). "Semantic Similarity and Paraphrase Detection for Academic Proposals using SBERT." ACM Transactions on Computing Education, vol. 24, no. 1, pp. 45–58.',
      },
      {
        num: '4.',
        ref: 'M. R. Gupta, P. K. Singh (2022). "Expert-in-the-Loop Framework for Academic Conflict Resolution and Allocation." Journal of Educational Technology Systems, vol. 51, no. 3, pp. 312–328.',
      },
      {
        num: '5.',
        ref: 'A. Joshi, R. Kulkarni (2020). "Digital Archiving and Semantic Search for Historical Student Engineering Projects." Springer Communications in Computer and Information Science (CCIS), vol. 1324, pp. 88–99.',
      },
      {
        num: '6.',
        ref: 'Object Management Group (OMG) (2024). "Unified Modeling Language (OMG UML) Version 2.5.1 Specification." Formal Standard OMG Document, formal/2024-02-01.',
      },
    ];

    citations.forEach((c, idx) => {
      const boxY = 305 - idx * 48;
      drawCard(p10, 55, boxY, W - 110, 42, idx % 2 === 0 ? white : rgb(0.97, 0.98, 0.99), cardBorder, 0.8);

      p10.drawText(c.num, { x: 72, y: boxY + 16, size: 11, font: helvBold, color: dbitBlue });
      const rLines = wrapText(c.ref, helv, 9.8, W - 170);
      let ry = boxY + 23;
      for (const l of rLines) {
        p10.drawText(l, { x: 105, y: ry, size: 9.8, font: helv, color: darkSlate });
        ry -= 13;
      }
    });
  }

  // ==========================================
  // SLIDE 11: Thank You & QnA
  // ==========================================
  {
    const p11 = pages[10];
    p11.drawRectangle({ x: 30, y: 20, width: W - 60, height: 410, color: white });

    // Thank you text
    const tyText = 'THANK YOU';
    const tyW = helvBold.widthOfTextAtSize(tyText, 46);
    p11.drawText(tyText, {
      x: (W - tyW) / 2,
      y: 350,
      size: 46,
      font: helvBold,
      color: black,
    });

    const qnaText = 'Questions & Answers (QnA)';
    const qnaW = helvBold.widthOfTextAtSize(qnaText, 22);
    p11.drawText(qnaText, {
      x: (W - qnaW) / 2,
      y: 310,
      size: 22,
      font: helvBold,
      color: dbitBlue,
    });

    const inviteText = 'We invite questions, suggestions, and feedback from the Final Review Evaluation Committee.';
    const inviteW = helv.widthOfTextAtSize(inviteText, 13);
    p11.drawText(inviteText, {
      x: (W - inviteW) / 2,
      y: 275,
      size: 13,
      font: helv,
      color: darkSlate,
    });

    // Project Details Box
    drawCard(p11, 140, 60, W - 280, 185, rgb(0.97, 0.98, 1.0), dbitBlue, 1.2);

    p11.drawText('PROJECT TEAM (TRACK 7  •  GROUP 05)', {
      x: 170,
      y: 215,
      size: 12,
      font: helvBold,
      color: dbitBlue,
    });

    const membersLine = 'Apoorvadeep Sinha (Leader)   •   Ron Barretto   •   Rishik Ezhuthachan   •   Aryan Gaikwad';
    p11.drawText(membersLine, {
      x: 170,
      y: 192,
      size: 12,
      font: helvBold,
      color: black,
    });

    p11.drawText('INTERNAL PROJECT GUIDES', {
      x: 170,
      y: 155,
      size: 11,
      font: helvBold,
      color: dbitBlue,
    });
    p11.drawText('Ms. Harleen Kaur Plaha   /   Mr. Nazareth Remedios', {
      x: 170,
      y: 135,
      size: 11.5,
      font: helvBold,
      color: black,
    });

    p11.drawText('PROJECT COORDINATOR', {
      x: 550,
      y: 155,
      size: 11,
      font: helvBold,
      color: dbitBlue,
    });
    p11.drawText('Prof. Meenal Kulkarni', {
      x: 550,
      y: 135,
      size: 11.5,
      font: helvBold,
      color: black,
    });

    p11.drawText('Department of Computer Engineering  •  Don Bosco Institute of Technology, Mumbai', {
      x: 170,
      y: 90,
      size: 11,
      font: helv,
      color: mutedText,
    });
  }

  // Save the filled presentation PDF
  const pdfBytes = await doc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Successfully generated Final Review Presentation PDF at:', outputPath);
  console.log('Total pages:', doc.getPageCount());
  console.log('File size (bytes):', pdfBytes.length);
}

generateFinalPresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
