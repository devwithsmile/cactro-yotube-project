import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getComments, addComment, replyToComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

// Get all comments for the video
router.get('/', getComments);

// Add a new comment
router.post('/', isAuthenticated, addComment);

// Reply to a comment
router.post('/reply', isAuthenticated, replyToComment);

// Delete a comment
router.delete('/:commentId', isAuthenticated, deleteComment);

export default router;
