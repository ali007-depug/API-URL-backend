import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load env variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Config
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ========== POST /shorten ========== //
app.post("/shorten", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const response = await axios.post("https://cleanuri.com/api/v1/shorten", {
      url,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Shortening error:", error.message);
    res.status(500).json({
      error: "Failed to shorten URL",
      ...(NODE_ENV === "development" && { details: error.message }),
    });
  }
});

// ========== Start Server ========== //
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${NODE_ENV} mode on http://localhost:${PORT}`
  );
  console.log(`✅ Allowed CORS origin: ${FRONTEND_URL}`);
});
