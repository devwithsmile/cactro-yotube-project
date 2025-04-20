import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  videoId: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
