/* ── FIREBASE (real credentials) ─────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyB8nduCAhhKpRkfm2JEeEdD6udJ_qJ1tAE",
  authDomain: "fifa2026-prediction-hub.firebaseapp.com",
  projectId: "fifa2026-prediction-hub",
  storageBucket: "fifa2026-prediction-hub.firebasestorage.app",
  messagingSenderId: "1002777078228",
  appId: "1:1002777078228:web:932a63c575cdf8bdfe4e41"
};

let db = null;
function _initFirebase() {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    _setSyncState('live');
  } catch (e) { console.error('[WC2026]', e); _setSyncState('err'); }
}
function _setSyncState(s) {
  document.querySelectorAll('.sync-pill').forEach(p => {
    p.className = 'sync-pill ' + s;
    const t = p.querySelector('.sync-txt');
    if (t) t.textContent = s === 'live' ? 'Live' : s === 'err' ? 'Offline' : 'Syncing…';
  });
}

/* ── UTILS ───────────────────────────────────────────────────────────────── */
function slug(n) {
  return (n||'anon').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'anon';
}
function getSavedName() { try { return localStorage.getItem('wc26_name')||''; } catch { return ''; } }
function saveName(n) { try { localStorage.setItem('wc26_name', n.trim()); } catch {} }
function validateName(raw) {
  const v=(raw||'').trim().replace(/\s+/g,' ');
  if (v.length<2) return {ok:false,msg:'Nama minimal 2 karakter.'};
  if (v.length>30) return {ok:false,msg:'Nama maksimal 30 karakter.'};
  if (!/^[a-zA-Z0-9 _.'-]+$/.test(v)) return {ok:false,msg:'Gunakan huruf, angka, spasi saja.'};
  return {ok:true,val:v};
}
function _esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── TOAST ───────────────────────────────────────────────────────────────── */
function toast(msg, type='ok', dur=3800) {
  let z = document.getElementById('toast-zone');
  if (!z) { z = document.createElement('div'); z.id='toast-zone'; document.body.appendChild(z); }
  const icons = {ok:'<i class="bi bi-check-circle-fill"></i>',err:'<i class="bi bi-x-circle-fill"></i>',info:'<i class="bi bi-info-circle-fill"></i>',warn:'<i class="bi bi-exclamation-triangle-fill"></i>'};
  const el = document.createElement('div');
  el.className = `toast t-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||icons.info}</span><span>${_esc(msg)}</span>`;
  z.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  const rm = ()=>{ el.classList.replace('show','hide'); setTimeout(()=>el.remove(),300); };
  const t = setTimeout(rm, dur);
  el.addEventListener('click',()=>{ clearTimeout(t); rm(); });
}

/* ── CONFETTI ────────────────────────────────────────────────────────────── */
function confetti(dur=2200) {
  const cols=['#00D4FF','#0057FF','#FFD700','#00FF88','#FF4444','#fff'];
  for (let i=0;i<72;i++) {
    const el=document.createElement('div'); el.className='confetti';
    const sz=7+Math.random()*8;
    el.style.cssText=`width:${sz}px;height:${sz*(0.5+Math.random())}px;background:${cols[Math.floor(Math.random()*cols.length)]};left:${Math.random()*100}vw;border-radius:${Math.random()>.5?'50%':'2px'};opacity:.9`;
    document.body.appendChild(el);
    const start=performance.now()+Math.random()*400;
    const xd=(Math.random()-.5)*250, rot=(Math.random()-.5)*720, pd=dur*(0.6+Math.random()*.5);
    const f=ts=>{
      if(!el.parentNode)return;
      const e=Math.max(0,ts-start), p=Math.min(e/pd,1), ease=1-Math.pow(1-p,2);
      el.style.transform=`translate(${xd*ease}px,${(window.innerHeight+20)*ease-10}px) rotate(${rot*ease}deg)`;
      el.style.opacity=p>.75?(1-(p-.75)/.25):.9;
      if(p<1)requestAnimationFrame(f); else el.remove();
    };
    requestAnimationFrame(f);
  }
}

/* ── COUNTDOWN ───────────────────────────────────────────────────────────── */
function startCountdown(target, el) {
  if (!el) return;
  const pad=n=>String(n).padStart(2,'0');
  const tick=()=>{
    const diff=Math.max(0,new Date(target)-Date.now());
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000),
          m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
    el.querySelectorAll('[data-cd]').forEach(u=>{
      const k=u.dataset.cd; u.textContent=pad({d,h,m,s}[k]||0);
    });
    if(diff>0) requestAnimationFrame(()=>setTimeout(tick,1000));
    else el.querySelectorAll('[data-cd]').forEach(u=>{u.textContent='00';});
  };
  tick();
}

/* ── NAVBAR (Bootstrap Icons) ────────────────────────────────────────────── */
function renderNav(activePage) {
  const pages = [
    {href:'index.html',    icon:'bi-house-fill',       label:'Home'},
    {href:'predictions.html', icon:'bi-bullseye',      label:'Prediksi'},
    {href:'bracket.html',  icon:'bi-diagram-3-fill',   label:'Bracket'},
    {href:'champion.html', icon:'bi-trophy-fill',      label:'Juara'},
    {href:'ai-predict.html',icon:'bi-robot',           label:'AI Predict'},
    {href:'leaderboard.html',icon:'bi-bar-chart-fill', label:'Leaderboard'},
  ];
  const el = document.getElementById('app-nav'); if (!el) return;
  el.innerHTML = `
    <nav class="site-nav">
      <div class="nav-inner">
        <a href="author.html" class="nav-brand" title="About the Authors">
          <div class="nav-logo">
            <img src="css/img1.png" alt="WC26">
          </div>
          <div class="nav-title">FIFA World Cup<strong>Prediction Hub</strong></div>
        </a>
        <ul class="nav-links" id="nav-links-list">
          ${pages.map(p=>`<li><a href="${p.href}" class="${p.href===activePage?'active':''}"><i class="bi ${p.icon}"></i> ${p.label}</a></li>`).join('')}
        </ul>
        <div class="nav-right">
          <span class="sync-pill" title="Firebase sync"><span class="dot"></span><span class="sync-txt">Syncing…</span></span>
          <a href="admin.html" class="btn-icon-nav" title="Admin Panel"><i class="bi bi-gear-fill"></i></a>
          <button class="burger" id="burger-btn" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    </nav>`;
  const btn=document.getElementById('burger-btn'), list=document.getElementById('nav-links-list');
  btn?.addEventListener('click',()=>{ const o=list.classList.toggle('open'); btn.classList.toggle('open',o); });
}

/* ── PITCH OVERLAY & TOAST ZONE ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  _initFirebase();
  if (!document.querySelector('.pitch-overlay')) {
    const p=document.createElement('div'); p.className='pitch-overlay'; document.body.prepend(p);
  }
  if (!document.getElementById('toast-zone')) {
    const t=document.createElement('div'); t.id='toast-zone'; document.body.appendChild(t);
  }
});
