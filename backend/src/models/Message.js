import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema({
  conversation: { type: ObjectId, ref: 'Conversation', index: true },
  sender: { type: ObjectId, ref: 'User' },
  text: { type: String },
  attachments: [String],
  seenBy: [{ type: ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
