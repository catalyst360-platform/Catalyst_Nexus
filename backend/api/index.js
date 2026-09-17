const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['https://readcatalyst.com', 'http://localhost:3000']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Read Catalyst API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Import routes
const expertRoutes = require('../src/routes/expertRoutes');
const partnerRoutes = require('../src/routes/partnerRoutes');

app.use('/api/expert', expertRoutes);
app.use('/api/partner', partnerRoutes);

module.exports = app;
