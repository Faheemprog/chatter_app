import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import { authSocket, getUserFromToken } from './utils/socketAuth.js';
import Message from './models/Message.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/auth', limiter);

app.get('/', (_req, res) => res.json({ ok: true, message: 'Chat API running' }));
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }
});

io.use(authSocket);
io.on('connection', (socket) => {
  const userId = socket.user?.id;
  if (!userId) return socket.disconnect(true);

  socket.join(userId);

  socket.on('chat:join', ({ conversationId }) => {
    if (conversationId) socket.join(conversationId);
  });

  socket.on('chat:typing', ({ conversationId, isTyping }) => {
    if (conversationId) socket.to(conversationId).emit('chat:typing', { userId, isTyping });
  });

  socket.on('chat:message:send', async ({ conversationId, text }) => {
    if (!conversationId || !text?.trim()) return;
    const msg = await Message.create({ conversation: conversationId, sender: userId, text });
    io.to(conversationId).emit('chat:message:new', {
      _id: msg._id,
      conversation: conversationId,
      sender: userId,
      text: msg.text,
      createdAt: msg.createdAt
    });
  });

  socket.on('disconnect', () => {});
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`API on http://localhost:${port}`));
}
start();
