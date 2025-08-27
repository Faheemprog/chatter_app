import { useEffect, useState } from 'react';

export function useAuth(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(()=>{
    if(token) localStorage.setItem('token', token);
  }, [token]);

  function saveSession(t,u){
    setToken(t);
    setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }
  function clearSession(){
    setToken(null); setUser(null);
    localStorage.removeItem('token'); localStorage.removeItem('user');
  }
  return { token, user, saveSession, clearSession };
}
