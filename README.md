# ChatterBox — Real-time Chat App (React + Node/Express + Socket.io + MongoDB)

A clean, production-style scaffold for a real-time 1:1 (and future group) chat. Includes JWT auth, typing indicators, message history, and a modern dark UI.

## Stack
- Frontend: React (Vite), socket.io-client, axios
- Backend: Node.js, Express, Socket.io, MongoDB (Mongoose), JWT, bcrypt, Helmet, CORS, Rate Limiting
- Infra: MongoDB Atlas (or local), Vercel/Netlify for FE, Render/Railway for BE

## Features
- Register/Login with JWT
- List users and create 1:1 conversation
- Real-time messages with Socket.io
- Typing indicator
- Message history with pagination-ready API
- Dark, responsive UI

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env
# Fill MONGODB_URI and JWT_SECRET
npm i
npm run dev
```
By default runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
cp .env.example .env
# Ensure VITE_API_URL points to your backend (http://localhost:5000)
npm i
npm run dev
```
Open `http://localhost:5173`.

### Quick Test
- Open two browsers (or incognito) and register two users.
- From user A, click on user B in the sidebar and start chatting.

## Deploy
- **DB**: Create MongoDB Atlas cluster.
- **Backend**: Deploy to Render/Railway/Fly. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (include your FE domain).
- **Frontend**: Deploy to Vercel/Netlify. Set `VITE_API_URL` to your backend URL.

## Project Structure
```
chatterbox-best/
  backend/
    src/
      models/ (User, Conversation, Message)
      routes/ (auth, chat)
      middleware/ (auth)
      utils/ (jwt, socketAuth)
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/ (Auth, Sidebar, ChatRoom)
      hooks/ (useAuth, useSocket)
      App.jsx, app.css, main.jsx
    .env.example
    index.html
    package.json
  README.md
```

## Notes & Next Steps
- Add read receipts (`seenBy`) and group chats (set `isGroup:true`, `name`, and `members`).
- Add file/image uploads (Cloudinary).
- Replace inline styles with Tailwind if desired.
- Add tests and GitHub Actions for CI.
