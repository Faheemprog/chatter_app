import { useState } from 'react';
import axios from 'axios';

export default function Auth({ onDone }){
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e){
    e.preventDefault();
    setLoading(true); setError('');
    try{
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const { data } = await axios.post(import.meta.env.VITE_API_URL + url, payload);
      onDone(data);
    }catch(err){
      setError(err?.response?.data?.message || 'Something went wrong');
    }finally{ setLoading(false); }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "5rem auto" }}>
        <div className="title center">{isLogin ? "Welcome back" : "Create account"}</div>
        <p className="subtitle center">{isLogin ? "Login to continue" : "Start messaging in seconds"}</p>
        <form onSubmit={submit}>
          {!isLogin && <div style={{ marginBottom: 8 }}><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /></div>}
          <div style={{ marginBottom: 8 }}><input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div style={{ marginBottom: 8 }}><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Please wait..." : (isLogin ? "Login" : "Register")}</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button onClick={()=>setIsLogin(!isLogin)} type="button">
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
