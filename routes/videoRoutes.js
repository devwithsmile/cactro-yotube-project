import express from 'express';
import { getVideoData, updateVideo, getVideoRating, rateVideo } from '../controllers/videoController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get video data
router.get('/', getVideoData);

// Update video title/description
router.patch('/update', isAuthenticated, updateVideo);

// Get current rating for a video
router.get('/rating', isAuthenticated, getVideoRating);

// Rate a video (like/dislike)
router.post('/rate', isAuthenticated, rateVideo);

export default router;
