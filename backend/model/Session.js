import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  topicsToFocus: {
    type: [String], // ✅ Array of strings, not single string
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }] // ✅ Not required, can be empty initially
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;