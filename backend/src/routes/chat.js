import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/conversations', requireAuth, async (req, res) => {
  const { otherUserId } = req.body;
  if(!otherUserId) return res.status(400).json({ message: 'otherUserId required' });
  let convo = await Conversation.findOne({ isGroup:false, members: { $all: [req.user.id, otherUserId] } });
  if(!convo){
    convo = await Conversation.create({ isGroup:false, members: [req.user.id, otherUserId] });
  }
  res.json(convo);
});

router.get('/conversations', requireAuth, async (req, res) => {
  const items = await Conversation.find({ members: req.user.id }).sort({ updatedAt: -1 });
  res.json(items);
});

router.get('/messages/:conversationId', requireAuth, async (req, res) => {
  const { conversationId } = req.params;
  const { cursor } = req.query;
  const q = { conversation: conversationId };
  if (cursor) q.createdAt = { $lt: new Date(cursor) };
  const messages = await Message.find(q).sort({ createdAt: -1 }).limit(50);
  res.json(messages.reverse());
});

export default router;
