const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['https://readcatalyst.com', 'https://www.readcatalyst.com', 'http://localhost:3000']
}));
app.use(express.json());

// Import from src structure
const expertRoutes = require('../src/routes/expertRoutes');
const partnerRoutes = require('../src/routes/partnerRoutes');

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/expert', expertRoutes);
app.use('/api/partner', partnerRoutes);

module.exports = app;
