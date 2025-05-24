import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

// Config
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['POST'],
}));
app.use(express.json());

// ========== POST /shorten ========== //
app.post('/shorten', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await axios.post('https://cleanuri.com/api/v1/shorten', { url });
    res.json(response.data);
  } catch (error) {
    console.error('Shortening error:', error.message);
    res.status(500).json({ 
      error: 'Failed to shorten URL',
      ...(NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// ========== Serve Frontend in Production ========== //
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// ========== Start Server ========== //
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
  console.log(`✅ Allowed CORS origin: ${FRONTEND_URL}`);
});
