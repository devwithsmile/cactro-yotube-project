import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import Note from '../models/noteModel.js';

const router = express.Router();

// Get all notes for a video
router.get('/:videoId', isAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ 
      userId: req.user._id,
      videoId: req.params.videoId 
    }).sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// Create a new note
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { videoId, content } = req.body;
    
    if (!videoId || !content) {
      return res.status(400).json({ error: 'VideoId and content are required' });
    }
    
    const note = new Note({
      userId: req.user._id,
      videoId,
      content
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error creating note' });
  }
});

// Update a note
router.patch('/:id', isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { content },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error updating note' });
  }
});

// Delete a note
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting note' });
  }
});

export default router;
