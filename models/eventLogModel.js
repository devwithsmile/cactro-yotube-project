import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  action: { 
    type: String, 
    required: true 
  },
  details: { 
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('EventLog', eventLogSchema);
