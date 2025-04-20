import express from 'express';
import * as videoService from '../services/videoService.js';

const router = express.Router();

// Test route to rate a video directly with access token
router.post('/test-rate-video', async (req, res) => {
  try {
    const { rating, accessToken } = req.body;
    const videoId = "ycYh3eL4NF0";
    
    if (!rating || !['like', 'dislike', 'none'].includes(rating)) {
      return res.status(400).json({ error: 'Valid rating is required (like, dislike, or none)' });
    }
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }
    
    // Call the video service directly with the provided token
    const result = await videoService.rateVideo(videoId, rating, accessToken);
    
    // After rating, get the latest video stats
    const videoData = await videoService.fetchVideoData(videoId, accessToken);
    
    res.json({
      ratingResult: result,
      updatedStats: videoData?.statistics || null
    });
  } catch (error) {
    console.error('Error in test rate video route:', error);
    res.status(500).json({ error: 'Failed to rate video', details: error.message });
  }
});

// Test route to get video rating with access token
router.post('/test-get-rating', async (req, res) => {
  try {
    const { accessToken } = req.body;
    const videoId = "ycYh3eL4NF0";
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }
    
    const result = await videoService.getVideoRating(videoId, accessToken);
    
    res.json(result);
  } catch (error) {
    console.error('Error in test get rating route:', error);
    res.status(500).json({ error: 'Failed to get video rating', details: error.message });
  }
});

export default router;
