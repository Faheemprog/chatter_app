import { verifyToken } from './jwt.js';

export function getUserFromToken(token){
  const decoded = verifyToken(token);
  if(!decoded) return null;
  return { id: decoded.id };
}

export function authSocket(socket, next){
  const token = socket.handshake?.auth?.token;
  const user = token ? getUserFromToken(token) : null;
  if(!user) return next(new Error('Unauthorized'));
  socket.user = user;
  next();
}
