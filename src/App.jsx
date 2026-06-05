import { useState, useEffect, useRef } from "react";

function useBreakpoint(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1024);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return{mobile:w<640,tablet:w>=640&&w<1024,desktop:w>=1024,w};
}

const TRIAL_DAYS=7;
function getTrialInfo(d){const e=Math.floor((Date.now()-d)/(864e5));return{remaining:Math.max(0,TRIAL_DAYS-e),expired:e>=TRIAL_DAYS};}
const getAge=(d)=>{if(!d)return"Unknown";const y=Math.floor((Date.now()-new Date(d))/(864e5*365.25));return y===1?"1 year":`${y} years`;};
const initials=(n)=>(n||"?").charAt(0).toUpperCase();
const fmtDate=(d)=>isNaN(new Date(d))?d:new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const today=()=>new Date().toISOString().split("T")[0];

const Icon=({name,size=18,color="currentColor"})=>{
  const p={
    home:<><path d="M3 10.5L12 3l9 7.5"/><rect x="3" y="10.5" width="18" height="10" rx="1.5"/></>,
    file:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    brain:<><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 4 4c0 1-.3 1.9-.8 2.6A4 4 0 0 1 19 12a4 4 0 0 1-3.8 4A4 4 0 0 1 12 22a4 4 0 0 1-3.2-6A4 4 0 0 1 5 12a4 4 0 0 1 3.8-3.4A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    upload:<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    doc:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></>,
    paw:<><circle cx="12" cy="13" r="4"/><circle cx="6.5" cy="10.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="9" cy="7" r="1.5"/><circle cx="15" cy="7" r="1.5"/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeoff:<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    check:<polyline points="20 6 9 17 4 12"/>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    menu:<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    camera:<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    star:<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    map:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    history:<><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></>,
    trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    sparkle:<><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/></>,
  };
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:"block",flexShrink:0}}>
      {p[name]||null}
    </svg>
  );
};

const themes={
  light:{
    bg:"#f5f0e8",bgMid:"#ede6d8",bgDark:"#e2d9c8",
    surface:"#fdf9f4",surfaceAlt:"#f5f0e8",
    ink:"#1a1610",inkMid:"#3d3428",inkLight:"#7a6e5f",
    border:"#d8cfc0",shadow:"rgba(26,22,16,0.07)",
    green:"#2d4a35",greenMid:"#3d6347",greenLight:"#c8dcc9",greenPale:"#edf4ee",
    rust:"#b85c38",rustLight:"#f5e6df",
    gold:"#c9963a",goldLight:"#fdf3e1",
    inputBg:"#fdf9f4",tabActiveBg:"#fdf9f4",overlay:"rgba(26,22,16,0.5)",
  },
  dark:{
    bg:"#0e1510",bgMid:"#141d11",bgDark:"#192116",
    surface:"#192116",surfaceAlt:"#141d11",
    ink:"#e8e3da",inkMid:"#c8c3ba",inkLight:"#9aa496",
    border:"#253221",shadow:"rgba(0,0,0,0.35)",
    green:"#1e3326",greenMid:"#263d2e",greenLight:"#2d4a35",greenPale:"#182a1b",
    rust:"#c97255",rustLight:"#2d1a12",
    gold:"#d4a84b",goldLight:"#2a2010",
    inputBg:"#192116",tabActiveBg:"#253221",overlay:"rgba(0,0,0,0.65)",
  },
};

const GlobalStyles=()=>(
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{height:100%;width:100%;}
    body{overflow-x:hidden;}
    *{-webkit-user-select:none;user-select:none;}
    input,textarea,select{-webkit-user-select:text!important;user-select:text!important;}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{transform:scale(0.7);opacity:0.4}50%{transform:scale(1);opacity:1}}
    @keyframes popIn{0%{opacity:0;transform:scale(0.92)}100%{opacity:1;transform:scale(1)}}
  `}</style>
);

const S={
  eyebrow:(t)=>({fontSize:10,letterSpacing:4,textTransform:"uppercase",color:t.inkLight,marginBottom:8,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}),
  pageTitle:(t,mob)=>({fontFamily:"'Playfair Display',serif",fontSize:mob?24:32,fontWeight:700,color:t.ink,letterSpacing:-0.5,lineHeight:1.1}),
  pageSub:(t)=>({fontSize:14,color:t.inkLight,marginTop:8,fontWeight:300,lineHeight:1.5}),
  card:(t)=>({background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:24,boxShadow:`0 2px 12px ${t.shadow}`}),
  label:(t)=>({display:"block",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:t.inkLight,marginBottom:8,fontWeight:500}),
  input:(t,focus)=>({width:"100%",padding:"12px 14px",border:`1.5px solid ${focus?t.green:t.border}`,borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:t.ink,background:t.inputBg,outline:"none",transition:"border-color 0.2s",display:"block"}),
  btnPrimary:(t)=>({padding:"12px 26px",background:t.green,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"opacity 0.18s"}),
  btnSecondary:(t)=>({padding:"11px 22px",border:`1.5px solid ${t.border}`,background:"transparent",borderRadius:10,fontSize:14,cursor:"pointer",color:t.inkMid,fontFamily:"'DM Sans',sans-serif"}),
  modal:(t)=>({position:"fixed",inset:0,background:t.overlay,backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn 0.2s ease"}),
  modalBox:(t)=>({background:t.bg,borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto",boxShadow:`0 24px 80px ${t.shadow}`,animation:"popIn 0.25s ease"}),
};

const VACCINE_INFO={
  "Rabies":{protects:"Rabies virus — a fatal viral disease.",why:"Required by law in most US states. Fatal to both pets and humans once symptoms appear.",frequency:"Every 1–3 years.",sideEffects:"Mild soreness, occasional low-grade fever for 24 hours."},
  "DHPP (Distemper/Parvo)":{protects:"Canine Distemper, Hepatitis, Parainfluenza, and Parvovirus.",why:"Parvo causes severe, often fatal vomiting and diarrhea.",frequency:"Puppy series, then every 1–3 years.",sideEffects:"Mild lethargy for 1–2 days."},
  "Bordetella":{protects:"Bordetella bronchiseptica — kennel cough.",why:"Highly contagious. Usually required by kennels.",frequency:"Every 6–12 months.",sideEffects:"Mild sneezing if given intranasally."},
  "Leptospirosis":{protects:"Leptospira bacteria spread through water and wildlife.",why:"Can cause kidney and liver failure. Transmissible to humans.",frequency:"Annually.",sideEffects:"Slightly higher reaction rate."},
  "FVRCP":{protects:"Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia.",why:"Panleukopenia is highly contagious and often fatal in cats.",frequency:"Kitten series, then every 1–3 years.",sideEffects:"Mild lethargy for 24–48 hours."},
};
const VACCINE_DEFAULT={protects:"Infectious disease.",why:"Recommended by veterinarians as preventative care.",frequency:"Your vet will advise on schedule.",sideEffects:"Mild soreness and brief lethargy are most common."};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin,t,bp}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [error,setError]=useState("");
  const [focus,setFocus]=useState(null);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const pwRules=[{test:p=>p.length>=8,label:"8+ characters"},{test:p=>/[A-Z]/.test(p),label:"Uppercase"},{test:p=>/[0-9]/.test(p),label:"Number"},{test:p=>/[^A-Za-z0-9]/.test(p),label:"Special char"}];
  const pwStrength=pwRules.filter(r=>r.test(password)).length;
  const submit=()=>{
    setError("");
    if(!email||!password||(mode==="signup"&&!name)){setError("Please fill in all fields.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())){setError("Please enter a valid email.");return;}
    if(mode==="signup"){const fail=pwRules.filter(r=>!r.test(password));if(fail.length){setError("Password needs: "+fail.map(r=>r.label.toLowerCase()).join(", ")+".");return;}}
    setLoading(true);
    setTimeout(()=>{setSuccess(true);setTimeout(()=>onLogin(mode==="signup"?(name.trim().split(" ")[0]||email.split("@")[0]):email.split("@")[0],Date.now()),700);},900);
  };
  return(
    <div style={{minHeight:"100vh",width:"100%",background:t.bg,display:"flex",fontFamily:"'DM Sans',sans-serif",animation:"fadeIn 0.4s ease"}}>
      {bp.desktop&&(
        <div style={{width:"42%",minHeight:"100vh",flexShrink:0,background:`linear-gradient(160deg,${t.green} 0%,${t.greenMid} 100%)`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 52px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",width:320,height:320,top:-80,right:-100,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#fff"}}>Coat & Care</div>
            <div style={{fontSize:10,letterSpacing:4,color:"rgba(255,255,255,0.45)",marginTop:5}}>PET HEALTH, SIMPLIFIED</div>
          </div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:20}}>Your pet's entire<br/>health history,<br/><span style={{fontStyle:"italic",fontWeight:400}}>always with you.</span></div>
            <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:14}}>
              {["Universal pet health record","AI-powered symptom guidance","Instant doc scanning & auto-fill","Weight tracking & insights","Vet finder near you"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="check" size={12} color="#fff"/></div>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.75)",fontWeight:300}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"relative",zIndex:1,fontSize:11,color:"rgba(255,255,255,0.25)"}}>© 2026 Coat & Care</div>
        </div>
      )}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:bp.mobile?"28px 20px":"40px 32px",minWidth:0}}>
        {!bp.desktop&&<div style={{position:"absolute",top:28,left:"50%",transform:"translateX(-50%)",textAlign:"center"}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.green}}>Coat & Care</div></div>}
        <div style={{width:"100%",maxWidth:400,animation:"slideUp 0.45s ease",paddingTop:bp.mobile?40:0}}>
          <div style={{marginBottom:28}}>
            <div style={{...S.eyebrow(t),marginBottom:10}}>{mode==="login"?"Welcome back":"Get started"}</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:bp.mobile?24:30,fontWeight:700,color:t.ink}}>{mode==="login"?"Sign in to your account":"Create your account"}</h1>
            {mode==="signup"&&<p style={{fontSize:13,color:t.inkLight,marginTop:8,fontWeight:300}}>Start your <strong style={{color:t.green}}>7-day free trial</strong> — no credit card required.</p>}
          </div>
          {mode==="signup"&&<div style={{marginBottom:16}}><label style={S.label(t)}>Your Name</label><input style={S.input(t,focus==="name")} placeholder="e.g. Alex Johnson" value={name} onChange={e=>setName(e.target.value)} onFocus={()=>setFocus("name")} onBlur={()=>setFocus(null)} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>}
          <div style={{marginBottom:16}}><label style={S.label(t)}>Email</label><input type="email" style={S.input(t,focus==="email")} placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocus("email")} onBlur={()=>setFocus(null)} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
          <div style={{marginBottom:20}}>
            <label style={S.label(t)}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} style={{...S.input(t,focus==="pass"),paddingRight:44}} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocus("pass")} onBlur={()=>setFocus(null)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
              <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.inkLight,padding:4,display:"flex"}}><Icon name={showPass?"eyeoff":"eye"} size={16} color="currentColor"/></button>
            </div>
            {mode==="signup"&&password.length>0&&(
              <div style={{marginTop:10}}>
                <div style={{display:"flex",gap:4,marginBottom:8}}>{[0,1,2,3].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,transition:"background 0.3s",background:i<pwStrength?(pwStrength<=1?t.rust:pwStrength<=2?t.gold:pwStrength<=3?"#7ab648":t.green):t.border}}/>)}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px 12px"}}>{pwRules.map(r=><span key={r.label} style={{fontSize:11,color:r.test(password)?t.green:t.inkLight,display:"flex",alignItems:"center",gap:4}}><span>{r.test(password)?"✓":"·"}</span>{r.label}</span>)}</div>
              </div>
            )}
          </div>
          {error&&<div style={{background:t.rustLight,border:`1px solid ${t.rust}`,borderRadius:9,padding:"10px 14px",marginBottom:16,fontSize:13,color:t.rust}}>{error}</div>}
          <button onClick={submit} disabled={loading||success} style={{...S.btnPrimary(t),width:"100%",padding:"14px",fontSize:15,opacity:(loading||success)?0.75:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {success?<><Icon name="check" size={16} color="#fff"/>Signed in</>:loading?"Please wait...":mode==="login"?"Sign In":"Start Free Trial"}
          </button>
          <div style={{textAlign:"center",marginTop:20,fontSize:13,color:t.inkLight}}>
            {mode==="login"?"Don't have an account? ":"Already have an account? "}
            <button onClick={()=>{setMode(m=>m==="login"?"signup":"login");setError("");}} style={{background:"none",border:"none",color:t.green,cursor:"pointer",fontWeight:500,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{mode==="login"?"Sign up free":"Sign in"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TRIAL BANNER ──────────────────────────────────────────────────────────────
function TrialBanner({trialInfo,t}){
  const [vis,setVis]=useState(true);
  if(!vis||trialInfo.expired)return null;
  return(
    <div style={{background:`linear-gradient(90deg,${t.gold},#e8a82e)`,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <Icon name="star" size={14} color="#fff"/>
        <span style={{fontSize:13,fontWeight:500,color:"#fff"}}>{trialInfo.remaining} day{trialInfo.remaining!==1?"s":""} left in your free trial</span>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>— $2.99/month after</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button style={{fontSize:12,fontWeight:600,color:"#fff",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Subscribe</button>
        <button onClick={()=>setVis(false)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.7)",display:"flex"}}><Icon name="x" size={14} color="currentColor"/></button>
      </div>
    </div>
  );
}

// ── ADD RECORD MODAL ──────────────────────────────────────────────────────────
function AddRecordModal({onClose,onAdd,tab,t}){
  const [focus,setFocus]=useState(null);
  const [form,setForm]=useState({name:"",date:"",vet:"",notes:"",nextDue:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const fields={
    vaccinations:[{k:"name",label:"Vaccine Name",type:"text",placeholder:"e.g. Rabies"},{k:"date",label:"Date Given",type:"date"},{k:"nextDue",label:"Next Due Date",type:"date"},{k:"vet",label:"Veterinarian",type:"text",placeholder:"e.g. Dr. Smith"},{k:"notes",label:"Notes",type:"text",placeholder:"Optional"}],
    visits:[{k:"name",label:"Visit Reason",type:"text",placeholder:"e.g. Annual Wellness Exam"},{k:"date",label:"Date",type:"date"},{k:"vet",label:"Veterinarian",type:"text",placeholder:"e.g. Dr. Smith"},{k:"notes",label:"Notes",type:"text",placeholder:"What happened"}],
    medications:[{k:"name",label:"Medication Name",type:"text",placeholder:"e.g. Heartgard Plus"},{k:"notes",label:"Purpose",type:"text",placeholder:"e.g. Heartworm prevention"},{k:"nextDue",label:"Next Due Date",type:"date"},{k:"vet",label:"Prescribed by",type:"text",placeholder:"e.g. Dr. Smith"}],
  }[tab]||[];
  const handleAdd=()=>{
    if(!form.name)return;
    if(tab==="vaccinations")onAdd("vaccinations",{name:form.name,date:form.date,nextDue:form.nextDue,vet:form.vet,notes:form.notes});
    else if(tab==="visits")onAdd("visits",{name:form.name,date:form.date,vet:form.vet,notes:form.notes});
    else onAdd("medications",{name:form.name,nextDue:form.nextDue,vet:form.vet,notes:form.notes});
    onClose();
  };
  return(
    <div onClick={onClose} style={S.modal(t)}>
      <div onClick={e=>e.stopPropagation()} style={S.modalBox(t)}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink,marginBottom:4}}>Add {tab==="vaccinations"?"Vaccination":tab==="visits"?"Vet Visit":"Medication"}</div>
        <div style={{fontSize:13,color:t.inkLight,marginBottom:22,fontWeight:300}}>Fill in the details below.</div>
        {fields.map(f=>(
          <div key={f.k} style={{marginBottom:14}}>
            <label style={S.label(t)}>{f.label}</label>
            <input type={f.type||"text"} style={S.input(t,focus===f.k)} value={form[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.placeholder||""} onFocus={()=>setFocus(f.k)} onBlur={()=>setFocus(null)}/>
          </div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          <button onClick={onClose} style={S.btnSecondary(t)}>Cancel</button>
          <button onClick={handleAdd} disabled={!form.name} style={{...S.btnPrimary(t),opacity:!form.name?0.5:1}}>Save Record</button>
        </div>
      </div>
    </div>
  );
}

// ── ADD / EDIT PET MODAL ──────────────────────────────────────────────────────
function PetModal({onClose,onSave,existing,t}){
  const [form,setForm]=useState(existing?{...existing}:{name:"",breed:"",species:"Dog",dob:"",weight:"",sex:"Male",photo:null,microchip:"",vet:""});
  const [focus,setFocus]=useState(null);
  const fileRef=useRef();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handlePhoto=(e)=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=(ev)=>set("photo",ev.target.result);r.readAsDataURL(file);};
  const handleSave=()=>{
    if(!form.name||!form.breed)return;
    if(existing){onSave(existing.id,form);}
    else{
      const weightLog=form.weight&&!isNaN(parseFloat(form.weight))?[{weight:parseFloat(form.weight),date:today()}]:[];
      onSave({id:Date.now(),...form,weightUnit:"lbs",microchip:form.microchip||"Not registered",vet:form.vet||"Not assigned",vaccinations:[],visits:[],medications:[],documents:[],weightLog,symptomHistory:[]});
    }
    onClose();
  };
  return(
    <div onClick={onClose} style={S.modal(t)}>
      <div onClick={e=>e.stopPropagation()} style={S.modalBox(t)}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink,marginBottom:4}}>{existing?"Edit Pet":"Add a Pet"}</div>
        <div style={{fontSize:13,color:t.inkLight,marginBottom:22,fontWeight:300}}>{existing?"Update your pet's information.":"Enter your pet's basic information to get started."}</div>
        {/* Photo */}
        <div style={{marginBottom:20,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{width:80,height:80,borderRadius:18,background:t.surfaceAlt,border:`2px dashed ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer"}} onClick={()=>fileRef.current.click()}>
            {form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="pet"/>:<Icon name="camera" size={28} color={t.inkLight}/>}
          </div>
          <button onClick={()=>fileRef.current.click()} style={{...S.btnSecondary(t),padding:"7px 16px",fontSize:12}}>{form.photo?"Change Photo":"Upload Photo"}</button>
          <div style={{fontSize:11,color:t.inkLight}}>Optional — JPG, PNG</div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        </div>
        {[{k:"name",label:"Pet Name",placeholder:"e.g. Hazel"},{k:"breed",label:"Breed",placeholder:"e.g. Labrador Retriever"}].map(f=>(
          <div key={f.k} style={{marginBottom:14}}><label style={S.label(t)}>{f.label}</label><input style={S.input(t,focus===f.k)} value={form[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.placeholder} onFocus={()=>setFocus(f.k)} onBlur={()=>setFocus(null)}/></div>
        ))}
        {[{k:"species",label:"Species",opts:["Dog","Cat","Rabbit","Bird","Other"]},{k:"sex",label:"Sex",opts:["Male","Female","Male (neutered)","Female (spayed)"]}].map(f=>(
          <div key={f.k} style={{marginBottom:14}}><label style={S.label(t)}>{f.label}</label><select style={S.input(t,false)} value={form[f.k]} onChange={e=>set(f.k,e.target.value)}>{f.opts.map(o=><option key={o}>{o}</option>)}</select></div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div><label style={S.label(t)}>Date of Birth</label><input type="date" style={S.input(t,focus==="dob")} value={form.dob} onChange={e=>set("dob",e.target.value)} onFocus={()=>setFocus("dob")} onBlur={()=>setFocus(null)}/></div>
          <div><label style={S.label(t)}>Weight (lbs)</label><input type="text" style={S.input(t,focus==="weight")} value={form.weight} placeholder="e.g. 48" onChange={e=>set("weight",e.target.value)} onFocus={()=>setFocus("weight")} onBlur={()=>setFocus(null)}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div><label style={S.label(t)}>Microchip ID</label><input type="text" style={S.input(t,focus==="microchip")} value={form.microchip||""} placeholder="e.g. 985141000123456" onChange={e=>set("microchip",e.target.value)} onFocus={()=>setFocus("microchip")} onBlur={()=>setFocus(null)}/></div>
          <div><label style={S.label(t)}>Primary Vet</label><input type="text" style={S.input(t,focus==="vet")} value={form.vet||""} placeholder="e.g. Dr. Smith" onChange={e=>set("vet",e.target.value)} onFocus={()=>setFocus("vet")} onBlur={()=>setFocus(null)}/></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          <button onClick={onClose} style={S.btnSecondary(t)}>Cancel</button>
          <button onClick={handleSave} disabled={!form.name||!form.breed} style={{...S.btnPrimary(t),opacity:(!form.name||!form.breed)?0.5:1}}>{existing?"Save Changes":"Add Pet"}</button>
        </div>
      </div>
    </div>
  );
}

// ── WEIGHT MODAL ──────────────────────────────────────────────────────────────
function WeightModal({onClose,onAdd,t}){
  const [weight,setWeight]=useState("");
  const [date,setDate]=useState(today());
  const [focus,setFocus]=useState(null);
  return(
    <div onClick={onClose} style={S.modal(t)}>
      <div onClick={e=>e.stopPropagation()} style={{...S.modalBox(t),maxWidth:360}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:t.ink,marginBottom:20}}>Log Weight</div>
        <div style={{marginBottom:14}}><label style={S.label(t)}>Weight (lbs)</label><input type="number" style={S.input(t,focus==="w")} value={weight} placeholder="e.g. 14.5" onChange={e=>setWeight(e.target.value)} onFocus={()=>setFocus("w")} onBlur={()=>setFocus(null)}/></div>
        <div style={{marginBottom:20}}><label style={S.label(t)}>Date</label><input type="date" style={S.input(t,focus==="d")} value={date} onChange={e=>setDate(e.target.value)} onFocus={()=>setFocus("d")} onBlur={()=>setFocus(null)}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={S.btnSecondary(t)}>Cancel</button>
          <button onClick={()=>{if(weight)onAdd({weight:parseFloat(weight),date});onClose();}} disabled={!weight} style={{...S.btnPrimary(t),opacity:!weight?0.5:1}}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({pets,onNavigate,activePetId,setActivePetId,t,bp,userName,onAddPet}){
  const pet=pets.find(p=>p.id===activePetId)||(pets.length>0?pets[0]:null);
  const mob=bp.mobile;
  if(pets.length===0)return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:24}}><div style={S.eyebrow(t)}>Overview</div><h1 style={S.pageTitle(t,mob)}>Welcome{userName?`, ${userName}`:""}</h1><p style={S.pageSub(t)}>Get started by adding your first pet.</p></div>
      <div style={{...S.card(t),textAlign:"center",padding:"52px 32px"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:t.greenPale,border:`2px solid ${t.greenLight}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Icon name="paw" size={28} color={t.green}/></div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink,marginBottom:10}}>No pets added yet</div>
        <div style={{fontSize:14,color:t.inkLight,maxWidth:300,margin:"0 auto 24px",lineHeight:1.6}}>Add your first pet to start tracking vaccinations, visits, medications, and more.</div>
        <button onClick={onAddPet} style={S.btnPrimary(t)}>Add Your First Pet</button>
      </div>
    </div>
  );
  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:20}}><div style={S.eyebrow(t)}>Overview</div><h1 style={S.pageTitle(t,mob)}>Good morning{userName?`, ${userName}`:""}</h1><p style={S.pageSub(t)}>Your pets' health summary.</p></div>
      {pets.length>1&&(
        <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {pets.map(p=>(
            <button key={p.id} onClick={()=>setActivePetId(p.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${activePetId===p.id?t.green:t.border}`,background:activePetId===p.id?t.greenPale:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:activePetId===p.id?600:400,color:activePetId===p.id?t.green:t.inkMid,whiteSpace:"nowrap",flexShrink:0}}>
              <div style={{width:22,height:22,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:p.photo?"transparent":t.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:t.green}}>
                {p.photo?<img src={p.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={p.name}/>:initials(p.name)}
              </div>
              {p.name}
            </button>
          ))}
        </div>
      )}
      <div style={{background:`linear-gradient(135deg,${t.green} 0%,${t.greenMid} 100%)`,borderRadius:18,padding:mob?"20px 18px":"26px 30px",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
        <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:5}}>Active Profile</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:mob?20:24,fontWeight:700,color:"#fff",marginBottom:3}}>{pet.name}</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",fontWeight:300}}>{pet.breed}{pet.dob?` — ${getAge(pet.dob)} old`:""}</div>
        <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{l:"View Profile",p:"profile"},{l:"Symptom Check",p:"ai"},{l:"Weight",p:"weight"}].map(b=>(
            <button key={b.p} onClick={()=>onNavigate(b.p)} style={{padding:"8px 16px",background:"rgba(255,255,255,0.12)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{b.l}</button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Pets in Care",value:pets.length,unit:"registered",accent:true},{label:"Vaccinations",value:pet.vaccinations.length,unit:"on record",accent:false},{label:"Documents",value:(pet.documents||[]).length,unit:"stored",accent:false}].map((s,i)=>(
          <div key={s.label} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:mob?"14px 16px":"16px 20px",animation:`fadeUp ${0.3+i*0.08}s ease`,background:s.accent?t.greenPale:t.surface,border:`1px solid ${s.accent?t.greenLight:t.border}`}}>
            <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:t.inkLight,marginBottom:8}}>{s.label}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:mob?20:24,fontWeight:700,color:s.accent?t.green:t.ink,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:12,color:t.inkLight,marginTop:4,fontWeight:300}}>{s.unit}</div>
          </div>
        ))}
      </div>
      {pet.vaccinations.length>0&&(
        <>
          <div style={{...S.eyebrow(t),marginBottom:12}}>Recent Vaccinations</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {pet.vaccinations.slice(-3).reverse().map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:t.surface,border:`1px solid ${t.border}`,borderRadius:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:t.green,flexShrink:0}}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:t.ink}}>{v.name}</div><div style={{fontSize:11,color:t.inkLight,marginTop:2}}>{v.vet||"No vet recorded"}</div></div>
                <div style={{fontSize:12,color:t.inkLight,whiteSpace:"nowrap"}}>{fmtDate(v.date)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── PET PROFILE ───────────────────────────────────────────────────────────────
function PetProfile({pet,t,bp,onUpdatePet,onEditPet}){
  const mob=bp.mobile;
  const fileRef=useRef();
  const handlePhoto=(e)=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=(ev)=>onUpdatePet(pet.id,{photo:ev.target.result});r.readAsDataURL(file);};
  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={S.eyebrow(t)}>Pet Profile</div>
        <button onClick={onEditPet} style={{...S.btnSecondary(t),padding:"7px 14px",fontSize:12,display:"flex",alignItems:"center",gap:6}}><Icon name="edit" size={13} color="currentColor"/>Edit</button>
      </div>
      <div style={{...S.card(t),marginBottom:16,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap",background:t.greenPale,border:`1px solid ${t.greenLight}`}}>
        <div style={{position:"relative",flexShrink:0,marginBottom:4}}>
          <div style={{width:88,height:88,borderRadius:18,background:`linear-gradient(135deg,${t.greenLight},${t.bgDark})`,border:`3px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:32,color:t.green,fontWeight:700,overflow:"hidden",cursor:"pointer"}} onClick={()=>fileRef.current.click()}>
            {pet.photo?<img src={pet.photo} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} alt={pet.name}/>:initials(pet.name)}
          </div>
          <div onClick={()=>fileRef.current.click()} style={{position:"absolute",bottom:0,right:0,width:24,height:24,borderRadius:"50%",background:t.green,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px solid ${t.surface}`}}><Icon name="camera" size={12} color="#fff"/></div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:mob?22:28,fontWeight:700,color:t.ink}}>{pet.name}</div>
          <div style={{fontSize:14,color:t.inkLight,marginTop:2,fontStyle:"italic",fontFamily:"'Playfair Display',serif"}}>{pet.breed}</div>
          <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
            {[pet.species,pet.sex,pet.dob?`Born ${new Date(pet.dob).getFullYear()}`:null].filter(Boolean).map(tag=>(
              <span key={tag} style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${t.greenLight}`,color:t.green,background:t.greenPale}}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[{label:"Age",value:getAge(pet.dob),big:true,accent:t.green},{label:"Weight",value:pet.weight?`${pet.weight} lbs`:"Not set",big:true,accent:t.green},{label:"Microchip",value:pet.microchip||"Not registered",big:false},{label:"Primary Vet",value:pet.vet||"Not assigned",big:false}].map(v=>(
          <div key={v.label} style={{background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:12,padding:"13px 15px",}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:t.inkLight,marginBottom:5}}>{v.label}</div>
            <div style={{fontFamily:v.big?"'Playfair Display',serif":"'DM Sans',sans-serif",fontSize:v.big?20:13,fontWeight:v.big?700:500,color:t.ink,lineHeight:1.3,wordBreak:"break-word"}}>{v.value}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card(t),background:t.greenPale,border:`1px solid ${t.greenLight}`}}>
        <div style={{...S.eyebrow(t),marginBottom:14}}>Emergency Card</div>
        {[{label:"Pet Name",val:pet.name},{label:"Microchip ID",val:pet.microchip||"Not registered"},{label:"Veterinarian",val:pet.vet||"Not assigned"}].map(f=>(
          <div key={f.label} style={{marginBottom:12}}>
            <div style={{fontSize:11,color:t.inkLight,marginBottom:3}}>{f.label}</div>
            <div style={{fontSize:14,fontFamily:"'DM Sans',sans-serif",color:t.ink,wordBreak:"break-all"}}>{f.val}</div>
          </div>
        ))}
        <button style={{...S.btnSecondary(t),marginTop:8,fontSize:13}}>Download as PDF Card</button>
      </div>
    </div>
  );
}

// ── RECORDS ───────────────────────────────────────────────────────────────────
function Records({pet,t,bp,onUpdatePet}){
  const [tab,setTab]=useState("vaccinations");
  const [expanded,setExpanded]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const mob=bp.mobile;
  const handleAdd=(type,record)=>onUpdatePet(pet.id,{[type]:[...pet[type],record]});
  const vaccItems=pet.vaccinations.map(v=>({name:v.name,meta:`Next due: ${v.nextDue||"N/A"} · ${v.vet||"No vet"}`,date:v.date,notes:v.notes,dot:t.green,info:VACCINE_INFO[v.name]||VACCINE_DEFAULT}));
  const visitItems=pet.visits.map(v=>({name:v.name,meta:v.vet||"",date:v.date,notes:v.notes,dot:"#4a7fa5"}));
  const medItems=pet.medications.map(m=>({name:m.name,meta:m.notes||"",date:`Due: ${m.nextDue||"N/A"}`,notes:"",dot:t.gold}));
  const items=tab==="vaccinations"?vaccItems:tab==="visits"?visitItems:medItems;
  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:20}}><div style={S.eyebrow(t)}>Health Records</div><h1 style={S.pageTitle(t,mob)}>{pet.name}'s History</h1><p style={S.pageSub(t)}>Complete medical records, organized and searchable.</p></div>
      <div style={{display:"flex",gap:4,background:t.bgMid,padding:4,borderRadius:12,marginBottom:20,width:"fit-content",marginLeft:"auto",marginRight:"auto"}}>
        {["vaccinations","visits","medications"].map(tb=>(
          <button key={tb} onClick={()=>{setTab(tb);setExpanded(null);}} style={{padding:mob?"7px 11px":"8px 16px",borderRadius:9,fontSize:mob?12:13,fontWeight:tab===tb?500:400,cursor:"pointer",border:"none",background:tab===tb?t.tabActiveBg:"transparent",color:tab===tb?t.ink:t.inkLight,fontFamily:"'DM Sans',sans-serif",transition:"all 0.18s"}}>
            {tb.charAt(0).toUpperCase()+tb.slice(1)}
          </button>
        ))}
      </div>
      {tab==="vaccinations"&&items.length>0&&<div style={{fontSize:12,color:t.inkLight,marginBottom:12,fontStyle:"italic",textAlign:"center"}}>Tap any vaccination to learn what it protects against.</div>}
      <div style={{...S.card(t),background:t.surface,border:`1px solid ${t.border}`}}>
        {items.length===0
          ?<div style={{textAlign:"center",color:t.inkLight,padding:"36px 0",fontStyle:"italic",fontSize:14}}>No records yet — add one below.</div>
          :items.map((item,i)=>(
            <div key={i} style={{borderBottom:i<items.length-1?`1px solid ${t.bgDark}`:"none"}}>
              <div onClick={tab==="vaccinations"?()=>setExpanded(e=>e===i?null:i):undefined} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",cursor:tab==="vaccinations"?"pointer":"default"}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:item.dot,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:14,fontWeight:500,color:t.ink}}>{item.name}</div>
                    {tab==="vaccinations"&&<span style={{fontSize:10,color:t.green,border:`1px solid ${t.greenLight}`,borderRadius:4,padding:"1px 6px",fontWeight:500,background:t.greenPale,flexShrink:0}}>{expanded===i?"Less":"What is this?"}</span>}
                  </div>
                  <div style={{fontSize:12,color:t.inkLight,marginTop:2}}>{item.meta}</div>
                  {item.notes?<div style={{fontSize:12,color:t.inkLight,marginTop:2,fontStyle:"italic"}}>{item.notes}</div>:null}
                </div>
                <div style={{fontSize:12,color:t.inkLight,whiteSpace:"nowrap",flexShrink:0}}>{fmtDate(item.date)}</div>
              </div>
              {tab==="vaccinations"&&expanded===i&&item.info&&(
                <div style={{marginBottom:14,borderRadius:12,background:t.greenPale,border:`1px solid ${t.greenLight}`,padding:"14px 16px",animation:"fadeUp 0.22s ease"}}>
                  <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
                    {[{label:"Protects against",val:item.info.protects},{label:"Why it matters",val:item.info.why},{label:"How often",val:item.info.frequency},{label:"Side effects",val:item.info.sideEffects}].map(row=>(
                      <div key={row.label}><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:t.greenMid,fontWeight:600,marginBottom:4}}>{row.label}</div><div style={{fontSize:12,color:t.inkMid,lineHeight:1.6,fontWeight:300}}>{row.val}</div></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        }
      </div>
      <button onClick={()=>setShowAdd(true)} style={{...S.btnPrimary(t),marginTop:14,fontSize:13,display:"flex",alignItems:"center",gap:8}}><Icon name="plus" size={15} color="#fff"/>Add {tab==="vaccinations"?"Vaccination":tab==="visits"?"Vet Visit":"Medication"}</button>
      {showAdd&&<AddRecordModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} tab={tab} t={t}/>}
    </div>
  );
}

// ── WEIGHT TRACKER ────────────────────────────────────────────────────────────
function WeightTracker({pet,t,bp,onUpdatePet}){
  const mob=bp.mobile;
  const [showAdd,setShowAdd]=useState(false);
  const log=(pet.weightLog||[]).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const latest=log.length>0?log[log.length-1]:null;
  const prev=log.length>1?log[log.length-2]:null;
  const diff=latest&&prev?latest.weight-prev.weight:null;
  const handleAdd=(entry)=>onUpdatePet(pet.id,{weightLog:[...(pet.weightLog||[]),entry]});
  const chartW=500;const chartH=150;const pad=32;
  const pts=log.slice(-10);
  const minW=pts.length>0?Math.min(...pts.map(p=>p.weight))-2:0;
  const maxW=pts.length>0?Math.max(...pts.map(p=>p.weight))+2:100;
  const xStep=pts.length>1?(chartW-pad*2)/(pts.length-1):0;
  const yScale=(v)=>chartH-pad-(((v-minW)/(maxW-minW||1))*(chartH-pad*2));
  const points=pts.map((p,i)=>({x:pad+i*xStep,y:yScale(p.weight),w:p.weight}));
  const pathD=points.length>1?`M${points.map(p=>`${p.x},${p.y}`).join(" L")}`:null;
  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:20}}><div style={S.eyebrow(t)}>Weight Tracker</div><h1 style={S.pageTitle(t,mob)}>{pet.name}'s Weight</h1><p style={S.pageSub(t)}>Track weight over time to catch health changes early.</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
        {[{label:"Current",value:latest?`${latest.weight} lbs`:"—"},{label:"Change",value:diff!==null?(diff>0?`+${diff.toFixed(1)}`:`${diff.toFixed(1)}`)+" lbs":"—",color:diff===null?t.inkLight:diff>0?t.rust:t.green},{label:"Entries",value:log.length}].map(s=>(
          <div key={s.label} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:12,padding:"13px 16px"}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:t.inkLight,marginBottom:6}}>{s.label}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.color||t.ink}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card(t),marginBottom:16,overflowX:"auto",background:t.greenPale,border:`1px solid ${t.greenLight}`}}>
        <div style={{...S.eyebrow(t),marginBottom:12}}>Weight Over Time</div>
        {points.length<2
          ?<div style={{textAlign:"center",color:t.inkLight,padding:"32px 0",fontSize:13,fontStyle:"italic"}}>Log at least 2 entries to see the chart.</div>
          :<div style={{display:"flex",justifyContent:"center"}}>
            <svg width={chartW} height={chartH} style={{display:"block",maxWidth:"100%"}}>
              {[0,0.25,0.5,0.75,1].map(v=><line key={v} x1={pad} y1={chartH-pad-(v*(chartH-pad*2))} x2={chartW-pad} y2={chartH-pad-(v*(chartH-pad*2))} stroke={t.border} strokeWidth="1" strokeDasharray="3,3"/>)}
              <path d={pathD} fill="none" stroke={t.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d={pathD+` L${points[points.length-1].x},${chartH-pad} L${points[0].x},${chartH-pad} Z`} fill={t.greenPale} opacity="0.5"/>
              {points.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="5" fill={t.green} stroke={t.surface} strokeWidth="2"/><text x={p.x} y={p.y-10} textAnchor="middle" fontSize="9" fill={t.inkLight} fontFamily="DM Sans,sans-serif">{p.w}</text></g>)}
            </svg>
          </div>
        }
      </div>
      {log.length>0&&(
        <div style={S.card(t)}>
          <div style={{...S.eyebrow(t),marginBottom:12}}>History</div>
          {[...log].reverse().slice(0,8).map((e,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<Math.min(log.length,8)-1?`1px solid ${t.bgDark}`:"none"}}>
              <span style={{fontSize:14,fontWeight:500,color:t.ink}}>{e.weight} lbs</span>
              <span style={{fontSize:13,color:t.inkLight}}>{fmtDate(e.date)}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={()=>setShowAdd(true)} style={{...S.btnPrimary(t),marginTop:14,fontSize:13,display:"flex",alignItems:"center",gap:8}}><Icon name="plus" size={15} color="#fff"/>Log Weight</button>
      {showAdd&&<WeightModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} t={t}/>}
    </div>
  );
}

// ── AI CHECKER ────────────────────────────────────────────────────────────────
function AIChecker({pet,t,bp,onUpdatePet}){
  const [symptoms,setSymptoms]=useState("");
  const [response,setResponse]=useState("");
  const [loading,setLoading]=useState(false);
  const [focused,setFocused]=useState(false);
  const [showHistory,setShowHistory]=useState(false);
  const mob=bp.mobile;
  const history=pet.symptomHistory||[];
  const submit=async()=>{
    if(!symptoms.trim())return;
    setLoading(true);setResponse("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are a veterinary assistant helping with ${pet.name}, a ${getAge(pet.dob)} old ${pet.breed} (${pet.species}). Provide calm guidance. Give a clear urgency level: "Monitor at home", "Schedule a vet visit soon", or "Seek emergency care now". Use plain paragraphs, no markdown. Remind them you are not a substitute for professional care.`,messages:[{role:"user",content:`${pet.name}'s symptoms: ${symptoms}`}]})});
      const data=await res.json();
      const text=data.content?.find(c=>c.type==="text")?.text||"Unable to generate a response.";
      setResponse(text);
      onUpdatePet(pet.id,{symptomHistory:[{date:new Date().toISOString(),symptoms:symptoms.trim(),response:text},...(pet.symptomHistory||[])].slice(0,20)});
    }catch(e){setResponse("Something went wrong. Please check your connection and try again.");}
    setLoading(false);
  };
  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:20,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div><div style={S.eyebrow(t)}>AI Health Assistant</div><h1 style={S.pageTitle(t,mob)}>Symptom Checker</h1><p style={S.pageSub(t)}>Describe what you're observing. Get clear, calm guidance.</p></div>
        {history.length>0&&<button onClick={()=>setShowHistory(v=>!v)} style={{...S.btnSecondary(t),fontSize:12,display:"flex",alignItems:"center",gap:6,flexShrink:0,marginTop:4}}><Icon name="history" size={14} color="currentColor"/>{showHistory?"Hide History":`History (${history.length})`}</button>}
      </div>
      {showHistory&&history.length>0&&(
        <div style={{...S.card(t),marginBottom:20}}>
          <div style={{...S.eyebrow(t),marginBottom:12}}>Past Symptom Checks</div>
          {history.slice(0,5).map((h,i)=>(
            <div key={i} style={{padding:"12px 0",borderBottom:i<Math.min(history.length,5)-1?`1px solid ${t.bgDark}`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:13,fontWeight:500,color:t.ink,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:12}}>{h.symptoms}</div>
                <div style={{fontSize:11,color:t.inkLight,flexShrink:0}}>{fmtDate(h.date.split("T")[0])}</div>
              </div>
              <div style={{fontSize:12,color:t.inkLight,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{h.response}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{background:`linear-gradient(135deg,${t.greenPale},${t.surface})`,border:`1px solid ${t.greenLight}`,borderRadius:16,padding:20,marginBottom:20,textAlign:"left"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:t.green,marginBottom:6}}>Reviewing symptoms for {pet.name}</div>
        <div style={{fontSize:13,color:t.inkLight,lineHeight:1.6,fontWeight:300}}>Describe symptoms in plain language — when they started, how severe, and anything else noticed.</div>
        <div style={{fontSize:11,color:t.rust,marginTop:8,fontStyle:"italic"}}>This tool does not replace professional veterinary advice.</div>
      </div>
      <div style={S.card(t)}>
        <label style={S.label(t)}>Describe the symptoms</label>
        <textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} rows={5} placeholder={`e.g. "${pet.name} has been lethargic since this morning, refusing food..."`} style={{width:"100%",minHeight:100,border:`1.5px solid ${focused?t.green:t.border}`,borderRadius:12,padding:14,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:t.ink,background:t.inputBg,resize:"vertical",outline:"none",lineHeight:1.6}}/>
        <button onClick={submit} disabled={loading||!symptoms.trim()} style={{...S.btnPrimary(t),marginTop:12,opacity:(loading||!symptoms.trim())?0.5:1}}>{loading?"Analyzing...":"Analyze Symptoms"}</button>
      </div>
      {loading&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"18px 0",color:t.inkLight,fontSize:13,fontStyle:"italic"}}>{[0,200,400].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:t.green,animation:`pulse 1.2s ease-in-out ${d}ms infinite`}}/>)}<span>Analyzing symptoms...</span></div>}
      {response&&!loading&&(
        <div style={{...S.card(t),marginTop:20,animation:"popIn 0.3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${t.bgDark}`}}>
            <span style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",background:t.greenPale,color:t.green,padding:"4px 10px",borderRadius:20,fontWeight:600,border:`1px solid ${t.greenLight}`}}>AI Assessment</span>
            <span style={{fontSize:12,color:t.inkLight,fontFamily:"monospace"}}>{pet.name} · {pet.breed}</span>
          </div>
          <div style={{fontSize:14,color:t.inkMid,lineHeight:1.8,whiteSpace:"pre-wrap",fontWeight:300}}>{response}</div>
          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${t.bgDark}`,fontSize:12,color:t.rust,fontStyle:"italic"}}>Not a veterinary diagnosis. Contact your vet for professional evaluation.</div>
        </div>
      )}
    </div>
  );
}

// ── VET FINDER ────────────────────────────────────────────────────────────────
function VetFinder({t,bp}){
  const mob=bp.mobile;
  const [query,setQuery]=useState("");
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const [focused,setFocused]=useState(false);
  const search=async(q)=>{
    if(!q.trim())return;
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"Generate 5 realistic fictional veterinary clinic listings for the given location. Respond ONLY with a JSON array, no markdown or preamble. Each item: {name, address, phone, specialty, rating, hours}.",messages:[{role:"user",content:`Find vets near: ${q}`}]})});
      const data=await res.json();
      const text=data.content?.find(c=>c.type==="text")?.text||"[]";
      setResults(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch(e){setResults([]);}
    setLoading(false);
  };
  const useLocation=()=>{
    if(!navigator.geolocation)return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(pos=>{const q=`${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;setQuery(q);search(q);},()=>setLoading(false));
  };
  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:20}}><div style={S.eyebrow(t)}>Vet Finder</div><h1 style={S.pageTitle(t,mob)}>Find a Vet</h1><p style={S.pageSub(t)}>Search for veterinary clinics near you.</p></div>
      <div style={S.card(t)}>
        <label style={S.label(t)}>Location or Zip Code</label>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <input style={{...S.input(t,focused),flex:1,minWidth:160}} value={query} placeholder="e.g. 10001 or Boston, MA" onChange={e=>setQuery(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onKeyDown={e=>e.key==="Enter"&&search(query)}/>
          <button onClick={()=>search(query)} disabled={!query.trim()||loading} style={{...S.btnPrimary(t),opacity:(!query.trim()||loading)?0.5:1,flexShrink:0}}>{loading?"Searching...":"Search"}</button>
        </div>
        <button onClick={useLocation} style={{marginTop:10,display:"flex",alignItems:"center",gap:6,fontSize:12,color:t.green,background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}><Icon name="map" size={14} color={t.green}/>Use my location</button>
      </div>
      {loading&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"18px 0",color:t.inkLight,fontSize:13,fontStyle:"italic"}}>{[0,200,400].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:t.green,animation:`pulse 1.2s ease-in-out ${d}ms infinite`}}/>)}<span>Finding vets nearby...</span></div>}
      {results.length>0&&!loading&&(
        <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:12}}>
          {results.map((vet,i)=>(
            <div key={i} style={{...S.card(t),padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:t.ink,marginBottom:3}}>{vet.name}</div>
                  <div style={{fontSize:12,color:t.inkLight,marginBottom:6}}>{vet.address}</div>
                  {vet.specialty&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:t.greenPale,color:t.green,border:`1px solid ${t.greenLight}`,fontWeight:500}}>{vet.specialty}</span>}
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:t.gold}}>★ {vet.rating}</div>
                  <div style={{fontSize:11,color:t.inkLight,marginTop:2}}>{vet.hours}</div>
                </div>
              </div>
              {vet.phone&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${t.bgDark}`}}><a href={`tel:${vet.phone}`} style={{fontSize:13,color:t.green,fontWeight:500,textDecoration:"none"}}>{vet.phone}</a></div>}
            </div>
          ))}
          <div style={{fontSize:11,color:t.inkLight,textAlign:"center",fontStyle:"italic"}}>AI-generated suggestions. Verify before visiting.</div>
        </div>
      )}
    </div>
  );
}

// ── DOCUMENTS (with AI scan) ──────────────────────────────────────────────────
function Documents({pet,t,bp,onUpdatePet}){
  const mob=bp.mobile;
  const fileRef=useRef();
  const [scanning,setScanning]=useState(false);
  const [scanResult,setScanResult]=useState(null);

  const handleUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const newDoc={name:file.name.replace(/\.[^/.]+$/,""),date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),type:file.name.split(".").pop().toUpperCase(),size:`${(file.size/1024).toFixed(0)} KB`};
    onUpdatePet(pet.id,{documents:[...(pet.documents||[]),newDoc]});

    // AI scan if image
    if(file.type.startsWith("image/")||file.type==="application/pdf"){
      setScanning(true);setScanResult(null);
      try{
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
        const isImg=file.type.startsWith("image/");
        const msgContent=isImg
          ?[{type:"image",source:{type:"base64",media_type:file.type,data:base64}},{type:"text",text:`This is a vet document for ${pet.name} (${pet.breed}, ${pet.species}). Extract all health data you can find: vaccinations (name, date, next due), vet visits (reason, date, vet name), medications (name, purpose, due date), weight, and any other relevant info. Respond ONLY as JSON: {vaccinations:[{name,date,nextDue,vet}], visits:[{name,date,vet,notes}], medications:[{name,notes,nextDue,vet}], weight:null, summary:""}. Use null for missing fields.`}]
          :[{type:"text",text:`Vet document for ${pet.name}. Extract all health data. Respond ONLY as JSON: {vaccinations:[{name,date,nextDue,vet}], visits:[{name,date,vet,notes}], medications:[{name,notes,nextDue,vet}], weight:null, summary:""}. Use null for missing fields.`}];
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:msgContent}]})});
        const data=await res.json();
        const text=data.content?.find(c=>c.type==="text")?.text||"{}";
        const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
        setScanResult(parsed);
      }catch(err){setScanResult({error:true});}
      setScanning(false);
    }
    e.target.value="";
  };

  const applyExtracted=(extracted)=>{
    const updates={};
    if(extracted.vaccinations?.length)updates.vaccinations=[...(pet.vaccinations||[]),...extracted.vaccinations.filter(v=>v.name)];
    if(extracted.visits?.length)updates.visits=[...(pet.visits||[]),...extracted.visits.filter(v=>v.name)];
    if(extracted.medications?.length)updates.medications=[...(pet.medications||[]),...extracted.medications.filter(m=>m.name)];
    if(extracted.weight){updates.weight=extracted.weight;updates.weightLog=[...(pet.weightLog||[]),{weight:parseFloat(extracted.weight),date:today()}];}
    onUpdatePet(pet.id,updates);
    setScanResult(null);
  };

  return(
    <div style={{animation:"fadeUp 0.35s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>Document Vault</div>
        <h1 style={S.pageTitle(t,mob)}>{pet.name}'s Records</h1>
        <p style={S.pageSub(t)}>Stored health certificates, vet reports, and records.</p>
      </div>

      {/* AI scan hero */}
      <div style={{background:`linear-gradient(135deg,${t.green},${t.greenMid})`,borderRadius:16,padding:"20px 24px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#fff",marginBottom:4}}>AI Document Scanner</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",fontWeight:300,lineHeight:1.5}}>Upload any vet report or health certificate. Our AI reads it and automatically fills in vaccinations, visits, and medications for you.</div>
        </div>
        <button onClick={()=>fileRef.current.click()} style={{padding:"11px 20px",background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:10,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <Icon name="sparkle" size={15} color="#fff"/>{scanning?"Scanning...":"Scan Document"}
        </button>
      </div>

      {/* Scanning indicator */}
      {scanning&&(
        <div style={{...S.card(t),marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",gap:4}}>{[0,150,300].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:t.green,animation:`pulse 1.2s ease-in-out ${d}ms infinite`}}/>)}</div>
          <span style={{fontSize:13,color:t.inkLight,fontStyle:"italic"}}>AI is reading your document and extracting health data...</span>
        </div>
      )}

      {/* Scan results */}
      {scanResult&&!scanning&&(
        <div style={{...S.card(t),marginBottom:16,border:`1.5px solid ${t.greenLight}`,animation:"popIn 0.3s ease"}}>
          {scanResult.error
            ?<div style={{fontSize:13,color:t.rust}}>Couldn't extract data from this document. You can add records manually using the Records page.</div>
            :<>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:t.ink,marginBottom:4}}>Found in your document</div>
              {scanResult.summary&&<div style={{fontSize:13,color:t.inkLight,marginBottom:14,fontStyle:"italic"}}>{scanResult.summary}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                {(scanResult.vaccinations||[]).filter(v=>v.name).map((v,i)=><div key={i} style={{fontSize:13,color:t.ink,display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:"50%",background:t.green,flexShrink:0}}/><span><strong>{v.name}</strong>{v.date?` — ${v.date}`:""}</span></div>)}
                {(scanResult.visits||[]).filter(v=>v.name).map((v,i)=><div key={i} style={{fontSize:13,color:t.ink,display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:"50%",background:"#4a7fa5",flexShrink:0}}/><span><strong>{v.name}</strong>{v.date?` — ${v.date}`:""}</span></div>)}
                {(scanResult.medications||[]).filter(m=>m.name).map((m,i)=><div key={i} style={{fontSize:13,color:t.ink,display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:"50%",background:t.gold,flexShrink:0}}/><span><strong>{m.name}</strong>{m.notes?` — ${m.notes}`:""}</span></div>)}
                {scanResult.weight&&<div style={{fontSize:13,color:t.ink,display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:"50%",background:t.rust,flexShrink:0}}/><span><strong>Weight:</strong> {scanResult.weight} lbs</span></div>}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>applyExtracted(scanResult)} style={S.btnPrimary(t)}>Add All to Records</button>
                <button onClick={()=>setScanResult(null)} style={S.btnSecondary(t)}>Dismiss</button>
              </div>
            </>
          }
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":'repeat(2,1fr)',gap:12,maxWidth:700}}>
        {(pet.documents||[]).map((doc,i)=>(
          <div key={i} style={{...S.card(t),cursor:"pointer",padding:18,transition:"all 0.18s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.greenLight;e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{width:40,height:40,background:t.surfaceAlt,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,border:`1px solid ${t.border}`}}><Icon name="doc" size={18} color={t.inkLight}/></div>
            <div style={{fontSize:14,fontWeight:500,color:t.ink,marginBottom:3}}>{doc.name}</div>
            <div style={{fontSize:12,color:t.inkLight,fontWeight:300}}>{doc.type} · {doc.size} · {doc.date}</div>
          </div>
        ))}
        <div style={{...S.card(t),border:`1.5px dashed ${t.border}`,background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:8,padding:32,cursor:"pointer",transition:"all 0.18s",minHeight:120}} onClick={()=>fileRef.current.click()} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.green;e.currentTarget.style.background=t.greenPale;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background="transparent";}}>
          <Icon name="upload" size={22} color={t.inkLight}/>
          <div style={{fontSize:13,color:t.inkLight}}>Upload a document<br/><span style={{fontSize:11}}>PDF, JPG, PNG</span></div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,image/*" style={{display:"none"}} onChange={handleUpload}/>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function Settings({t,dark,setDark,onLogout,userName,bp}){
  const mob=bp.mobile;
  const wrap={maxWidth:700,width:"100%"};
  return(
    <div style={{animation:"fadeUp 0.35s ease",display:"flex",flexDirection:"column",alignItems:mob?"stretch":"center"}}>
      <div style={{...wrap,marginBottom:24}}><div style={S.eyebrow(t)}>Account</div><h1 style={S.pageTitle(t,mob)}>Settings</h1></div>
      <div style={{...S.card(t),...wrap,marginBottom:12,padding:"18px 22px",background:t.greenPale,border:`1px solid ${t.greenLight}`}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:t.green,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#fff",flexShrink:0}}>{(userName||"U").charAt(0).toUpperCase()}</div>
          <div><div style={{fontSize:15,fontWeight:600,color:t.ink}}>{userName||"Your Account"}</div><div style={{fontSize:12,color:t.inkLight,marginTop:2}}>Free trial — 7 days remaining</div></div>
        </div>
      </div>
      <div style={{...S.card(t),...wrap,marginBottom:12,padding:"18px 22px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:500,color:t.ink}}>Dark Mode</div><div style={{fontSize:11,color:t.inkLight,marginTop:2}}>Use a darker color scheme</div></div>
          <div onClick={()=>setDark(d=>!d)} style={{width:44,height:26,borderRadius:13,background:dark?t.green:t.border,position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:dark?20:3,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",transition:"left 0.25s"}}/>
          </div>
        </div>
      </div>
      <div style={{...S.card(t),...wrap,marginBottom:12,padding:"18px 22px"}}>
        <div style={{...S.eyebrow(t),marginBottom:12}}>Subscription</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${t.bgDark}`}}>
          <div><div style={{fontSize:13,fontWeight:500,color:t.ink}}>Free Trial</div><div style={{fontSize:11,color:t.inkLight,marginTop:1}}>7 days remaining</div></div>
          <span style={{fontSize:10,padding:"2px 9px",borderRadius:20,background:t.greenPale,color:t.green,border:`1px solid ${t.greenLight}`,fontWeight:600}}>Active</span>
        </div>
        {/* Annual — Best Value badge inline, not absolute */}
        <div style={{background:t.greenPale,border:`1.5px solid ${t.green}`,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <div style={{fontSize:13,fontWeight:600,color:t.ink}}>Annual Plan</div>
                <span style={{fontSize:9,fontWeight:700,letterSpacing:1,background:t.green,color:"#fff",padding:"2px 7px",borderRadius:10}}>BEST VALUE</span>
              </div>
              <div style={{fontSize:11,color:t.inkLight}}>Save 44% vs monthly</div>
            </div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:t.green}}>$19.99</div><div style={{fontSize:10,color:t.inkLight}}>per year</div></div>
          </div>
          <button style={{...S.btnPrimary(t),width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px"}}><Icon name="star" size={14} color="#fff"/>Subscribe Annually</button>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
          <div><div style={{fontSize:13,color:t.ink}}>Monthly</div><div style={{fontSize:11,color:t.inkLight}}>Cancel anytime</div></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:600,color:t.ink}}>$2.99</div><div style={{fontSize:10,color:t.inkLight}}>per month</div></div>
            <button style={{...S.btnSecondary(t),padding:"7px 12px",fontSize:12}}>Subscribe</button>
          </div>
        </div>
      </div>
      <div style={{...S.card(t),...wrap,marginBottom:12,padding:"18px 22px"}}>
        <div style={{...S.eyebrow(t),marginBottom:10}}>About</div>
        {[{label:"App",val:"Coat & Care"},{label:"Version",val:"v2.0"},{label:"AI",val:"Anthropic Claude"},{label:"Price",val:"$2.99/mo · $19.99/yr"}].map((row,i,arr)=>(
          <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${t.bgDark}`:"none"}}>
            <span style={{fontSize:13,color:t.inkLight}}>{row.label}</span>
            <span style={{fontSize:13,color:t.ink,fontWeight:500}}>{row.val}</span>
          </div>
        ))}
      </div>
      <div style={{...S.card(t),...wrap,padding:"18px 22px"}}>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:t.rustLight,border:`1px solid ${t.rust}33`,borderRadius:10,color:t.rust,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:"100%"}}><Icon name="logout" size={15} color={t.rust}/>Sign Out</button>
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function CoatAndCare(){
  const bp=useBreakpoint();
  const [loggedIn,setLoggedIn]=useState(false);
  const [userName,setUserName]=useState("");
  const [signupDate,setSignupDate]=useState(null);
  const [dark,setDark]=useState(false);
  const [pets,setPets]=useState([]);
  const [activePetId,setActivePetId]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [showAddPet,setShowAddPet]=useState(false);
  const [editingPet,setEditingPet]=useState(null);
  const [drawerOpen,setDrawerOpen]=useState(false);

  const t=dark?themes.dark:themes.light;
  const pet=pets.find(p=>p.id===activePetId)||(pets.length>0?pets[0]:null);
  const trialInfo=signupDate?getTrialInfo(signupDate):{remaining:TRIAL_DAYS,expired:false};

  const navItems=[
    {id:"dashboard",label:"Home",icon:"home"},
    {id:"profile",label:"Profile",icon:"paw"},
    {id:"records",label:"Records",icon:"shield"},
    {id:"weight",label:"Weight",icon:"trending"},
    {id:"ai",label:"AI Check",icon:"brain"},
    {id:"vets",label:"Vet Finder",icon:"map"},
    {id:"documents",label:"Vault",icon:"file"},
    {id:"settings",label:"Settings",icon:"settings"},
  ];

  const navigate=(id)=>{setPage(id);setDrawerOpen(false);};
  const handleLogin=(name,date)=>{setUserName(name);setSignupDate(date);setLoggedIn(true);};
  const handleLogout=()=>{setLoggedIn(false);setPage("dashboard");setDrawerOpen(false);};

  const updatePet=(id,changes)=>setPets(prev=>prev.map(p=>{if(p.id!==id)return p;const u={...p};Object.keys(changes).forEach(k=>{u[k]=changes[k];});return u;}));
  const addPet=(newPet)=>{setPets(prev=>[...prev,newPet]);setActivePetId(newPet.id);};
  const savePetEdits=(id,form)=>updatePet(id,form);

  if(!loggedIn)return<><GlobalStyles/><LoginScreen onLogin={handleLogin} t={t} bp={bp}/></>;

  const showSidebar=bp.desktop||bp.tablet;
  const needsPet=["profile","records","weight","ai","documents"].includes(page)&&!pet;

  const SidebarContent=({slim})=>(
    <>
      <div onClick={()=>navigate("dashboard")} style={{padding:slim?"16px 0":"20px 14px 14px",borderBottom:"1px solid rgba(255,255,255,0.08)",textAlign:slim?"center":"left",cursor:"pointer",flexShrink:0}}>
        {slim
          ?<div style={{fontFamily:"'Playfair Display',serif",fontSize:11,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>C&C</div>
          :<><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>Coat & Care</div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginTop:3}}>Pet Health, Simplified</div></>
        }
      </div>
      {!slim&&pets.length>0&&(
        <div style={{padding:"10px 8px 4px",flexShrink:0}}>
          <div style={{fontSize:8,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",padding:"0 5px",marginBottom:5,fontWeight:500}}>Your Pets</div>
          {pets.map(p=>(
            <div key={p.id} onClick={()=>{setActivePetId(p.id);navigate("dashboard");}} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 6px",borderRadius:8,cursor:"pointer",marginBottom:2,background:activePetId===p.id?"rgba(255,255,255,0.13)":"transparent"}} onMouseEnter={e=>{if(activePetId!==p.id)e.currentTarget.style.background="rgba(255,255,255,0.07)";}} onMouseLeave={e=>{if(activePetId!==p.id)e.currentTarget.style.background="transparent";}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:p.photo?"transparent":"rgba(200,220,201,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#2d4a35",flexShrink:0,overflow:"hidden",minWidth:26}}>
                {p.photo?<img src={p.photo} style={{width:26,height:26,objectFit:"cover",display:"block",borderRadius:"50%"}} alt={p.name}/>:initials(p.name)}
              </div>
              <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.9)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.breed}</div></div>
            </div>
          ))}
          <button onClick={()=>setShowAddPet(true)} style={{margin:"3px 0 0",padding:"5px 6px",borderRadius:8,border:"1px dashed rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.45)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4,width:"100%"}} onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)";}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.45)";}}>
            <Icon name="plus" size={11} color="currentColor"/>Add pet
          </button>
        </div>
      )}
      <nav style={{padding:slim?"3px 0":"10px 8px 0",borderTop:!slim&&pets.length>0?"1px solid rgba(255,255,255,0.08)":"none",marginTop:slim?0:3,flex:1,overflowY:"auto",minHeight:0}}>
        {!slim&&<div style={{fontSize:8,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",padding:"0 5px",marginBottom:3,fontWeight:500}}>Navigation</div>}
        {navItems.map(n=>(
          <div key={n.id} onClick={()=>navigate(n.id)} style={{display:"flex",alignItems:"center",gap:slim?0:7,padding:slim?"8px 0":"6px 6px",justifyContent:slim?"center":"flex-start",borderRadius:slim?0:8,cursor:"pointer",marginBottom:slim?0:1,background:page===n.id?"rgba(255,255,255,0.13)":"transparent",color:page===n.id?"#fff":"rgba(255,255,255,0.55)",fontWeight:page===n.id?500:400,fontSize:12,width:"100%",border:"none",transition:"all 0.15s"}} onMouseEnter={e=>{if(page!==n.id){e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.85)";}}} onMouseLeave={e=>{if(page!==n.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}} title={slim?n.label:""}>
            <Icon name={n.icon} size={slim?17:13} color="currentColor"/>
            {!slim&&<span>{n.label}</span>}
          </div>
        ))}
      </nav>
      <div style={{padding:slim?"3px 0 8px":"3px 8px 10px",borderTop:"1px solid rgba(255,255,255,0.08)",flexShrink:0,textAlign:slim?"center":"left"}}><div style={{fontSize:8,color:"rgba(255,255,255,0.2)"}}>v2.0</div></div>
    </>
  );

  return(
    <>
      <GlobalStyles/>
      <div style={{fontFamily:"'DM Sans',sans-serif",background:t.bg,height:"100vh",width:"100vw",display:"flex",flexDirection:"column",color:t.ink,overflow:"hidden"}}>
        <TrialBanner trialInfo={trialInfo} t={t}/>
        <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>
          {showSidebar&&(
            <aside style={{width:bp.tablet?52:175,height:"100%",background:t.green,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",overflowX:"hidden"}}>
              <SidebarContent slim={bp.tablet}/>
            </aside>
          )}
          {bp.mobile&&(
            <div style={{position:"fixed",top:0,left:0,right:0,height:50,background:t.green,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",zIndex:60,boxShadow:`0 2px 8px ${t.shadow}`}}>
              <div onClick={()=>navigate("dashboard")} style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer",letterSpacing:-0.3}}>Coat & Care</div>
              <button onClick={()=>setDrawerOpen(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}><Icon name={drawerOpen?"x":"menu"} size={20} color="#fff"/></button>
            </div>
          )}
          {bp.mobile&&drawerOpen&&(
            <>
              <div onClick={()=>setDrawerOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:70,animation:"fadeIn 0.2s ease"}}/>
              <div style={{position:"fixed",top:0,right:0,bottom:0,width:240,background:t.green,zIndex:80,display:"flex",flexDirection:"column",animation:"slideIn 0.25s ease",overflowY:"auto"}}>
                <div style={{padding:"14px 14px 10px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>Coat & Care</div>
                  <button onClick={()=>setDrawerOpen(false)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Icon name="x" size={18} color="rgba(255,255,255,0.7)"/></button>
                </div>
                {pets.length>0&&(
                  <div style={{padding:"10px 12px 4px"}}>
                    <div style={{fontSize:8,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:5,fontWeight:500}}>Your Pets</div>
                    {pets.map(p=>(
                      <div key={p.id} onClick={()=>{setActivePetId(p.id);navigate("dashboard");}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 6px",borderRadius:8,cursor:"pointer",marginBottom:2,background:activePetId===p.id?"rgba(255,255,255,0.13)":"transparent"}}>
                        <div style={{width:26,height:26,borderRadius:"50%",background:p.photo?"transparent":"rgba(200,220,201,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#2d4a35",flexShrink:0,overflow:"hidden"}}>{p.photo?<img src={p.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={p.name}/>:initials(p.name)}</div>
                        <div><div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.9)"}}>{p.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{p.breed}</div></div>
                      </div>
                    ))}
                    <button onClick={()=>{setShowAddPet(true);setDrawerOpen(false);}} style={{marginTop:3,padding:"5px 6px",borderRadius:8,border:"1px dashed rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.45)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4,width:"100%"}}><Icon name="plus" size={11} color="currentColor"/>Add pet</button>
                  </div>
                )}
                <nav style={{padding:"8px 12px",borderTop:"1px solid rgba(255,255,255,0.08)",flex:1}}>
                  <div style={{fontSize:8,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:5,fontWeight:500}}>Navigation</div>
                  {navItems.map(n=>(
                    <div key={n.id} onClick={()=>navigate(n.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 6px",borderRadius:8,cursor:"pointer",marginBottom:2,background:page===n.id?"rgba(255,255,255,0.13)":"transparent",color:page===n.id?"#fff":"rgba(255,255,255,0.6)",fontSize:13,fontWeight:page===n.id?500:400}}>
                      <Icon name={n.icon} size={14} color="currentColor"/>{n.label}
                    </div>
                  ))}
                </nav>
              </div>
            </>
          )}
          <main style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:bp.mobile?"62px 18px 32px":bp.tablet?"24px 24px":"28px 36px 40px",minWidth:0}}>
            {page==="dashboard"&&<Dashboard pets={pets} onNavigate={navigate} activePetId={activePetId} setActivePetId={setActivePetId} t={t} bp={bp} userName={userName} onAddPet={()=>setShowAddPet(true)}/>}
            {page==="profile"&&pet&&<PetProfile pet={pet} t={t} bp={bp} onUpdatePet={updatePet} onEditPet={()=>setEditingPet(pet)}/>}
            {page==="records"&&pet&&<Records pet={pet} t={t} bp={bp} onUpdatePet={updatePet}/>}
            {page==="weight"&&pet&&<WeightTracker pet={pet} t={t} bp={bp} onUpdatePet={updatePet}/>}
            {page==="ai"&&pet&&<AIChecker pet={pet} t={t} bp={bp} onUpdatePet={updatePet}/>}
            {page==="vets"&&<VetFinder t={t} bp={bp}/>}
            {page==="documents"&&pet&&<Documents pet={pet} t={t} bp={bp} onUpdatePet={updatePet}/>}
            {page==="settings"&&<Settings t={t} dark={dark} setDark={setDark} onLogout={handleLogout} userName={userName} bp={bp}/>}
            {needsPet&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16,textAlign:"center",padding:32}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink}}>No pets yet</div>
                <div style={{fontSize:14,color:t.inkLight,maxWidth:280}}>Add your first pet to view this section.</div>
                <button onClick={()=>setShowAddPet(true)} style={S.btnPrimary(t)}>Add Your First Pet</button>
              </div>
            )}
          </main>
        </div>
      </div>
      {showAddPet&&<PetModal onClose={()=>setShowAddPet(false)} onSave={addPet} t={t}/>}
      {editingPet&&<PetModal onClose={()=>setEditingPet(null)} onSave={savePetEdits} existing={editingPet} t={t}/>}
    </>
  );
}
