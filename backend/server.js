const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Add this RIGHT AFTER app.use(cors());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Add this route to handle frontend logs
app.post('/api/logs', (req, res) => {
  const { level, message, timestamp, url } = req.body;
  console.log(`[FRONTEND ${level}] ${timestamp} | ${url} | ${message}`);
  res.json({ success: true });
});


// ✅ FIX: Add './src/'
const expertRoutes = require('./src/routes/expertRoutes');
app.use('/api/expert', expertRoutes);

// ✅ NEW: Partner routes
const partnerRoutes = require('./src/routes/partnerRoutes');
app.use('/api/partner', partnerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
