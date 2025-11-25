:root{--bg:#0b1020;--card:#0f1724;--accent:#6B5DFB;--muted:#9aa3ff}
*{box-sizing:border-box}
body{margin:0;font-family:Inter, system-ui, Arial;background:linear-gradient(180deg,var(--bg),#051025);color:#eef2ff}
.app{display:flex;gap:18px;padding:28px;max-width:1200px;margin:0 auto}
.card{background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);padding:16px;border-radius:14px;box-shadow:0 8px 30px rgba(2,6,23,0.6)}
.sidebar{width:320px}
.sidebar h1{margin:0 0 6px}
.muted{color:var(--muted);margin:0 0 12px}
label{display:block;font-size:0.85rem;margin-top:8px;color:var(--muted)}
input,select{width:100%;padding:10px;border-radius:10px;border:none;background:#071225;color:#fff;margin-top:6px}
.row{display:flex;gap:8px;margin-top:12px}
button{background:var(--accent);border:none;color:white;padding:10px 12px;border-radius:10px;cursor:pointer}
button.secondary{background:transparent;border:1px solid rgba(255,255,255,0.06)}
.board{flex:1}
.board-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.roleBox{margin-top:6px;color:var(--muted)}
.main-grid{display:grid;grid-template-columns:220px 1fr 300px;gap:12px}
.players.small{padding:12px}
#playersContainer div{padding:6px;border-radius:8px;margin-bottom:6px;background:rgba(255,255,255,0.02)}
.chat{display:flex;flex-direction:column}
#chatBox{height:320px;overflow:auto;padding:8px;background:rgba(0,0,0,0.12);border-radius:8px}
.chat-input{display:flex;gap:8px;margin-top:8px}
.timer{font-size:1.4rem;margin-top:8px}
@media(max-width:980px){.app{flex-direction:column;padding:12px}.main-grid{grid-template-columns:1fr}}
