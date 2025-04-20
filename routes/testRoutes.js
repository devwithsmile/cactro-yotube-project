import express from 'express';
import Comment from '../models/commentModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Test route to add a comment directly to the database (for testing only)
router.post('/test-comment', async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = "ycYh3eL4NF0";
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    // Create a temporary fake user ID if not available
    const userId = new mongoose.Types.ObjectId();
    
    const comment = new Comment({
      videoId,
      userId,
      text,
      authorDisplayName: 'Test User',
      authorProfileImageUrl: 'https://ui-avatars.com/api/?name=Test+User',
      replies: []
    });
    
    await comment.save();
    
    res.status(201).json({
      id: comment._id,
      commentId: comment._id,
      text: comment.text,
      authorDisplayName: comment.authorDisplayName,
      authorProfileImageUrl: comment.authorProfileImageUrl,
      likeCount: comment.likeCount,
      publishedAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      replies: []
    });
  } catch (error) {
    console.error('Error in test comment route:', error);
    // Log more detailed error information
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Failed to add test comment', details: error.message });
  }
});

export default router;
