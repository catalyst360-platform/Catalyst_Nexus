const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Import routes
const expertRoutes = require('./routes/expertRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/expert', expertRoutes);
app.use('/api/partner', partnerRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Expert routes: /api/expert/apply`);
  console.log(`✅ Partner routes: /api/partner/apply`);
});

module.exports = app;
