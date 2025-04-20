import express from 'express';
import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import testRoutes from './routes/testRoutes.js';
import apiTestRoutes from './routes/apiTestRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import setupPassport from './config/passport.js';
import logEvent from './middleware/logEvent.js';
import 'dotenv/config';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Express middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Set up session
app.use(session({
  secret: process.env.SESSION_SECRET || 'youtube_dashboard_session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
setupPassport();

// Event logging middleware
app.use(logEvent);

// Swagger documentation
const swaggerDocument = JSON.parse(fs.readFileSync('./docs/swagger.json', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/auth', authRoutes);
app.use('/video', videoRoutes);
app.use('/notes', noteRoutes);
app.use('/comments', commentRoutes);
app.use('/test', testRoutes);
app.use('/api-test', apiTestRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));