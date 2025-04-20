import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  googleId: { type: String, required: true, unique: true },
  accessToken: { type: String },
  refreshToken: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
