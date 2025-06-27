import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { 
    type: String, 
    enum: ['user', 'admin'], // Allow only 'user' or 'admin'
    default: 'user' // Default role is 'user'
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema); 