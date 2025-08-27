import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(token){
  const ref = useRef(null);
  useEffect(()=>{
    if(!token) return;
    const s = io(import.meta.env.VITE_API_URL, { auth: { token } });
    ref.current = s;
    return () => s.disconnect();
  }, [token]);
  return ref;
}
