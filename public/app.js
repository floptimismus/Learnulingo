"use strict";
/* Learnulingo – client app (ported from the Daily Learn artifact) */
/* ---------- icons ---------- */
const I = {
  literature:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11.5h5"/></svg>',
  geography:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z"/></svg>',
  history:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/></svg>',
  architecture:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V10l7-6 7 6v11"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/></svg>',
  art:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1.2-1.8-1.2-3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/></svg>',
  pop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  news:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h13v16H6a2 2 0 0 1-2-2z"/><path d="M17 8h3v10a2 2 0 0 1-2 2"/><path d="M7.5 8h6M7.5 12h6M7.5 16h4"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5.5 6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.4 1.2-4 2.4-5.2.2 1.6 1 2.8 2.1 3.2C10.6 8 11 5 12 2z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  ice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  cross:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.8z"/></svg>',
  repeat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>'
};
const THEMES = {
  literature:{wd:1,name:"Literatur",line:"Strömungen, Autorinnen und Autoren, Klassiker"},
  geography:{wd:2,name:"Geografie",line:"Ein Land pro Lektion"},
  history:{wd:3,name:"Politische Geschichte",line:"Ereignisse, Ursachen, Folgen"},
  architecture:{wd:4,name:"Architektur",line:"Stile erkennen, Bauten kennen"},
  art:{wd:5,name:"Kunst",line:"Strömungen, Künstler, Werke"},
  pop:{wd:6,name:"Popkultur",line:"Musik, Film, Mode, Trends"},
  news:{wd:0,name:"Wochenrückblick",line:"Die wichtigsten Nachrichten der Woche"}
};
const THEME_BY_WD = {}; for (const k in THEMES) THEME_BY_WD[THEMES[k].wd]=k;
const LEN = {1:{name:"Kurz",min:"~5 Min"},2:{name:"Mittel",min:"~10 Min"},3:{name:"Lang",min:"~15 Min"}};
const AVATARS = ["🦊","🦉","🐙","🦁","🐼","🐢","🦄","🐧","🐝","🦩","🐳","🦔"];
const WD_SHORT = ["So","Mo","Di","Mi","Do","Fr","Sa"];
const BADGES = [
  {id:"first",name:"Erste Lektion",test:p=>(p.activeDays||0)>=1},
  {id:"perfect",name:"Fehlerfrei",test:p=>(p.perfectCount||0)>=1},
  {id:"streak7",name:"7-Tage-Streak",test:p=>(p.best||0)>=7},
  {id:"week",name:"Volle Woche",test:p=>Object.values(p.weekThemes||{}).some(a=>a.length>=7)},
  {id:"countries10",name:"10 Länder",test:p=>(p.countries||[]).length>=10},
  {id:"streak30",name:"30-Tage-Streak",test:p=>(p.best||0)>=30},
  {id:"long10",name:"10 lange Lektionen",test:p=>(p.longCount||0)>=10},
  {id:"countries25",name:"25 Länder bereist",test:p=>(p.countries||[]).length>=25},
  {id:"xp1000",name:"1000 XP",test:p=>(p.xp||0)>=1000},
  {id:"streak100",name:"100-Tage-Streak",test:p=>(p.best||0)>=100}
];
const XP = {perCorrect:10,lenBonus:{1:0,2:10,3:25},perfect:{1:15,2:30,3:50},review:5};

/* ---------- dates (viewer's local time zone) ---------- */
const pad = n=>String(n).padStart(2,"0");
const ymd = d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parseYmd = s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const todayStr = ()=>ymd(new Date());
const dayDiff = (a,b)=>Math.round((parseYmd(b)-parseYmd(a))/864e5);
const addDays = (s,n)=>{const d=parseYmd(s);d.setDate(d.getDate()+n);return ymd(d)};
function isoWeek(s){const d=parseYmd(s);const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y=t.getUTCFullYear();const w=Math.ceil(((t-Date.UTC(y,0,1))/864e5+1)/7);return y+"-W"+pad(w)}
const fmtDate = s=>parseYmd(s).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
const fmtShort = s=>parseYmd(s).toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"short"});
const levelOf = xp=>{let L=1;while(50*(L+1)*L<=xp)L++;return L};
const levelStart = L=>50*L*(L-1);

/* ---------- helpers ---------- */
const $ = s=>document.querySelector(s);
const esc = s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function el(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function cleanSvg(str){
  if(!str||typeof str!=="string")return "";
  try{
    const doc=new DOMParser().parseFromString(str,"image/svg+xml");
    const root=doc.documentElement; if(!root||root.nodeName.toLowerCase()!=="svg")return "";
    const bad=new Set(["script","foreignobject","iframe","image","use","a","style","animate","set","animatetransform","animatemotion"]);
    const walk=n=>{[...n.children].forEach(c=>{if(bad.has(c.nodeName.toLowerCase())){c.remove();return}
      [...c.attributes].forEach(at=>{const nm=at.name.toLowerCase();if(nm.startsWith("on")||nm.includes("href")||/url\s*\(/i.test(at.value)&&!/url\(#/i.test(at.value))c.removeAttribute(at.name)});walk(c)})};
    [...root.attributes].forEach(at=>{if(at.name.toLowerCase().startsWith("on"))root.removeAttribute(at.name)});
    walk(root); root.setAttribute("class",((root.getAttribute("class")||"")+" ill").trim());
    root.setAttribute("aria-hidden","true");
    return new XMLSerializer().serializeToString(root);
  }catch(e){return ""}
}
function safeUrl(u){try{const x=new URL(u);return (x.protocol==="https:"||x.protocol==="http:")?x.href:null}catch(e){return null}}
function toast(msg){const t=el(`<div class="toast" role="status"></div>`);t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function burst(color){if(reduced)return;const b=el('<div class="burst"></div>');const cols=[color,"var(--gold)","var(--good)","var(--flame)"];for(let i=0;i<26;i++){const p=document.createElement("i");const a=Math.random()*Math.PI*2,r=90+Math.random()*130;p.style.setProperty("--dx",Math.cos(a)*r+"px");p.style.setProperty("--dy",Math.sin(a)*r-40+"px");p.style.setProperty("--r",(Math.random()*540-270)+"deg");p.style.background=cols[i%cols.length];b.appendChild(p)}document.body.appendChild(b);setTimeout(()=>b.remove(),1100)}
function setDay(theme){document.documentElement.style.setProperty("--day",`var(--c-${theme})`)}
function lsGet(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

I.key='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 9.2-9.2M17 6l3 3M14.5 8.5l2 2"/></svg>';

/* ---------- API ---------- */
async function api(path,opts={}){
  const o={method:opts.method||"GET",headers:{},credentials:"same-origin"};
  if(opts.body!==undefined){o.headers["content-type"]="application/json";o.body=JSON.stringify(opts.body)}
  let r;try{r=await fetch(path,o)}catch(e){const er=new Error("Keine Verbindung zum Server.");er.status=0;throw er}
  let d=null;try{d=await r.json()}catch(e){}
  if(!r.ok){const e=new Error((d&&d.error)||("Fehler "+r.status));e.status=r.status;throw e}
  return d;
}

/* ---------- passkeys (WebAuthn) ---------- */
const b64u={
  enc(buf){const b=new Uint8Array(buf);let s="";for(const x of b)s+=String.fromCharCode(x);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},
  dec(str){const s=str.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((str.length+3)%4);return Uint8Array.from(atob(s),c=>c.charCodeAt(0)).buffer}
};
const passkeySupported=()=>!!(window.PublicKeyCredential&&navigator.credentials&&window.isSecureContext);
async function createPasskey(o){
  const publicKey=Object.assign({},o,{challenge:b64u.dec(o.challenge),user:Object.assign({},o.user,{id:b64u.dec(o.user.id)}),
    excludeCredentials:(o.excludeCredentials||[]).map(c=>Object.assign({},c,{id:b64u.dec(c.id)}))});
  const c=await navigator.credentials.create({publicKey});const r=c.response;
  return {id:c.id,rawId:b64u.enc(c.rawId),type:c.type,authenticatorAttachment:c.authenticatorAttachment||undefined,
    clientExtensionResults:c.getClientExtensionResults?c.getClientExtensionResults():{},
    response:{clientDataJSON:b64u.enc(r.clientDataJSON),attestationObject:b64u.enc(r.attestationObject),transports:r.getTransports?r.getTransports():[]}};
}
async function getPasskey(o){
  const publicKey=Object.assign({},o,{challenge:b64u.dec(o.challenge),allowCredentials:(o.allowCredentials||[]).map(c=>Object.assign({},c,{id:b64u.dec(c.id)}))});
  const c=await navigator.credentials.get({publicKey});const r=c.response;
  return {id:c.id,rawId:b64u.enc(c.rawId),type:c.type,authenticatorAttachment:c.authenticatorAttachment||undefined,
    clientExtensionResults:c.getClientExtensionResults?c.getClientExtensionResults():{},
    response:{clientDataJSON:b64u.enc(r.clientDataJSON),authenticatorData:b64u.enc(r.authenticatorData),signature:b64u.enc(r.signature),userHandle:r.userHandle?b64u.enc(r.userHandle):undefined}};
}
function passkeyError(e){
  if(e&&e.name==="NotAllowedError")return "Abgebrochen oder Zeit abgelaufen.";
  if(e&&e.name==="InvalidStateError")return "Auf diesem Gerät gibt es schon einen Passkey für dieses Konto.";
  if(e&&e.name==="SecurityError")return "Passkeys funktionieren nur über HTTPS auf der richtigen Domain.";
  return (e&&e.message)||"Das hat nicht geklappt.";
}
async function signUp({username,name,avatar}){
  const {challengeId,options}=await api("/api/auth/register/options",{method:"POST",body:{username,name,avatar}});
  const response=await createPasskey(options);
  await api("/api/auth/register/verify",{method:"POST",body:{challengeId,response}});
}
async function signIn(){
  const {challengeId,options}=await api("/api/auth/login/options",{method:"POST",body:{}});
  const response=await getPasskey(options);
  await api("/api/auth/login/verify",{method:"POST",body:{challengeId,response}});
}
async function addPasskey(){
  const {challengeId,options}=await api("/api/auth/register/options",{method:"POST",body:{addPasskey:true}});
  const response=await createPasskey(options);
  await api("/api/auth/register/verify",{method:"POST",body:{challengeId,response}});
}

/* ---------- state ---------- */
const S={me:null,player:null,review:{items:[]},meLoaded:false,index:[],indexLoaded:false,today:null,todayLoaded:false,
  players:[],playersLoaded:false,len:lsGet("lu-len")||1,board:"streak",view:"heute",err:null};
const isAdmin=()=>!!(S.me&&S.me.isAdmin);

function effStreak(p,today=todayStr()){
  if(!p||!p.lastDay)return 0;
  const gap=dayDiff(p.lastDay,today)-1;
  if(gap<=0)return p.streak||0;
  return gap<=(p.freezes||0)?(p.streak||0):0;
}
function streakCold(p,today=todayStr()){return !p||p.lastDay!==today}
const wk=()=>isoWeek(todayStr());

/* ---------- loading ---------- */
async function loadMe(){
  try{const d=await api("/api/me");S.me=d.user;S.player=d.user?d.player:null;S.review=d.user?d.review:{items:[]};S.err=null}
  catch(e){S.err=e.status===0?"offline":null}
  S.meLoaded=true;render();
}
async function loadIndex(){
  try{const d=await api("/api/lessons");S.index=d.lessons||[]}catch(e){}
  S.indexLoaded=true;render();
}
let todayKey=null;
async function loadToday(force){
  const t=todayStr();if(todayKey===t&&!force)return;todayKey=t;S.todayLoaded=false;
  try{S.today=await api("/api/lessons/"+t)}catch(e){S.today=null}
  S.todayLoaded=true;render();
}
async function loadBoard(){
  try{const d=await api("/api/leaderboard");S.players=d.players||[]}catch(e){}
  S.playersLoaded=true;render();
}
function refreshAll(){loadMe();loadIndex();loadToday(true);loadBoard()}

/* ---------- boot ---------- */
function boot(){
  setDay(THEME_BY_WD[new Date().getDay()]);
  window.addEventListener("hashchange",route);route();
  refreshAll();
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&$("#player").hidden){loadToday();loadBoard();loadMe()}});
}

/* ---------- routing / chrome ---------- */
const ROUTES=["heute","archiv","streaks","profil","redaktion"];
function route(){let h=location.hash.replace("#","");if(h==="rangliste")h="streaks";S.view=ROUTES.includes(h)?h:"heute";if(S.view==="streaks")loadBoard();if(S.view==="redaktion")loadUsers();render();window.scrollTo(0,0)}
function renderTabs(){
  const tabs=[["heute","Heute",I.home],["archiv","Archiv",I.archive],["streaks","Streaks",I.flame],["profil",S.me?"Profil":"Anmelden",S.me?I.user:I.key]];
  if(isAdmin())tabs.push(["redaktion","Redaktion",I.pen]);
  $("#tabs").innerHTML=tabs.map(([k,n,ic])=>`<a href="#${k}" ${S.view===k?'aria-current="page"':""}>${ic}<span>${n}</span></a>`).join("");
}
function renderChips(){
  if(S.meLoaded&&!S.me){$("#chips").innerHTML=`<a class="chip login" href="#profil">${I.key}<span>Anmelden</span></a>`;return}
  const p=S.player;const st=effStreak(p);const cold=streakCold(p);
  $("#chips").innerHTML=`<span class="chip flame ${cold?"cold":""}" title="Streak"><span class="bump" id="flameIc">${I.flame}</span><span class="num">${st}</span></span>
    <span class="chip xp" title="XP">${I.bolt}<span class="num">${p?p.xp||0:0}</span></span>
    ${p&&p.freezes?`<span class="chip ice" title="Streak-Freeze">${I.ice}<span class="num">${p.freezes}</span></span>`:""}`;
}
function render(){
  if(!$("#player").hidden)return; /* don't redraw under an open lesson */
  setDay(THEME_BY_WD[new Date().getDay()]);
  renderTabs();renderChips();
  const v=$("#view");
  if(S.err==="offline"){v.innerHTML=`<div class="panel"><div class="empty"><b>Keine Verbindung</b>Der Server antwortet gerade nicht. Versuch es gleich noch mal.</div></div>`;return}
  const fn={heute:viewToday,archiv:viewArchive,streaks:viewBoard,profil:viewProfile,redaktion:viewAdmin}[S.view]||viewToday;
  v.replaceChildren(...fn());
}

/* ---------- Heute ---------- */
function viewToday(){
  const out=[];const t=todayStr();const wdTheme=THEME_BY_WD[new Date().getDay()];const L=S.today;
  const theme=L?L.theme:wdTheme;setDay(theme);
  const done=S.player&&S.player.completed&&S.player.completed[t];
  const hero=el(`<section class="hero" aria-labelledby="todayTitle">
    <svg class="pattern" viewBox="-10 -10 120 120" aria-hidden="true">${heroPattern(theme)}</svg>
    <div class="eyebrow">${I[theme]}<span>${esc(THEMES[theme].name)} · ${esc(fmtDate(t).split(",")[0])}</span></div>
    <h1 id="todayTitle"></h1><p id="todaySub"></p></section>`);
  if(!S.todayLoaded){hero.querySelector("h1").textContent="Lade die Lektion …"}
  else if(!L){hero.querySelector("h1").textContent="Die heutige Lektion wird noch vorbereitet";hero.querySelector("p").textContent="Schau später wieder vorbei. Bis dahin kannst du im Archiv üben."}
  else{
    hero.querySelector("h1").textContent=L.title;hero.querySelector("p").textContent=L.subtitle||THEMES[theme].line;
    if(L.status==="draft")hero.querySelector("p").textContent+=" (Entwurf, nur für die Redaktion sichtbar)";
    if(done){
      hero.appendChild(el(`<div class="done-badge">${I.check}<span>Heute erledigt: ${done.score}/${done.total} richtig, ${LEN[done.len].name}</span></div>`));
      const b=el(`<button class="btn invert">Noch mal spielen (ohne Streak)</button>`);b.onclick=()=>startLesson(L,S.len,"archive");hero.appendChild(b);
    }else{
      const seg=el(`<div class="seg" role="group" aria-label="Länge wählen"></div>`);
      [1,2,3].forEach(n=>{const b=el(`<button aria-pressed="${S.len===n}"><b>${LEN[n].name}</b><small>${LEN[n].min}</small></button>`);b.onclick=()=>{S.len=n;lsSet("lu-len",n);render()};seg.appendChild(b)});
      hero.appendChild(seg);
      const b=el(`<button class="btn invert">Lektion starten</button>`);b.onclick=()=>startLesson(L,S.len,"daily");hero.appendChild(b);
    }
  }
  out.push(hero);
  if(S.meLoaded&&!S.me){
    const p=el(`<section class="panel"><h2>Mach mit bei der Streak-Liste</h2><p class="note">Mit einem kostenlosen Konto zählen Streak, XP und Abzeichen. Kein Passwort nötig: du meldest dich mit einem Passkey an (Face ID, Fingerabdruck oder Geräte-PIN).</p><div class="hero-auth"><a class="btn primary small" href="#profil">Konto erstellen</a><button class="btn ghost small">Anmelden</button></div></section>`);
    p.querySelector("button").onclick=doSignIn;out.push(p);
  }
  // week strip
  const wkp=el(`<section class="panel"><div class="row"><h2 class="grow">Diese Woche</h2><span class="pill">${esc(wk().replace("-W"," · KW "))}</span></div><div class="week"></div></section>`);
  const now=new Date();const mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));
  for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);const s=ymd(d);const th=THEME_BY_WD[d.getDay()];
    const dn=S.player&&S.player.completed&&S.player.completed[s];
    wkp.querySelector(".week").appendChild(el(`<div class="wd ${dn?"done":""} ${s===t?"today":""}" style="--wc:var(--c-${th})" title="${esc(THEMES[th].name)}"><span class="dot">${dn?I.check:I[th]}</span><span>${WD_SHORT[d.getDay()]}</span></div>`))}
  out.push(wkp);
  // review
  const rv=(S.review&&S.review.items)||[];
  if(rv.length){const p=el(`<section class="panel"><div class="row"><div class="grow"><h2>Fehler wiederholen</h2><p class="note">${rv.length} ${rv.length===1?"Frage wartet":"Fragen warten"} auf eine zweite Chance.</p></div></div></section>`);const b=el(`<button class="btn primary small">${I.repeat}<span>Üben</span></button>`);b.querySelector("svg").style.width="18px";b.onclick=startReview;p.querySelector(".row").appendChild(b);out.push(p)}
  // schedule
  const sch=el(`<section class="panel"><h2>Wochenplan</h2><div class="list"></div></section>`);
  [1,2,3,4,5,6,0].forEach(w=>{const k=THEME_BY_WD[w];sch.querySelector(".list").appendChild(el(`<div class="row" style="--wc:var(--c-${k})"><span class="item ic" style="width:34px;height:34px;padding:0;border:0;display:grid;place-items:center;background:var(--wc);color:var(--on-day)">${I[k]}</span><div class="grow"><b>${WD_SHORT[w]} · ${esc(THEMES[k].name)}</b><div class="note">${esc(THEMES[k].line)}</div></div></div>`))});
  sch.querySelectorAll(".item.ic svg").forEach(s=>{s.style.width="18px";s.style.height="18px"});
  out.push(sch);
  return out;
}
function heroPattern(theme){
  const seed=THEMES[theme]?THEMES[theme].wd:0;const rot=seed*37;
  return `<g style="color:var(--on-day)" transform="rotate(${rot} 50 50)"><path fill="currentColor" d="M52 6c14 1 27 9 33 22s4 29-5 40-24 18-38 17S14 75 9 62 6 33 15 21 38 5 52 6z"/>
  <path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M20 80c12-8 18-20 22-34s14-24 30-28"/>
  <path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M42 46c-8-2-14-8-16-16M48 34c6-6 14-8 22-6"/>
  <circle cx="82" cy="78" r="9" fill="currentColor"/></g>`;
}

/* ---------- Archiv ---------- */
function viewArchive(){
  const t=todayStr();const list=S.index.filter(x=>x.date<=t&&x.status!=="draft");
  const out=[el(`<div><h1 class="viewtitle">Archiv</h1><p class="note">Alte Lektionen wiederholen bringt XP, zählt aber nicht für den Streak.</p></div>`)];
  if(!S.indexLoaded){out.push(el(`<div class="panel"><div class="empty"><b>Lade …</b></div></div>`));return out}
  if(!list.length){out.push(el(`<div class="panel"><div class="empty"><b>Noch keine alten Lektionen</b>Jede Tageslektion landet nach dem Tag hier.</div></div>`));return out}
  const seg=el(`<div class="toggle" role="group" aria-label="Länge" style="grid-template-columns:repeat(3,1fr)"></div>`);
  [1,2,3].forEach(n=>{const b=el(`<button aria-pressed="${S.len===n}">${LEN[n].name}</button>`);b.onclick=()=>{S.len=n;lsSet("lu-len",n);render()};seg.appendChild(b)});
  out.push(seg);
  const l=el(`<div class="list"></div>`);
  list.forEach(x=>{const dn=S.player&&S.player.completed&&S.player.completed[x.date];
    const b=el(`<button class="item" style="--wc:var(--c-${x.theme})"><span class="ic">${I[x.theme]||""}</span><span class="grow"><span class="t"></span><span class="s" style="display:block"></span></span>${dn?`<span class="pill good">${dn.score}/${dn.total}</span>`:x.date===t?`<span class="pill warn">Heute</span>`:""}</button>`);
    b.querySelector(".t").textContent=x.title;b.querySelector(".s").textContent=`${fmtShort(x.date)} · ${THEMES[x.theme]?THEMES[x.theme].name:""}`;
    b.onclick=async()=>{const L=await loadLesson(x.date);if(L)startLesson(L,S.len,x.date===t&&!dn?"daily":"archive")};l.appendChild(b)});
  out.push(l);return out;
}
async function loadLesson(date){try{return await api("/api/lessons/"+date)}catch(e){toast(e.status===404?"Diese Lektion ist nicht mehr da.":"Die Lektion lässt sich gerade nicht laden.");return null}}

/* ---------- Streak-Liste (alle Konten) ---------- */
function viewBoard(){
  const out=[el(`<div><h1 class="viewtitle">Streak-Liste</h1><p class="note">Alle Konten bei Learnulingo. Ein Streak zählt, solange jeden Tag eine Tageslektion geschafft wird.</p></div>`)];
  const tg=el(`<div class="toggle" role="group" aria-label="Liste wählen" style="grid-template-columns:repeat(3,1fr)"><button data-k="streak">Aktuell</button><button data-k="best">Rekord</button><button data-k="week">Woche (XP)</button></div>`);
  tg.querySelectorAll("button").forEach(b=>{b.setAttribute("aria-pressed",S.board===b.dataset.k);b.onclick=()=>{S.board=b.dataset.k;render()}});
  out.push(tg);
  if(!S.playersLoaded){out.push(el(`<div class="panel"><div class="empty"><b>Lade …</b></div></div>`));return out}
  const w=wk();const val=p=>S.board==="streak"?effStreak(p):S.board==="best"?(p.best||0):((p.weekXp||{})[w]||0);
  const rows=S.players.map(p=>({p,v:val(p)})).sort((a,b)=>b.v-a.v||(b.p.xp||0)-(a.p.xp||0)||String(a.p.name).localeCompare(b.p.name));
  if(!rows.length){out.push(el(`<div class="panel"><div class="empty"><b>Noch niemand auf der Liste</b>Erstelle das erste Konto und starte deinen Streak.</div></div>`));return out}
  const myId=S.me&&S.me.id;const isXp=S.board==="week";
  const l=el(`<div class="list streaklist"></div>`);let rank=0,prev=null;
  rows.forEach((r,i)=>{if(r.v!==prev){rank=i+1;prev=r.v}
    const it=el(`<div class="item ${r.p.id===myId?"me":""}"><span class="rank ${rank===1&&r.v>0?"r1":""}">${rank}</span><span class="ava"></span><span class="grow"><span class="t"></span><span class="s" style="display:block"></span></span><span class="v" style="color:${isXp?"var(--gold)":"var(--flame)"};display:flex;align-items:center;gap:4px">${isXp?I.bolt:I.flame}<span>${r.v}</span></span></div>`);
    it.querySelector(".v svg").style.cssText="width:18px;height:18px";
    if(!isXp&&S.board==="streak"&&r.v>0&&streakCold(r.p))it.querySelector(".v").title="Heute noch offen";
    it.querySelector(".ava").textContent=r.p.avatar||"🙂";it.querySelector(".t").textContent=(r.p.name||"Jemand")+(r.p.id===myId?" (du)":"");
    it.querySelector(".s").textContent=S.board==="best"?`Aktuell ${effStreak(r.p)} · Level ${levelOf(r.p.xp||0)}`:`Rekord ${r.p.best||0} · Level ${levelOf(r.p.xp||0)} · ${r.p.xp||0} XP`;l.appendChild(it)});
  out.push(l);
  out.push(el(`<p class="note">${rows.length} ${rows.length===1?"Konto":"Konten"}. Streaks zählen in der Zeitzone des jeweiligen Geräts.</p>`));
  return out;
}

/* ---------- Profil / Anmelden ---------- */
async function doSignIn(btn){
  if(!passkeySupported()){toast("Dieser Browser unterstützt keine Passkeys.");return}
  try{if(btn&&btn.disabled!==undefined)btn.disabled=true;await signIn();toast("Willkommen zurück!");await afterAuth()}
  catch(e){toast(passkeyError(e))}finally{if(btn&&btn.disabled!==undefined)btn.disabled=false}
}
async function afterAuth(){await loadMe();loadIndex();loadToday(true);loadBoard();if(S.view==="profil")location.hash="#heute"}
function viewAuth(){
  const out=[el(`<div><h1 class="viewtitle">Willkommen bei Learnulingo</h1><p class="note">Jeden Tag eine kurze Lektion. Mit einem Konto zählen Streak, XP und Abzeichen, und du erscheinst in der Streak-Liste.</p></div>`)];
  if(!passkeySupported())out.push(el(`<div class="panel"><p class="note"><b>Hinweis:</b> Dieser Browser unterstützt keine Passkeys (oder die Seite läuft nicht über HTTPS). Nutze einen aktuellen Browser wie Safari, Chrome, Edge oder Firefox.</p></div>`));
  const login=el(`<section class="panel auth"><h2>Schon dabei?</h2><p class="note">Melde dich mit deinem Passkey an. Dein Gerät fragt nach Face ID, Fingerabdruck oder PIN.</p><button class="btn primary">${I.key}<span>Mit Passkey anmelden</span></button></section>`);
  login.querySelector("svg").style.cssText="width:20px;height:20px";
  login.querySelector("button").onclick=e=>doSignIn(e.currentTarget);
  out.push(login);
  let av=AVATARS[Math.floor(Math.random()*AVATARS.length)];
  const reg=el(`<form class="panel auth" novalidate><h2>Neues Konto</h2>
    <div class="field"><label for="suUser">Benutzername</label><input type="text" id="suUser" autocomplete="username webauthn" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="z. B. lena_m" required></div>
    <div class="field"><label for="suName">Anzeigename (erscheint in der Streak-Liste)</label><input type="text" id="suName" maxlength="24" autocomplete="nickname" required></div>
    <div class="field"><span style="font-weight:600;font-size:14px">Avatar</span><div class="avatars"></div></div>
    <p class="err" role="alert"></p>
    <button type="submit" class="btn primary">Konto mit Passkey erstellen</button>
    <p class="note">Kein Passwort: Der Passkey wird sicher auf deinem Gerät bzw. in deinem Passwort-Manager (iCloud-Schlüsselbund, Google Passwortmanager …) gespeichert und dort synchronisiert.</p></form>`);
  const grid=reg.querySelector(".avatars");
  const draw=()=>{grid.innerHTML="";AVATARS.forEach(a=>{const b=el(`<button type="button" aria-pressed="${a===av}" aria-label="Avatar ${a}"></button>`);b.textContent=a;b.onclick=()=>{av=a;draw()};grid.appendChild(b)})};draw();
  const user=reg.querySelector("#suUser"),name=reg.querySelector("#suName"),err=reg.querySelector(".err");
  user.addEventListener("input",()=>{if(!name.dataset.touched)name.value=user.value.replace(/[._-]+/g," ").replace(/^\w/,c=>c.toUpperCase())});
  name.addEventListener("input",()=>{name.dataset.touched="1"});
  reg.onsubmit=async e=>{e.preventDefault();err.textContent="";
    const u=user.value.trim().toLowerCase(),n=name.value.trim();
    if(!/^[a-z0-9_.-]{3,20}$/.test(u)){err.textContent="Benutzername: 3–20 Zeichen, nur a–z, 0–9, Punkt, Minus und Unterstrich.";user.focus();return}
    if(!n){err.textContent="Bitte einen Anzeigenamen angeben.";name.focus();return}
    if(!passkeySupported()){err.textContent="Dieser Browser unterstützt keine Passkeys.";return}
    const sb=reg.querySelector("button[type=submit]");sb.disabled=true;
    try{await signUp({username:u,name:n,avatar:av});toast("Konto erstellt. Viel Spaß!");await afterAuth()}
    catch(ex){err.textContent=passkeyError(ex)}finally{sb.disabled=false}};
  out.push(reg);
  return out;
}
function viewProfile(){
  if(!S.meLoaded)return [el(`<div class="panel"><div class="empty"><b>Lade …</b></div></div>`)];
  if(!S.me)return viewAuth();
  const out=[];const p=S.player;
  const L=levelOf(p.xp||0),a=levelStart(L),b=levelStart(L+1),pct=Math.round(((p.xp||0)-a)/(b-a)*100);
  const head=el(`<div class="prof"><span class="ava"></span><div class="grow"><h1></h1><div class="note"></div></div></div>`);
  head.querySelector(".ava").textContent=S.me.avatar||"🙂";head.querySelector("h1").textContent=S.me.name;
  head.querySelector(".note").textContent=`@${S.me.username} · Level ${L} · noch ${b-(p.xp||0)} XP bis Level ${L+1}`;
  const eb=el(`<button class="btn ghost small">Bearbeiten</button>`);eb.onclick=editProfile;head.appendChild(eb);out.push(head);
  out.push(el(`<div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Fortschritt zum nächsten Level"><i style="width:${pct}%"></i></div>`));
  out.push(el(`<div class="stats"><div class="stat"><b>${effStreak(p)}</b><span>Tage Streak</span></div><div class="stat"><b>${p.best||0}</b><span>Bester Streak</span></div><div class="stat"><b>${p.xp||0}</b><span>XP gesamt</span></div><div class="stat"><b>${p.freezes||0}</b><span>Streak-Freezes</span></div><div class="stat"><b>${p.activeDays||0}</b><span>Lerntage</span></div><div class="stat"><b>${(p.countries||[]).length}</b><span>Länder bereist</span></div></div>`));
  out.push(el(`<p class="note">Für jede 7 Lerntage gibt es einen Streak-Freeze (höchstens 2). Er rettet deinen Streak automatisch, wenn du einen Tag verpasst.</p>`));
  const bd=el(`<section class="panel"><h2>Abzeichen</h2><div class="badges"></div></section>`);
  BADGES.forEach(x=>{const on=(p.badges||[]).includes(x.id);bd.querySelector(".badges").appendChild(el(`<div class="badge ${on?"on":""}"><span class="medal">${I.star}</span><span>${esc(x.name)}</span></div>`))});
  out.push(bd);
  const rv=(S.review&&S.review.items)||[];
  const rp=el(`<section class="panel"><div class="row"><div class="grow"><h2>Wiederholen</h2><p class="note">${rv.length?`${rv.length} falsch beantwortete Fragen gesammelt.`:"Keine offenen Fehler. Stark."}</p></div></div></section>`);
  if(rv.length){const bb=el(`<button class="btn primary small">Üben</button>`);bb.onclick=startReview;rp.querySelector(".row").appendChild(bb)}
  out.push(rp);
  // account & passkeys
  const acc=el(`<section class="panel"><h2>Konto & Passkeys</h2><p class="note"></p><div class="admin-tools"></div></section>`);
  acc.querySelector(".note").textContent=`Angemeldet als @${S.me.username}. ${S.me.passkeys} ${S.me.passkeys===1?"Passkey":"Passkeys"} hinterlegt. Füge einen weiteren hinzu, wenn du ein Gerät nutzt, das deine Passkeys nicht synchronisiert.`;
  const tools=acc.querySelector(".admin-tools");
  const mk=(t,fn,cls="")=>{const x=el(`<button class="btn ghost small ${cls}"></button>`);x.textContent=t;x.onclick=fn;tools.appendChild(x)};
  mk("Passkey hinzufügen",async()=>{try{await addPasskey();toast("Passkey hinzugefügt");loadMe()}catch(e){toast(passkeyError(e))}});
  mk("Abmelden",async()=>{try{await api("/api/auth/logout",{method:"POST",body:{}})}catch(e){}S.me=null;S.player=null;S.review={items:[]};toast("Abgemeldet");refreshAll()});
  mk("Konto löschen",async()=>{if(!confirm("Konto mit Streak, XP und Abzeichen endgültig löschen?"))return;
    try{await api("/api/me",{method:"DELETE"});toast("Konto gelöscht");S.me=null;S.player=null;refreshAll()}catch(e){toast(e.message)}},"danger");
  out.push(acc);
  out.push(inviteBlock());return out;
}
function inviteBlock(){
  const url=location.origin+"/";
  const p=el(`<section class="panel"><h2>Freunde einladen</h2><p class="note">Teile den Link. Wer ein Konto erstellt, erscheint in der Streak-Liste.</p><div class="copyrow"><input type="text" readonly aria-label="Einladungslink"><button class="btn primary small">Teilen</button></div></section>`);
  const inp=p.querySelector("input");inp.value=url;
  p.querySelector("button").onclick=async()=>{
    if(navigator.share){try{await navigator.share({title:"Learnulingo",text:"Lern jeden Tag mit mir auf Learnulingo!",url});return}catch(e){if(e.name==="AbortError")return}}
    navigator.clipboard.writeText(url).then(()=>toast("Link kopiert"),()=>{inp.select();toast("Markiert. Jetzt kopieren.")})};
  return p;
}
function editProfile(){
  let av=S.me.avatar;
  const m=el(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="obT"><form class="panel"><h2 id="obT" style="font-size:20px">Profil bearbeiten</h2><p class="note">Dein Name erscheint in der Streak-Liste.</p>
    <div class="field"><label for="obName">Anzeigename</label><input type="text" id="obName" maxlength="24" required></div>
    <div class="field"><span style="font-weight:600;font-size:14px">Avatar</span><div class="avatars"></div></div>
    <div class="row"><button type="button" class="btn ghost grow" id="obCancel">Abbrechen</button><button type="submit" class="btn primary grow">Speichern</button></div></form></div>`);
  const nm=m.querySelector("#obName");nm.value=S.me.name;
  const grid=m.querySelector(".avatars");
  const draw=()=>{grid.innerHTML="";AVATARS.forEach(a=>{const b=el(`<button type="button" aria-pressed="${a===av}" aria-label="Avatar ${a}"></button>`);b.textContent=a;b.onclick=()=>{av=a;draw()};grid.appendChild(b)})};draw();
  m.querySelector("#obCancel").onclick=()=>m.remove();
  m.addEventListener("click",e=>{if(e.target===m)m.remove()});
  m.querySelector("form").onsubmit=async e=>{e.preventDefault();const name=nm.value.trim();if(!name){nm.focus();return}
    try{await api("/api/me",{method:"PUT",body:{name,avatar:av}});m.remove();toast("Profil gespeichert");loadMe();loadBoard()}catch(err){toast(err.message)}};
  document.body.appendChild(m);setTimeout(()=>nm.focus(),50);
}
/* ---------- lesson player ---------- */
let P=null;
function startLesson(L,len,mode){
  setDay(L.theme);
  const cards=(L.cards||[]).filter(c=>(c.tier||1)<=len);
  const qs=(L.questions||[]).filter(q=>(q.tier||1)<=len);
  P={L,len,mode,cards,qs,ci:0,qi:-1,phase:"cards",results:[],wrong:[]};
  openPlayer();showCard(0,1);
}
function startReview(){
  const items=((S.review&&S.review.items)||[]).slice(0,8);
  if(!items.length)return;
  const L={title:"Fehler wiederholen",theme:THEME_BY_WD[new Date().getDay()],takeaways:[]};
  P={L,len:1,mode:"review",cards:[],qs:items.map(x=>Object.assign({},x.q,{_key:x.key,_theme:x.theme})),ci:0,qi:-1,phase:"quiz",results:[],wrong:[]};
  openPlayer();nextQuestion();
}
function openPlayer(){const pl=$("#player");pl.hidden=false;document.body.style.overflow="hidden";$("#pClose").innerHTML=I.close;$("#pClose").onclick=confirmClose;document.addEventListener("keydown",onKey)}
function closePlayer(){$("#player").hidden=true;document.body.style.overflow="";document.removeEventListener("keydown",onKey);P=null;render()}
function confirmClose(){
  if(!P||P.phase==="end"){closePlayer();return}
  const f=$("#pFoot");f.innerHTML="";
  const msg=el(`<div class="panel" style="flex:1"><b>Lektion abbrechen?</b><p class="note">Dein Fortschritt in dieser Lektion geht verloren.</p><div class="row"><button class="btn ghost grow">Weiterlernen</button><button class="btn primary grow" style="--day:var(--bad)">Abbrechen</button></div></div>`);
  const [k,q]=msg.querySelectorAll("button");k.onclick=()=>{P.phase==="cards"?showCard(P.ci,0):redrawQuizFoot()};q.onclick=closePlayer;f.appendChild(msg);
}
function progress(){const tot=P.cards.length+P.qs.length;const done=P.phase==="cards"?P.ci:P.cards.length+Math.max(0,P.qi)+(P.answered?1:0);$("#pProg").style.width=Math.min(100,done/tot*100)+"%"}
function onKey(e){if(!P)return;if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))return;
  if(P.phase==="cards"){if(e.key==="ArrowRight"){e.preventDefault();nextCard()}else if(e.key==="ArrowLeft"){e.preventDefault();prevCard()}}
  else if(P.phase==="quiz"&&e.key==="Enter"&&P.answered){e.preventDefault();nextQuestion()}
  else if(e.key==="Escape")confirmClose()}
function renderFigure(img){
  if(!img)return "";
  const svg=cleanSvg(img.svg); if(!svg&&!img.href)return "";
  const href=safeUrl(img.href);
  return `<figure class="fig" style="margin:0">${svg?`<div class="art">${svg}</div>`:""}<figcaption>${esc(img.caption||"")}${img.credit?` · ${esc(img.credit)}`:""}${href?` · <a href="${esc(href)}" target="_blank" rel="noopener">Foto ansehen</a>`:""}</figcaption></figure>`;
}
function showCard(i,dir){
  P.phase="cards";P.ci=i;progress();const c=P.cards[i];const body=$("#pBody");
  const links=(c.links||[]).map(l=>{const u=safeUrl(l.url);return u?`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l.title||u)}</a>`:""}).join("");
  const paras=String(c.body||"").split(/\n\n+/).map(t=>t.trim().startsWith("- ")?`<ul>${t.split(/\n/).map(x=>`<li>${esc(x.replace(/^-\s*/,""))}</li>`).join("")}</ul>`:`<p>${esc(t)}</p>`).join("");
  const card=el(`<article class="card ${dir>0?"enter-r":dir<0?"enter-l":""}" aria-roledescription="Lernkarte" aria-label="Karte ${i+1} von ${P.cards.length}"><div class="kicker">${esc(c.kicker||THEMES[P.L.theme].name)}</div><h2>${esc(c.title)}</h2>${renderFigure(c.img)}${paras}${links?`<div class="links">${links}</div>`:""}</article>`);
  body.replaceChildren(card, el(`<div class="dots" aria-hidden="true">${P.cards.map((_,k)=>`<i class="${k===i?"on":""}"></i>`).join("")}</div>`), el(`<p class="hint">Wischen oder Pfeiltasten</p>`));
  body.scrollTop=0; swipe(card);
  const f=$("#pFoot");f.innerHTML="";
  const back=el(`<button class="btn ghost" ${i===0?"disabled":""}>Zurück</button>`);back.onclick=prevCard;back.style.flex="0 0 auto";
  const nx=el(`<button class="btn primary">${i===P.cards.length-1?"Zum Quiz":"Weiter"}</button>`);nx.onclick=nextCard;f.append(back,nx);
}
function nextCard(){if(P.ci<P.cards.length-1)showCard(P.ci+1,1);else{P.phase="quiz";nextQuestion()}}
function prevCard(){if(P.ci>0)showCard(P.ci-1,-1)}
function swipe(node){let x0=null,y0=0,dx=0,lock=null;
  node.addEventListener("pointerdown",e=>{if(e.target.closest("a"))return;x0=e.clientX;y0=e.clientY;dx=0;lock=null});
  node.addEventListener("pointermove",e=>{if(x0===null)return;dx=e.clientX-x0;const dy=e.clientY-y0;if(lock===null&&(Math.abs(dx)>8||Math.abs(dy)>8))lock=Math.abs(dx)>Math.abs(dy)?"x":"y";if(lock==="x"){node.style.transform=`translateX(${dx}px) rotate(${dx/40}deg)`}});
  const end=()=>{if(x0===null)return;if(lock==="x"&&dx<-60)nextCard();else if(lock==="x"&&dx>60&&P.ci>0)prevCard();else node.style.transform="";x0=null};
  node.addEventListener("pointerup",end);node.addEventListener("pointercancel",end);node.addEventListener("pointerleave",end)}

const QLABEL={mc:"Wähle die richtige Antwort",tf:"Wahr oder falsch?",image:"Was siehst du?",match:"Bilde Paare",order:"Bring in die richtige Reihenfolge"};
function nextQuestion(){
  P.qi++;P.answered=false;P.sel=null;
  if(P.qi>=P.qs.length){finish();return}
  progress();const q=P.qs[P.qi];if(P.mode==="review"&&q._theme)setDay(q._theme);
  const body=$("#pBody");const box=el(`<section class="q" style="display:flex;flex-direction:column;gap:16px"><div class="qtype">${QLABEL[q.type]||"Frage"} · ${P.qi+1}/${P.qs.length}</div><h2></h2></section>`);
  box.querySelector("h2").textContent=q.prompt;
  if(q.svg){const s=cleanSvg(q.svg);if(s)box.appendChild(el(`<div class="fig"><div class="art">${s}</div></div>`))}
  ({mc:qChoice,image:qChoice,tf:qTF,match:qMatch,order:qOrder}[q.type]||qChoice)(q,box);
  body.replaceChildren(box);body.scrollTop=0;redrawQuizFoot();
}
function redrawQuizFoot(){
  const f=$("#pFoot");f.innerHTML="";
  if(P.answered){showFeedback();return}
  const q=P.qs[P.qi];
  if(q.type==="match"){f.appendChild(el(`<p class="hint" style="flex:1">Tippe links und dann rechts an</p>`));return}
  const b=el(`<button class="btn primary" ${P.sel==null||(q.type==="order"&&P.sel.length<q.items.length)?"disabled":""}>Prüfen</button>`);b.onclick=check;f.appendChild(b);
}
function qChoice(q,box){
  const o=el(`<div class="opts" role="group" aria-label="Antworten"></div>`);
  P.order=shuffle(q.options.map((t,i)=>i));
  P.order.forEach(i=>{const b=el(`<button class="opt" aria-pressed="false"></button>`);b.textContent=q.options[i];b.dataset.i=i;b.onclick=()=>{if(P.answered)return;P.sel=i;o.querySelectorAll(".opt").forEach(x=>x.setAttribute("aria-pressed",x===b));redrawQuizFoot()};o.appendChild(b)});
  box.appendChild(o);
}
function qTF(q,box){
  const o=el(`<div class="tf" role="group" aria-label="Wahr oder falsch"></div>`);
  [[true,"Wahr"],[false,"Falsch"]].forEach(([v,t])=>{const b=el(`<button class="opt" aria-pressed="false">${t}</button>`);b.dataset.v=v;b.onclick=()=>{if(P.answered)return;P.sel=v;o.querySelectorAll(".opt").forEach(x=>x.setAttribute("aria-pressed",x===b));redrawQuizFoot()};o.appendChild(b)});
  box.appendChild(o);
}
function qMatch(q,box){
  const pairs=q.pairs; P.mistakes=0; let left=null; let found=0;
  const wrap=el(`<div class="match"><div class="col" aria-label="Begriffe"></div><div class="col" aria-label="Zuordnungen"></div></div>`);
  const [cl,cr]=wrap.querySelectorAll(".col");
  const L=shuffle(pairs.map((p,i)=>i)),R=shuffle(pairs.map((p,i)=>i));
  L.forEach(i=>{const b=el(`<button class="opt" aria-pressed="false"></button>`);b.textContent=pairs[i][0];b.dataset.i=i;b.onclick=()=>{if(b.disabled)return;left=i;cl.querySelectorAll(".opt").forEach(x=>x.setAttribute("aria-pressed",x===b))};cl.appendChild(b)});
  R.forEach(i=>{const b=el(`<button class="opt"></button>`);b.textContent=pairs[i][1];b.dataset.i=i;b.onclick=()=>{if(b.disabled||left===null)return;
    const lb=cl.querySelector(`[data-i="${left}"]`);
    if(left===i){[lb,b].forEach(x=>{x.classList.add("ok");x.disabled=true;x.setAttribute("aria-pressed","false");setTimeout(()=>{x.classList.remove("ok");x.classList.add("gone")},350)});found++;left=null;
      if(found===pairs.length){P.sel=true;setTimeout(()=>check(P.mistakes===0),400)}}
    else{P.mistakes++;[lb,b].forEach(x=>{x.classList.add("no","shake");setTimeout(()=>x.classList.remove("no","shake"),450)})}};cr.appendChild(b)});
  box.appendChild(wrap);
}
function qOrder(q,box){
  P.sel=[]; const pool=el(`<div class="opts"></div>`),ans=el(`<div class="order-ans" aria-label="Deine Reihenfolge"></div>`);
  const order=shuffle(q.items.map((t,i)=>i));
  const draw=()=>{pool.innerHTML="";ans.innerHTML="";
    P.sel.forEach((i,k)=>{const b=el(`<button class="opt"><b>${k+1}</b><span></span></button>`);b.querySelector("span").textContent=q.items[i];b.onclick=()=>{if(P.answered)return;P.sel.splice(k,1);draw();redrawQuizFoot()};ans.appendChild(b)});
    order.filter(i=>!P.sel.includes(i)).forEach(i=>{const b=el(`<button class="opt"></button>`);b.textContent=q.items[i];b.onclick=()=>{if(P.answered)return;P.sel.push(i);draw();redrawQuizFoot()};pool.appendChild(b)})};
  draw(); box.append(ans,pool);
}
function check(forced){
  const q=P.qs[P.qi]; let ok;
  if(q.type==="match")ok=forced;
  else if(q.type==="tf")ok=(String(P.sel)===String(q.answer));
  else if(q.type==="order")ok=P.sel.every((v,k)=>v===k);
  else ok=(P.sel===q.answer);
  P.answered=true;P.lastOk=ok;P.results.push(ok);if(!ok)P.wrong.push(q);
  const box=$("#pBody");
  if(q.type==="mc"||q.type==="image"){box.querySelectorAll(".opt").forEach(b=>{b.disabled=true;const i=+b.dataset.i;if(i===q.answer)b.classList.add("ok");else if(i===P.sel)b.classList.add("no")})}
  if(q.type==="tf"){box.querySelectorAll(".opt").forEach(b=>{b.disabled=true;const v=b.dataset.v==="true";if(v===q.answer)b.classList.add("ok");else if(String(v)===String(P.sel))b.classList.add("no")})}
  if(q.type==="order"&&!ok){const ans=box.querySelector(".order-ans");ans.insertAdjacentElement("afterend",el(`<div class="panel"><b>Richtig wäre:</b><ol style="margin:0;padding-left:20px">${q.items.map(t=>`<li>${esc(t)}</li>`).join("")}</ol></div>`))}
  if(q.type==="order")box.querySelectorAll(".order-ans .opt").forEach(b=>b.classList.add(ok?"ok":"no"));
  if(ok&&!reduced)burst("var(--good)");
  progress();showFeedback();
}
function showFeedback(){
  const q=P.qs[P.qi];const f=$("#pFoot");f.innerHTML="";
  const sh=el(`<div class="sheet ${P.lastOk?"ok":"no"}" style="flex:1;margin:-12px calc(-1*max(16px,env(safe-area-inset-right,0px))) calc(-14px - env(safe-area-inset-bottom,0px))"><div class="inner"><h3>${P.lastOk?I.check+"Richtig!":I.cross+(q.type==="match"?"Mit Umwegen geschafft":"Nicht ganz")}</h3><p></p><button class="btn"><span>Weiter</span></button></div></div>`);
  sh.querySelector("p").textContent=q.explain||"";sh.querySelector("button").onclick=nextQuestion;f.appendChild(sh);sh.querySelector("button").focus({preventScroll:true});
}


/* ---------- finish: XP, streak, badges (scored on the server) ---------- */
async function finish(){
  P.phase="end";$("#pProg").style.width="100%";
  const correct=P.results.filter(Boolean).length,total=P.results.length,perfect=correct===total&&total>0;
  const L=P.L;
  let xp=0,streakUp=false,milestone=null,newBadges=[],freezeUsed=0,gotFreeze=false;
  let after=S.player?effStreak(S.player):0;
  const canSave=!!S.me&&P.mode!=="preview";
  if(P.mode==="review")xp=correct*XP.review;
  else if(P.mode!=="preview")xp=correct*XP.perCorrect+XP.lenBonus[P.len]+(perfect?XP.perfect[P.len]:0);
  if(canSave){
    try{
      const body=P.mode==="review"
        ?{mode:"review",today:todayStr(),reviewKeys:P.qs.map(q=>q._key),reviewCorrect:P.qs.filter((q,k)=>P.results[k]).map(q=>q._key)}
        :{mode:P.mode,date:L.date,len:P.len,today:todayStr(),wrong:P.wrong.map(q=>q.id)};
      const r=await api("/api/progress/finish",{method:"POST",body});
      S.player=r.player;S.review=r.review;xp=r.xp;streakUp=r.streakUp;milestone=r.milestone;newBadges=r.newBadges||[];
      freezeUsed=r.freezeUsed;gotFreeze=r.gotFreeze;after=effStreak(r.player);
      loadBoard();
    }catch(e){toast("Fortschritt konnte nicht gespeichert werden: "+e.message)}
  }
  // end screen
  const body=$("#pBody");
  const end=el(`<section class="end" style="display:flex;flex-direction:column"><div class="trophy">${perfect?I.star:I.trophy}</div><h1>${perfect?"Fehlerfrei!":correct/total>=.5?"Gut gemacht!":"Geschafft!"}</h1><p class="muted" style="margin:0"></p>
    <div class="tiles"><div class="tile green"><span>Richtig</span><b>${correct}/${total}</b></div><div class="tile gold"><span>XP</span><b class="xpCount">+0</b></div><div class="tile flame"><span>Streak</span><b>${after}</b></div></div></section>`);
  end.querySelector("p").textContent=P.mode==="review"?"Wiederholung abgeschlossen":L.title+(P.mode==="archive"?" · Archiv, zählt nicht für den Streak":"")+(P.mode==="preview"?" · Vorschau":"");
  if(!S.me&&P.mode!=="preview"){const n=el(`<div class="newbadge">Erstelle ein Konto, damit XP und Streak gespeichert werden. <a href="#profil">Jetzt mit Passkey registrieren</a></div>`);n.querySelector("a").onclick=()=>closePlayer();end.appendChild(n)}
  if(milestone)end.appendChild(el(`<div class="milestone">${milestone} Tage am Stück. Meilenstein erreicht!</div>`));
  if(freezeUsed)end.appendChild(el(`<div class="newbadge">Streak-Freeze eingesetzt: ${freezeUsed} verpasste${freezeUsed>1?" Tage":"r Tag"} gerettet.</div>`));
  if(gotFreeze)end.appendChild(el(`<div class="newbadge">Neuer Streak-Freeze für 7 Lerntage.</div>`));
  newBadges.forEach(n=>{const b=el(`<div class="newbadge">Neues Abzeichen: </div>`);b.append(n);end.appendChild(b)});
  if((L.takeaways||[]).length){const tk=el(`<div class="panel takeaways"><h2>Das nimmst du mit</h2><ol></ol></div>`);L.takeaways.slice(0,3).forEach(x=>{const li=document.createElement("li");li.textContent=x;tk.querySelector("ol").appendChild(li)});end.appendChild(tk)}
  const src=(L.sources||[]).map(s=>{const u=safeUrl(s.url);return u?`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(s.title||u)}</a>`:""}).filter(Boolean);
  if(src.length)end.appendChild(el(`<div class="panel" style="text-align:left;width:100%"><h2>Quellen</h2><div class="links">${src.join("")}</div></div>`));
  body.replaceChildren(end);body.scrollTop=0;
  const f=$("#pFoot");f.innerHTML="";const b=el(`<button class="btn primary">Fertig</button>`);b.onclick=closePlayer;f.appendChild(b);
  // animations
  const xc=end.querySelector(".xpCount");const t0=performance.now();const dur=reduced?1:900;
  const step=n=>{const k=Math.min(1,(n-t0)/dur);xc.textContent="+"+Math.round(xp*k);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);
  if(perfect||streakUp)setTimeout(()=>burst("var(--day)"),250);
  if(streakUp){renderChips();const fl=$("#flameIc");if(fl){fl.classList.remove("go");void fl.offsetWidth;fl.classList.add("go")}}
}

/* ---------- Redaktion (admin) ---------- */
let USERS=null;
async function loadUsers(){if(!isAdmin())return;try{USERS=(await api("/api/admin/users")).users}catch(e){}if(S.view==="redaktion")render()}
function viewAdmin(){
  if(!isAdmin())return [el(`<div class="panel"><div class="empty"><b>Nur für die Redaktion</b></div></div>`)];
  const out=[el(`<div><h1 class="viewtitle">Redaktion</h1><p class="note">Lektionen ansehen, bearbeiten oder neu erzeugen. Ist ANTHROPIC_API_KEY gesetzt, entsteht jeden Morgen automatisch die Lektion für morgen.</p></div>`)];
  const gen=el(`<section class="panel"><h2>Lektion erzeugen</h2><div class="row" style="flex-wrap:wrap"><input type="date" id="genDate" style="flex:1;min-width:150px"><button class="btn primary small" id="genBtn">Mit Claude erzeugen</button><button class="btn ghost small" id="newBtn">Aus JSON</button></div><p class="note" id="genNote">Das Erzeugen dauert ein bis drei Minuten. Sonntags-Rückblicke nutzen die Websuche.</p></section>`);
  gen.querySelector("#genDate").value=addDays(todayStr(),1);
  gen.querySelector("#genBtn").onclick=e=>generate(gen.querySelector("#genDate").value,gen.querySelector("#genNote"),e.currentTarget);
  gen.querySelector("#newBtn").onclick=()=>editLesson(gen.querySelector("#genDate").value,true);
  out.push(gen);
  const l=el(`<div class="list"></div>`);
  if(!S.index.length)l.appendChild(el(`<div class="panel"><div class="empty"><b>Noch keine Lektionen</b>Erzeuge oben die erste.</div></div>`));
  S.index.forEach(x=>{const it=el(`<div class="item" style="--wc:var(--c-${x.theme});flex-wrap:wrap"><span class="ic">${I[x.theme]||""}</span><span class="grow"><span class="t"></span><span class="s" style="display:block"></span></span><span class="pill ${x.status==="draft"?"warn":"good"}">${x.status==="draft"?"Entwurf":"Live"}</span><div class="admin-tools" style="width:100%"></div></div>`);
    it.querySelector(".t").textContent=x.title;it.querySelector(".s").textContent=fmtShort(x.date)+" · "+(THEMES[x.theme]?THEMES[x.theme].name:"");
    const tools=it.querySelector(".admin-tools");
    const mk=(t,fn,cls="")=>{const b=el(`<button class="btn ghost small ${cls}"></button>`);b.textContent=t;b.onclick=fn;tools.appendChild(b)};
    mk("Vorschau",async()=>{const L=await loadLesson(x.date);if(L)startLesson(L,3,"preview")});
    mk("Bearbeiten",()=>editLesson(x.date));
    mk(x.status==="draft"?"Veröffentlichen":"Zurückziehen",()=>setStatus(x.date,x.status==="draft"?"published":"draft"));
    mk("Neu erzeugen",e=>{if(confirm("Lektion für "+fmtShort(x.date)+" mit Claude neu erzeugen? Die bisherige wird ersetzt."))generate(x.date,null,e.currentTarget)});
    mk("Löschen",async()=>{if(!confirm("Lektion „"+x.title+"“ löschen?"))return;try{await api("/api/admin/lessons/"+x.date,{method:"DELETE"});toast("Gelöscht");loadIndex();loadToday(true)}catch(e){toast(e.message)}},"danger");
    l.appendChild(it)});
  out.push(l);
  const us=el(`<section class="panel"><h2>Konten</h2><div class="list"></div></section>`);
  if(!USERS)us.querySelector(".list").appendChild(el(`<p class="note">Lade …</p>`));
  else USERS.forEach(u=>{const r=el(`<div class="row"><span class="ava" style="width:36px;height:36px;font-size:20px"></span><div class="grow"><b></b><div class="note"></div></div></div>`);
    r.querySelector(".ava").textContent=u.avatar;r.querySelector("b").textContent=u.name+(u.isAdmin?" · Redaktion":"");
    r.querySelector(".note").textContent=`@${u.username} · ${u.passkeys} Passkey${u.passkeys===1?"":"s"} · seit ${new Date(u.createdAt).toLocaleDateString("de-DE")}`;us.querySelector(".list").appendChild(r)});
  out.push(us);
  return out;
}
async function setStatus(date,status){try{await api(`/api/admin/lessons/${date}/status`,{method:"POST",body:{status}});toast(status==="draft"?"Zurückgezogen":"Veröffentlicht");loadIndex();loadToday(true)}catch(e){toast(e.message)}}
async function editLesson(date,isNew){
  if(!date){toast("Bitte ein Datum wählen.");return}
  let L;
  if(isNew){L={date,theme:THEME_BY_WD[parseYmd(date).getDay()],subjectKey:"",title:"",subtitle:"",status:"draft",cards:[],questions:[],takeaways:[],sources:[]}}
  else{L=await loadLesson(date);if(!L)return}
  const m=el(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="edT"><div class="panel" style="max-height:92vh;overflow:auto"><h2 id="edT"></h2><p class="note">JSON der Lektion. Struktur beibehalten.</p><label for="edArea" class="label">Lektion</label><textarea id="edArea" spellcheck="false"></textarea><p class="note" id="edErr" role="alert"></p><div class="row"><button class="btn ghost grow">Abbrechen</button><button class="btn primary grow">Speichern</button></div></div></div>`);
  m.querySelector("#edT").textContent=isNew?"Neue Lektion für "+fmtShort(date):L.title+" bearbeiten";
  const ta=m.querySelector("textarea");ta.value=JSON.stringify(L,null,2);
  const [c,s]=m.querySelectorAll(".row button");c.onclick=()=>m.remove();
  s.onclick=async()=>{let nl;try{nl=JSON.parse(ta.value)}catch(e){m.querySelector("#edErr").textContent="Das JSON ist ungültig: "+e.message;return}
    try{await api("/api/admin/lessons/"+date,{method:"PUT",body:nl});m.remove();toast("Gespeichert");loadIndex();loadToday(true)}catch(e){m.querySelector("#edErr").textContent=e.message}};
  document.body.appendChild(m);
}
async function generate(date,noteEl,btn){
  if(!date){toast("Bitte ein Datum wählen.");return}
  const setN=t=>{if(noteEl)noteEl.textContent=t;else toast(t)};
  setN("Erzeuge die Lektion für "+fmtShort(date)+" … das dauert ein bis drei Minuten.");
  if(btn)btn.disabled=true;
  try{const r=await api("/api/admin/generate",{method:"POST",body:{date}});setN("Fertig: "+r.title);loadIndex();loadToday(true)}
  catch(e){setN("Erzeugen hat nicht geklappt: "+e.message)}
  finally{if(btn)btn.disabled=false}
}

boot();
