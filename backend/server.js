require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for visibility
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FixMate API' });
});

// Start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FixMate API running on http://127.0.0.1:${PORT}`);
  });
});
