import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const ConversationSchema = new mongoose.Schema({
  isGroup: { type: Boolean, default: false },
  name: { type: String }, // for groups
  members: [{ type: ObjectId, ref: 'User', index: true }],
  lastMessageAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
