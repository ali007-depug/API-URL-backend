const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['POST'], // Explicitly allow POST
})); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// POST endpoint for shortening URLs
app.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;

    // Forward the request to CleanURI's API
    const response = await axios.post('https://cleanuri.com/api/v1/shorten', {
      url: url,
    });

    // Send the shortened URL back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});