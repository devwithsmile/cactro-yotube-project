import * as videoService from '../services/videoService.js';

// Get video data - using the hardcoded ID
export async function getVideoData(req, res) {
  try {
    const videoId = "ycYh3eL4NF0";
    let data;
    
    // If authenticated, use the accessToken
    if (req.isAuthenticated()) {
      data = await videoService.fetchVideoData(videoId, req.user.accessToken);
    } else {
      data = await videoService.fetchVideoData(videoId);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in getVideoData controller:', error);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
}

// Update video title and description
export async function updateVideo(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { title, description } = req.body;
    const videoId = "ycYh3eL4NF0";
    
    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description is required' });
    }
    
    const result = await videoService.updateVideoMetadata(
      videoId,
      title,
      description,
      req.user.accessToken
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error in updateVideo controller:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
}

// Get all comments for a video
export async function getComments(req, res) {
  try {
    const videoId = "ycYh3eL4NF0";
    let comments;
    
    if (req.isAuthenticated()) {
      comments = await videoService.fetchVideoComments(videoId, req.user.accessToken);
    } else {
      comments = await videoService.fetchVideoComments(videoId);
    }
    
    res.json(comments);
  } catch (error) {
    console.error('Error in getComments controller:', error);
    res.status(500).json({ error: 'Failed to fetch video comments' });
  }
}

// Add a comment to the video
export async function addComment(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { text } = req.body;
    const videoId = "ycYh3eL4NF0";
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const comment = await videoService.addComment(
      videoId,
      text,
      req.user.accessToken
    );
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error in addComment controller:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
}

// Reply to a comment
export async function replyToComment(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { commentId, text } = req.body;
    
    if (!commentId || !text) {
      return res.status(400).json({ error: 'Comment ID and text are required' });
    }
    
    const reply = await videoService.replyToComment(
      commentId,
      text,
      req.user.accessToken
    );
    
    res.status(201).json(reply);
  } catch (error) {
    console.error('Error in replyToComment controller:', error);
    res.status(500).json({ error: 'Failed to reply to comment' });
  }
}

// Delete a comment
export async function deleteComment(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { commentId } = req.params;
    
    if (!commentId) {
      return res.status(400).json({ error: 'Comment ID is required' });
    }
    
    await videoService.deleteComment(
      commentId,
      req.user.accessToken
    );
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteComment controller:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}

// Get video rating
export async function getVideoRating(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const videoId = "ycYh3eL4NF0";
    
    const result = await videoService.getVideoRating(
      videoId,
      req.user.accessToken
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error in getVideoRating controller:', error);
    res.status(500).json({ error: 'Failed to get video rating' });
  }
}

// Rate a video (like, dislike, or remove rating)
export async function rateVideo(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { rating } = req.body;
    const videoId = "ycYh3eL4NF0";
    
    if (!rating || !['like', 'dislike', 'none'].includes(rating)) {
      return res.status(400).json({ error: 'Valid rating is required (like, dislike, or none)' });
    }
    
    const result = await videoService.rateVideo(
      videoId,
      rating,
      req.user.accessToken
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error in rateVideo controller:', error);
    res.status(500).json({ error: 'Failed to rate video' });
  }
}
