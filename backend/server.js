const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
