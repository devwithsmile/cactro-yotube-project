import Comment from '../models/commentModel.js';

// Get all comments for a video
export async function getComments(req, res) {
  try {
    const videoId = "ycYh3eL4NF0";
    
    const comments = await Comment.find({ videoId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(comments.map(comment => ({
      id: comment._id,
      commentId: comment._id,
      text: comment.text,
      authorDisplayName: comment.authorDisplayName,
      authorProfileImageUrl: comment.authorProfileImageUrl,
      likeCount: comment.likeCount,
      publishedAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      replies: comment.replies.map(reply => ({
        id: reply._id,
        text: reply.text,
        authorDisplayName: reply.authorDisplayName,
        authorProfileImageUrl: reply.authorProfileImageUrl,
        likeCount: reply.likeCount,
        publishedAt: reply.createdAt,
        updatedAt: reply.updatedAt
      }))
    })));
  } catch (error) {
    console.error('Error in getComments controller:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
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
    
    const comment = new Comment({
      videoId,
      userId: req.user._id,
      text,
      authorDisplayName: req.user.name,
      authorProfileImageUrl: req.user.picture,
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
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    const reply = {
      userId: req.user._id,
      text,
      authorDisplayName: req.user.name,
      authorProfileImageUrl: req.user.picture
    };
    
    comment.replies.push(reply);
    comment.updatedAt = Date.now();
    await comment.save();
    
    const newReply = comment.replies[comment.replies.length - 1];
    
    res.status(201).json({
      id: newReply._id,
      text: newReply.text,
      authorDisplayName: newReply.authorDisplayName,
      authorProfileImageUrl: newReply.authorProfileImageUrl,
      likeCount: newReply.likeCount,
      publishedAt: newReply.createdAt,
      updatedAt: newReply.updatedAt
    });
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
    
    // Check if this is a reply or a main comment
    const parentComment = await Comment.findOne({ 'replies._id': commentId });
    
    if (parentComment) {
      // It's a reply
      const replyIndex = parentComment.replies.findIndex(reply => 
        reply._id.toString() === commentId);
      
      if (replyIndex === -1) {
        return res.status(404).json({ error: 'Reply not found' });
      }
      
      // Check if user owns the reply
      if (parentComment.replies[replyIndex].userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to delete this reply' });
      }
      
      parentComment.replies.splice(replyIndex, 1);
      parentComment.updatedAt = Date.now();
      await parentComment.save();
    } else {
      // It's a main comment
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      // Check if user owns the comment
      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to delete this comment' });
      }
      
      await Comment.findByIdAndDelete(commentId);
    }
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteComment controller:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}
