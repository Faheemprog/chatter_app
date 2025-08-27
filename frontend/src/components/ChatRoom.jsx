import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function ChatRoom({ token, socketRef, conversation, me }){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(()=>{
    if(!conversation?._id) return;
    axios.get(import.meta.env.VITE_API_URL + '/api/messages/' + conversation._id, {
      headers: { Authorization: 'Bearer ' + token }
    }).then(res => setMessages(res.data));
  }, [conversation?._id, token]);

  useEffect(()=>{
    const s = socketRef.current;
    if(!s || !conversation?._id) return;
    s.emit('chat:join', { conversationId: conversation._id });
    const onNew = (msg)=>{
      if(msg.conversation === conversation._id){
        setMessages(m=>[...m, msg]);
      }
    };
    const onTyping = ({ userId, isTyping }) => {
      if(userId !== me.id) setOtherTyping(isTyping);
    };
    s.on('chat:message:new', onNew);
    s.on('chat:typing', onTyping);
    return ()=>{
      s.off('chat:message:new', onNew);
      s.off('chat:typing', onTyping);
    };
  }, [socketRef, conversation?._id, me.id]);

  function send(){
    if(!text.trim()) return;
    socketRef.current.emit('chat:message:send', { conversationId: conversation._id, text });
    setText('');
  }

  function onType(e){
    const value = e.target.value;
    setText(value);
    if(!typing){
      setTyping(true);
      socketRef.current.emit('chat:typing', { conversationId: conversation._id, isTyping: true });
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(()=>{
      setTyping(false);
      socketRef.current.emit('chat:typing', { conversationId: conversation._id, isTyping: false });
    }, 700);
  }

  return (
    <div className="chat">
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="title">Conversation</div>
        {otherTyping && <div className="subtitle">Someone is typing…</div>}
      </div>
      <div className="msgs card">
        {messages.map(m=> (
          <div key={m._id} className={'msg ' + (m.sender === me.id ? 'me':'other')}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="toolbar">
        <input placeholder="Type a message..." value={text} onChange={onType}/>
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
