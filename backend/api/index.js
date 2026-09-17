const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://readcatalyst.com', 'http://localhost:3000'],
  credentials: true
}));

// Routes
const expertRoutes = require('../src/routes/expertRoutes');
const partnerRoutes = require('../src/routes/partnerRoutes');

app.get('/', (req, res) => {
  res.json({ message: '✅ Read Catalyst API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running' });
});

app.use('/api/expert', expertRoutes);
app.use('/api/partner', partnerRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
