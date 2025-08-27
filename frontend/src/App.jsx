import { useEffect, useState } from 'react';
import axios from 'axios';
import './app.css';
import Auth from './components/Auth.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import { useAuth } from './hooks/useAuth.js';
import { useSocket } from './hooks/useSocket.js';

export default function App(){
  const { token, user, saveSession, clearSession } = useAuth();
  const socketRef = useSocket(token);
  const [users, setUsers] = useState([]);
  const [conversation, setConversation] = useState(null);

  useEffect(()=>{
    if(!token) return;
    axios.get(import.meta.env.VITE_API_URL + '/api/auth/users')
      .then(res=> setUsers(res.data));
  }, [token]);

  async function startChat(otherUser){
    const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/conversations',
      { otherUserId: otherUser._id },
      { headers: { Authorization: 'Bearer ' + token } }
    );
    setConversation(data);
  }

  if(!token || !user){
    return <Auth onDone={({ token, user }) => saveSession(token, user)} />
  }

  return (
    <div className="container">
      <div className="row">
        <Sidebar users={users} onPick={startChat} me={user}/>
        {conversation ? (
          <ChatRoom token={token} socketRef={socketRef} conversation={conversation} me={user} />
        ) : (
          <div className="card" style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="center">
              <div className="title">ChatterBox</div>
              <p className="subtitle">Select a user to start chatting</p>
              <button onClick={clearSession}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
