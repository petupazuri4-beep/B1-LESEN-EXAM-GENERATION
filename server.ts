import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// In AI Studio / Cloud Run architecture, NGINX listens on port 8080 and proxies to port 3000.
// If PORT is 8080, NGINX is already bound to it, so Node must listen on port 3000.
const PORT = (process.env.PORT && process.env.PORT !== '8080')
  ? parseInt(process.env.PORT, 10)
  : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to load exam seeds safely from public or dist
function getSeedExams(): any[] {
  const dirs = [
    path.join(__dirname, 'dist', 'seeds'),
    path.join(__dirname, 'public', 'seeds'),
    path.join(__dirname, 'seeds'),
  ];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
        if (files.length > 0) {
          return files.map(file => {
            const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
            return JSON.parse(raw);
          });
        }
      } catch (err) {
        console.warn(`Error reading seeds from ${dir}:`, err);
      }
    }
  }
  return [];
}

// Health Check
app.get('/api/health', (req, res) => {
  const exams = getSeedExams();
  res.json({
    status: 'ok',
    version: '1.0.0',
    name: 'B1 Lesen Exam Studio API',
    examsCount: exams.length,
    timestamp: new Date().toISOString(),
  });
});

// List all 10 seed exams
app.get('/api/exams', (req, res) => {
  const exams = getSeedExams();
  res.json({
    total: exams.length,
    exams: exams.map((e: any) => ({
      id: e.id,
      examNumber: e.examNumber,
      title: e.title,
      theme: e.theme,
      status: e.status,
      updatedAt: e.updatedAt,
      candidateInfo: e.candidateInfo,
    })),
  });
});

// Get single exam by ID or number
app.get('/api/exams/:id', (req, res) => {
  const { id } = req.params;
  const exams = getSeedExams();
  const exam = exams.find((e: any) => e.id === id || String(e.examNumber) === id);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  res.json(exam);
});

// AI Generation using Google Gemini API
app.post('/api/generate-exam', async (req, res) => {
  try {
    const { theme, institution, city, examNumber = 11 } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to local procedural generation.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert item writer for the Goethe-Institut / ÖSD Zertifikat B1 examination (Modul LESEN).
Produce a complete, authentic B1 Reading exam according to the official specifications:
- Language: German at strict CEFR B1 level
- 5 Teile, exactly 30 items
- Teil 1: Personal email/letter (200-260 words), 6 Richtig/Falsch items + 1 Beispiel [0]
- Teil 2: 2 press texts A & B (each 130-180 words), 3 items each (7-9 for A, 10-12 for B, options a/b/c)
- Teil 3: 7 situations (13-19) matched to 10 advertisements (A-J). Exactly one advertisement is unused. For exactly one situation, NO advertisement matches and the answer is "0".
- Teil 4: 7 reader letters (20-26, each 40-70 words) on a controversial topic. Candidates answer Ja or Nein.
- Teil 5: Regulatory text / Hausordnung (250-320 words) with 4 items (27-30, options a/b/c).

Output MUST be valid JSON matching the Goethe B1 ExamModel structure with all items, distractors, and justifications.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nGenerate a full B1 exam with Theme: "${theme || 'Nachhaltigkeit im Alltag'}", Institution: "${institution || 'Goethe-Institut'}", City: "${city || 'Berlin'}", ExamNumber: ${examNumber}. Respond ONLY with raw JSON.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsedExam = JSON.parse(responseText);
    res.json({ exam: parsedExam });
  } catch (err: any) {
    console.error('Gemini exam generation error:', err);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.K_SERVICE);

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev middleware not loaded, serving static dist:', err);
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }
  } else {
    // In production, serve the built dist directory
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[B1-LESEN-EXAM] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
