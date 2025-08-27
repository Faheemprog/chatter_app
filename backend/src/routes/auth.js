import express from 'express';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message:'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(409).json({ message:'Email already in use' });
    const hash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = signToken({ id: user._id });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  }catch(e){
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message:'Missing fields' });
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ message:'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if(!ok) return res.status(401).json({ message:'Invalid credentials' });
    const token = signToken({ id: user._id });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  }catch(e){
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (_req, res) => {
  try{
    const users = await User.find({}, '_id name email').sort({ name: 1 });
    res.json(users);
  }catch(e){
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
