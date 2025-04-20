import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Initiate Google OAuth login
router.get('/google', passport.authenticate('google', { 
  scope: [
    'profile', 
    'email',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ],
  accessType: 'offline',
  prompt: 'consent'
}));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login` 
  }),
  (req, res) => {
    // Log access token for testing
    console.log('=== ACCESS TOKEN FOR TESTING ===');
    console.log(req.user.accessToken);
    console.log('================================');
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

// Get current user
router.get('/user', isAuthenticated, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Error during logout' });
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
