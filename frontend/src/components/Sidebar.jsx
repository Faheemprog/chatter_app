export default function Sidebar({ users, onPick, me }){
  return (
    <div className="sidebar">
      <div className="card">
        <div className="title">People</div>
        <div className="subtitle" style={{ marginBottom: 8 }}>Logged in as <span className="badge">{me?.name}</span></div>
        <div className="list">
          {users.filter(u=>u._id!==me?.id).map(u=>(
            <div key={u._id} className="list-item" onClick={()=>onPick(u)}>
              {u.name} <span className="subtitle">({u.email})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
