import { useState, useEffect, useCallback } from "react";

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { mobile: w < 640, tablet: w >= 640 && w < 1024, desktop: w >= 1024, w };
}

// ─── Demo credentials ─────────────────────────────────────────────────────────
const DEMO_USER = { email: "demo@vetvault.com", password: "vetvault123", name: "Derek" };

// ─── Pet data ─────────────────────────────────────────────────────────────────
const initialPets = [
  {
    id:1, name:"Hazel", breed:"Golden Retriever", species:"Dog",
    dob:"2020-03-14", weight:"62", weightUnit:"lbs",
    microchip:"985141003456789", vet:"Dr. Marta Osei — Riverside Animal Clinic",
    sex:"Female", color:"Golden",
    vaccinations:[
      { name:"Rabies",               date:"2024-03-14", nextDue:"2025-03-14", vet:"Dr. Marta Osei", notes:"3-year certificate issued" },
      { name:"DHPP (Distemper/Parvo)",date:"2024-03-14", nextDue:"2027-03-14", vet:"Dr. Marta Osei", notes:"" },
      { name:"Bordetella",           date:"2023-11-01", nextDue:"2024-11-01", vet:"Dr. Marta Osei", notes:"Intranasal" },
      { name:"Leptospirosis",        date:"2024-03-14", nextDue:"2025-03-14", vet:"Dr. Marta Osei", notes:"" },
    ],
    visits:[
      { name:"Annual Wellness Exam",       date:"2024-03-14", vet:"Dr. Marta Osei", notes:"All clear. Weight stable at 62 lbs. Dental cleaning recommended." },
      { name:"Ear Infection — Left Ear",   date:"2024-01-08", vet:"Dr. Marta Osei", notes:"Prescribed Otomax. 14-day course. Resolved." },
      { name:"Spay Surgery",              date:"2021-09-20", vet:"Dr. James Finn",  notes:"Uncomplicated. Healed well." },
    ],
    medications:[
      { name:"Heartgard Plus", date:"Monthly", nextDue:"2025-07-01", vet:"Preventative", notes:"Heartworm prevention" },
      { name:"NexGard",        date:"Monthly", nextDue:"2025-07-01", vet:"Preventative", notes:"Flea & tick prevention" },
    ],
    documents:[
      { name:"2024 Wellness Certificate", date:"Mar 14, 2024", type:"PDF", size:"180 KB" },
      { name:"Spay Surgery Report",       date:"Sep 20, 2021", type:"PDF", size:"240 KB" },
      { name:"Microchip Registration",    date:"May 12, 2020", type:"PDF", size:"80 KB"  },
    ],
  },
  {
    id:2, name:"Silas", breed:"Domestic Shorthair", species:"Cat",
    dob:"2019-07-22", weight:"11", weightUnit:"lbs",
    microchip:"900113001234567", vet:"Dr. Marta Osei — Riverside Animal Clinic",
    sex:"Male (neutered)", color:"Tabby",
    vaccinations:[
      { name:"Rabies", date:"2024-07-22", nextDue:"2025-07-22", vet:"Dr. Marta Osei", notes:"" },
      { name:"FVRCP",  date:"2024-07-22", nextDue:"2027-07-22", vet:"Dr. Marta Osei", notes:"3-year booster" },
    ],
    visits:[
      { name:"Annual Wellness Exam", date:"2024-07-22", vet:"Dr. Marta Osei", notes:"Slight weight gain noted. Recommend portion control. Bloodwork normal." },
    ],
    medications:[
      { name:"Revolution Plus", date:"Monthly", nextDue:"2025-07-01", vet:"Preventative", notes:"Flea, tick, heartworm" },
    ],
    documents:[
      { name:"2024 Annual Exam Report", date:"Jul 22, 2024", type:"PDF", size:"155 KB" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getAge = (dob) => {
  if (!dob) return "Unknown";
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25));
  return years === 1 ? "1 year" : `${years} years`;
};
const initials = (name) => (name||"?").charAt(0).toUpperCase();
const fmtDate  = (d) => isNaN(new Date(d)) ? d : new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor" }) => {
  const p = {
    home:    <><path d="M3 10.5L12 3l9 7.5"/><rect x="3" y="10.5" width="18" height="10" rx="1.5"/></>,
    file:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    brain:   <><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 4 4c0 1-.3 1.9-.8 2.6A4 4 0 0 1 19 12a4 4 0 0 1-3.8 4A4 4 0 0 1 12 22a4 4 0 0 1-3.2-6A4 4 0 0 1 5 12a4 4 0 0 1 3.8-3.4A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    shield:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    upload:  <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    doc:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></>,
    paw:     <><circle cx="12" cy="13" r="4"/><circle cx="6.5" cy="10.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="9" cy="7" r="1.5"/><circle cx="15" cy="7" r="1.5"/></>,
    sun:     <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    logout:  <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    eye:     <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeoff:  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    check:   <polyline points="20 6 9 17 4 12"/>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    menu:    <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:"block",flexShrink:0}}>
      {p[name]||null}
    </svg>
  );
};

// ─── Themes ───────────────────────────────────────────────────────────────────
const themes = {
  light:{
    bg:"#faf6f0", bgMid:"#f2ebe0", bgDark:"#e8ddd0",
    surface:"#ffffff", surfaceAlt:"#faf6f0",
    ink:"#1a1610", inkMid:"#3d3428", inkLight:"#7a6e5f",
    border:"#ddd4c5", shadow:"rgba(26,22,16,0.08)",
    green:"#2d4a35", greenMid:"#3d6347", greenLight:"#c8dcc9", greenPale:"#edf4ee",
    rust:"#b85c38", rustLight:"#f5e6df",
    gold:"#c9963a", goldLight:"#fdf3e1",
    inputBg:"#ffffff", tabActiveBg:"#ffffff", overlay:"rgba(26,22,16,0.45)",
  },
  dark:{
    bg:"#111813", bgMid:"#192116", bgDark:"#1f2b1c",
    surface:"#1c2519", surfaceAlt:"#192116",
    ink:"#e8e3da", inkMid:"#c4bfb5", inkLight:"#8a9486",
    border:"#2e3d2a", shadow:"rgba(0,0,0,0.3)",
    green:"#1e3326", greenMid:"#263d2e", greenLight:"#2d4a35", greenPale:"#1a2e1d",
    rust:"#c97255", rustLight:"#2d1a12",
    gold:"#d4a84b", goldLight:"#2a2010",
    inputBg:"#1c2519", tabActiveBg:"#2a3826", overlay:"rgba(0,0,0,0.6)",
  },
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;}
    @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
    @keyframes fadeUp  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse   {0%,100%{transform:scale(0.7);opacity:0.4}50%{transform:scale(1);opacity:1}}
  `}</style>
);

// ─── Style helpers ────────────────────────────────────────────────────────────
const S = {
  eyebrow:(t)=>({ fontSize:10,letterSpacing:4,textTransform:"uppercase",color:t.inkLight,marginBottom:8,fontWeight:500,fontFamily:"'DM Sans',sans-serif" }),
  pageTitle:(t,mob)=>({ fontFamily:"'Playfair Display',serif",fontSize:mob?26:34,fontWeight:700,color:t.ink,letterSpacing:-0.5,lineHeight:1.1 }),
  pageSub:(t)=>({ fontSize:14,color:t.inkLight,marginTop:8,fontWeight:300,lineHeight:1.5 }),
  card:(t)=>({ background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:24,boxShadow:`0 2px 12px ${t.shadow}` }),
  label:(t)=>({ display:"block",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:t.inkLight,marginBottom:8,fontWeight:500 }),
  input:(t,focus)=>({ width:"100%",padding:"12px 14px",border:`1.5px solid ${focus?t.green:t.border}`,borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:t.ink,background:t.inputBg,outline:"none",transition:"border-color 0.18s",display:"block" }),
  btnPrimary:(t)=>({ padding:"12px 26px",background:t.green,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"opacity 0.18s" }),
  btnSecondary:(t)=>({ padding:"11px 22px",border:`1.5px solid ${t.border}`,background:"transparent",borderRadius:10,fontSize:14,cursor:"pointer",color:t.inkMid,fontFamily:"'DM Sans',sans-serif" }),
};

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin, t, bp }) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [error,setError]=useState("");
  const [focus,setFocus]=useState(null);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);

  const validateEmail=(e)=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
  const pwRules=[
    {test:(p)=>p.length>=8,         label:"8+ characters"},
    {test:(p)=>/[A-Z]/.test(p),      label:"Uppercase letter"},
    {test:(p)=>/[0-9]/.test(p),      label:"Number"},
    {test:(p)=>/[^A-Za-z0-9]/.test(p),label:"Special character"},
  ];
  const pwStrength=pwRules.filter(r=>r.test(password)).length;

  const submit=()=>{
    setError("");
    if(!email||!password||(mode==="signup"&&!name)){setError("Please fill in all fields.");return;}
    if(!validateEmail(email)){setError("Please enter a valid email address.");return;}
    if(mode==="signup"){
      const fail=pwRules.filter(r=>!r.test(password));
      if(fail.length){setError("Password needs: "+fail.map(r=>r.label.toLowerCase()).join(", ")+".");return;}
    }
    setLoading(true);
    setTimeout(()=>{
      if(mode==="login"){
        if(email===DEMO_USER.email&&password===DEMO_USER.password){setSuccess(true);setTimeout(()=>onLogin(DEMO_USER.name),700);}
        else{setLoading(false);setError("Invalid email or password. Try demo@vetvault.com / vetvault123");}
      } else {
        setSuccess(true);setTimeout(()=>onLogin(name.trim().split(" ")[0]||email.split("@")[0]),700);
      }
    },900);
  };

  // Mobile/tablet: single panel; desktop: two panel
  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",fontFamily:"'DM Sans',sans-serif",animation:"fadeIn 0.4s ease"}}>
      {/* Branding panel — desktop only */}
      {bp.desktop && (
        <div style={{
          width:"42%",minHeight:"100vh",flexShrink:0,
          background:`linear-gradient(160deg,${t.green} 0%,${t.greenMid} 100%)`,
          display:"flex",flexDirection:"column",justifyContent:"space-between",
          padding:"48px 52px",position:"relative",overflow:"hidden",
        }}>
          {[{w:320,h:320,top:-80,right:-100,op:0.06},{w:200,h:200,bottom:60,left:-60,op:0.05}].map((c,i)=>(
            <div key={i} style={{position:"absolute",width:c.w,height:c.h,top:c.top,right:c.right,bottom:c.bottom,left:c.left,borderRadius:"50%",background:`rgba(255,255,255,${c.op})`,pointerEvents:"none"}}/>
          ))}
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#fff"}}>VetVault</div>
            <div style={{fontSize:10,letterSpacing:4,color:"rgba(255,255,255,0.45)",marginTop:5}}>HEALTH RECORDS</div>
          </div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:20}}>
              Your pet's entire<br/>health history,<br/><span style={{fontStyle:"italic",fontWeight:400}}>always with you.</span>
            </div>
            <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:14}}>
              {["Universal pet health record","AI-powered symptom guidance","Emergency health card","Secure document vault"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name="check" size={12} color="#fff"/>
                  </div>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.75)",fontWeight:300}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"relative",zIndex:1,fontSize:11,color:"rgba(255,255,255,0.25)"}}>© 2026 VetVault</div>
        </div>
      )}

      {/* Form panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:bp.mobile?"28px 20px":"40px 32px"}}>
        {/* Mobile logo */}
        {!bp.desktop && (
          <div style={{position:"absolute",top:28,left:"50%",transform:"translateX(-50%)",textAlign:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.green}}>VetVault</div>
          </div>
        )}
        <div style={{width:"100%",maxWidth:400,animation:"slideUp 0.45s ease",paddingTop:bp.mobile?40:0}}>
          <div style={{marginBottom:28}}>
            <div style={{...S.eyebrow(t),marginBottom:10}}>{mode==="login"?"Welcome back":"Get started"}</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:bp.mobile?24:30,fontWeight:700,color:t.ink}}>
              {mode==="login"?"Sign in to your account":"Create your account"}
            </h1>
          </div>

          {mode==="login"&&(
            <div style={{background:t.greenPale,border:`1px solid ${t.greenLight}`,borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:12,color:t.inkLight,lineHeight:1.6}}>
              <span style={{fontWeight:500,color:t.green}}>Demo: </span>demo@vetvault.com · vetvault123
            </div>
          )}

          {mode==="signup"&&(
            <div style={{marginBottom:16}}>
              <label style={S.label(t)}>Your Name</label>
              <input style={S.input(t,focus==="name")} placeholder="e.g. Alex Johnson" value={name}
                onChange={e=>setName(e.target.value)} onFocus={()=>setFocus("name")} onBlur={()=>setFocus(null)}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
          )}
          <div style={{marginBottom:16}}>
            <label style={S.label(t)}>Email</label>
            <input type="email" style={S.input(t,focus==="email")} placeholder="you@example.com" value={email}
              onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocus("email")} onBlur={()=>setFocus(null)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={S.label(t)}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} style={{...S.input(t,focus==="pass"),paddingRight:44}}
                placeholder="••••••••" value={password}
                onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocus("pass")} onBlur={()=>setFocus(null)}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
              <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.inkLight,padding:4,display:"flex"}}>
                <Icon name={showPass?"eyeoff":"eye"} size={16} color="currentColor"/>
              </button>
            </div>
            {mode==="signup"&&password.length>0&&(
              <div style={{marginTop:10}}>
                <div style={{display:"flex",gap:4,marginBottom:8}}>
                  {[0,1,2,3].map(i=>(
                    <div key={i} style={{flex:1,height:3,borderRadius:2,transition:"background 0.2s",
                      background:i<pwStrength?(pwStrength<=1?t.rust:pwStrength<=2?t.gold:pwStrength<=3?"#7ab648":t.green):t.border}}/>
                  ))}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px 12px"}}>
                  {pwRules.map(r=>(
                    <span key={r.label} style={{fontSize:11,color:r.test(password)?t.green:t.inkLight,display:"flex",alignItems:"center",gap:4,transition:"color 0.2s"}}>
                      <span>{r.test(password)?"✓":"·"}</span>{r.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error&&<div style={{background:t.rustLight,border:`1px solid ${t.rust}`,borderRadius:9,padding:"10px 14px",marginBottom:16,fontSize:13,color:t.rust}}>{error}</div>}

          <button onClick={submit} disabled={loading||success} style={{
            ...S.btnPrimary(t),width:"100%",padding:"14px",fontSize:15,
            opacity:(loading||success)?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            background:success?t.greenMid:t.green,
          }}>
            {success?<><Icon name="check" size={16} color="#fff"/>Signed in</>:loading?"Signing in...":mode==="login"?"Sign In":"Create Account"}
          </button>

          <div style={{textAlign:"center",marginTop:20,fontSize:13,color:t.inkLight}}>
            {mode==="login"?"Don't have an account? ":"Already have an account? "}
            <button onClick={()=>{setMode(m=>m==="login"?"signup":"login");setError("");}}
              style={{background:"none",border:"none",color:t.green,cursor:"pointer",fontWeight:500,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>
              {mode==="login"?"Sign up free":"Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VACCINE INFO
// ══════════════════════════════════════════════════════════════════════════════
const VACCINE_INFO = {
  "Rabies":{ protects:"Rabies virus — a fatal viral disease affecting the brain and nervous system.",why:"Required by law in most US states. Transmitted through bites from infected animals. Fatal to both pets and humans once symptoms appear.",frequency:"Every 1–3 years depending on vaccine type and local law.",sideEffects:"Mild soreness at injection site, occasional low-grade fever for 24 hours." },
  "DHPP (Distemper/Parvo)":{ protects:"Canine Distemper, Hepatitis, Parainfluenza, and Parvovirus.",why:"Distemper attacks the respiratory, GI, and nervous systems. Parvo causes severe, often fatal vomiting and diarrhea and is highly contagious.",frequency:"Puppy series, then every 1–3 years as an adult.",sideEffects:"Mild lethargy or soreness for 1–2 days." },
  "Bordetella":{ protects:"Bordetella bronchiseptica — the primary cause of kennel cough.",why:"Highly contagious in social settings. Usually required by kennels and daycares.",frequency:"Every 6–12 months depending on exposure risk.",sideEffects:"Mild sneezing or nasal discharge if given intranasally." },
  "Leptospirosis":{ protects:"Leptospira bacteria spread through water, soil, and wildlife urine.",why:"Can cause kidney and liver failure. Can also be transmitted to humans.",frequency:"Annually for dogs with outdoor exposure.",sideEffects:"Slightly higher rate of reactions; vet may monitor for 30 minutes." },
  "FVRCP":{ protects:"Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia.",why:"Panleukopenia is highly contagious and often fatal in cats. Core cat vaccine.",frequency:"Kitten series, then every 1–3 years as an adult.",sideEffects:"Mild lethargy, reduced appetite for 24–48 hours." },
};
const VACCINE_DEFAULT={ protects:"Protects against infectious disease.",why:"Recommended by veterinarians as part of standard preventative care.",frequency:"Your vet will advise on the appropriate schedule.",sideEffects:"Generally mild — soreness at site and brief lethargy are most common." };

// ══════════════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ pets, onNavigate, activePetId, setActivePetId, t, bp, userName, onAddPet }) {
  const pet = pets.find(p=>p.id===activePetId)||(pets.length>0?pets[0]:null);
  const mob = bp.mobile;

  if(pets.length===0) return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>Overview</div>
        <h1 style={S.pageTitle(t,mob)}>Welcome{userName?`, ${userName}`:""}</h1>
        <p style={S.pageSub(t)}>Get started by adding your first pet.</p>
      </div>
      <div style={{...S.card(t),textAlign:"center",padding:"52px 32px"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:t.greenPale,border:`2px solid ${t.greenLight}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
          <Icon name="paw" size={28} color={t.green}/>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink,marginBottom:10}}>No pets added yet</div>
        <div style={{fontSize:14,color:t.inkLight,maxWidth:300,margin:"0 auto 24px",lineHeight:1.6}}>Add your first pet to start tracking vaccinations, vet visits, medications, and health records.</div>
        <button onClick={onAddPet} style={S.btnPrimary(t)}>Add Your First Pet</button>
      </div>
    </div>
  );
  const upcoming=[
    {month:"JUL",day:"01",title:`${pet.name} — Heartworm Prevention`,sub:"Monthly medication due",type:"green"},
    {month:"JUL",day:"22",title:"Silas — Rabies Booster",sub:"Annual vaccination due",type:"rust"},
    {month:"AUG",day:"10",title:`${pet.name} — Dental Cleaning`,sub:"Recommended at last visit",type:"gold"},
  ];
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>Overview</div>
        <h1 style={S.pageTitle(t,mob)}>Good morning{userName?`, ${userName}`:""}</h1>
        <p style={S.pageSub(t)}>Your pets' health summary.</p>
      </div>

      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${t.green} 0%,${t.greenMid} 100%)`,borderRadius:18,padding:mob?"22px 20px":"28px 32px",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
        <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Active Profile</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:mob?22:26,fontWeight:700,color:"#fff",marginBottom:4}}>{pet.name}</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:300}}>{pet.breed} — {getAge(pet.dob)} old</div>
        <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap"}}>
          <button onClick={()=>onNavigate("profile")} style={{...S.btnPrimary(t),fontSize:13,padding:"8px 18px"}}>View Profile</button>
          <button onClick={()=>onNavigate("ai")} style={{padding:"8px 18px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            Symptom Check
          </button>
        </div>
      </div>

      {/* Stats — 2 cols on mobile, 3 on wider */}
      <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Pets in Vault",  value:pets.length,                                         unit:"registered"},
          {label:"Records Stored", value:pets.reduce((a,p)=>a+p.documents.length,0),          unit:"documents"},
          {label:"Next Due",       value:"Jul 1",                                              unit:"medication", span:mob},
        ].map((s,i)=>(
          <div key={s.label} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:mob?"14px":"18px",boxShadow:`0 1px 6px ${t.shadow}`,gridColumn:s.span?"1 / -1":"auto"}}>
            <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:t.inkLight,marginBottom:8}}>{s.label}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:mob?20:26,fontWeight:700,color:t.ink,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:12,color:t.inkLight,marginTop:4,fontWeight:300}}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div style={{...S.eyebrow(t),marginBottom:12}}>Upcoming</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {upcoming.map((u,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:mob?"12px 14px":"14px 18px",background:t.surface,border:`1px solid ${t.border}`,borderRadius:12}}>
            <div style={{width:40,height:40,background:t.greenPale,borderRadius:9,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:t.green,fontWeight:600}}>{u.month}</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:t.green,lineHeight:1}}>{u.day}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,color:t.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.title}</div>
              <div style={{fontSize:11,color:t.inkLight,marginTop:2}}>{u.sub}</div>
            </div>
            {!mob&&(
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:500,flexShrink:0,
                background:u.type==="green"?t.greenPale:u.type==="rust"?t.rustLight:t.goldLight,
                color:u.type==="green"?t.green:u.type==="rust"?t.rust:t.gold}}>
                {u.type==="green"?"Routine":u.type==="rust"?"Required":"Recommended"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PetProfile({ pet, t, bp }) {
  const mob=bp.mobile;
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>Pet Profile</div>
        <h1 style={S.pageTitle(t,mob)}>{pet.name}</h1>
      </div>
      <div style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:28,flexWrap:"wrap"}}>
        <div style={{width:90,height:90,borderRadius:18,flexShrink:0,background:`linear-gradient(135deg,${t.greenLight},${t.bgDark})`,border:`3px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:32,color:t.green,fontWeight:700}}>
          {initials(pet.name)}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:mob?24:30,fontWeight:700,color:t.ink}}>{pet.name}</div>
          <div style={{fontSize:14,color:t.inkLight,marginTop:3,fontStyle:"italic",fontFamily:"'Playfair Display',serif"}}>{pet.breed}</div>
          <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
            {[pet.species,pet.sex,pet.color,`Born ${new Date(pet.dob).getFullYear()}`].map(tag=>(
              <span key={tag} style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${t.border}`,color:t.inkMid,background:t.surface}}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals — always 2-col */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
        {[
          {label:"Age",        value:getAge(pet.dob),                    big:true},
          {label:"Weight",     value:`${pet.weight} ${pet.weightUnit}`,   big:true},
          {label:"Microchip",  value:pet.microchip,                       big:false},
          {label:"Primary Vet",value:pet.vet.split("—")[0].trim(),        big:false, sub:pet.vet.split("—")[1]?.trim()||""},
        ].map(v=>(
          <div key={v.label} style={{background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:t.inkLight,marginBottom:6}}>{v.label}</div>
            <div style={{fontFamily:v.big?"'Playfair Display',serif":"'DM Sans',sans-serif",fontSize:v.big?22:12,fontWeight:v.big?700:500,color:t.ink,lineHeight:1.2,wordBreak:"break-word"}}>{v.value}</div>
            {v.sub&&<div style={{fontSize:10,color:t.inkLight,marginTop:3}}>{v.sub}</div>}
          </div>
        ))}
      </div>

      {/* Emergency card */}
      <div style={S.card(t)}>
        <div style={{...S.eyebrow(t),marginBottom:14}}>Emergency Card</div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{label:"Pet Name",val:pet.name},{label:"Microchip ID",val:pet.microchip,mono:true},{label:"Veterinarian",val:pet.vet}].map(f=>(
            <div key={f.label}>
              <div style={{fontSize:11,color:t.inkLight,marginBottom:3}}>{f.label}</div>
              <div style={{fontSize:f.mono?12:14,fontFamily:f.mono?"monospace":"inherit",color:t.ink,wordBreak:"break-all"}}>{f.val}</div>
            </div>
          ))}
        </div>
        <button style={{...S.btnSecondary(t),marginTop:16,fontSize:13}}>Download as PDF Card</button>
      </div>
    </div>
  );
}

function Records({ pet, t, bp }) {
  const [tab,setTab]=useState("vaccinations");
  const [expanded,setExpanded]=useState(null);
  const mob=bp.mobile;

  const vaccItems=pet.vaccinations.map(v=>({name:v.name,meta:`Next due: ${v.nextDue} · ${v.vet}`,date:v.date,notes:v.notes,dot:t.green,info:VACCINE_INFO[v.name]||VACCINE_DEFAULT}));
  const visitItems=pet.visits.map(v=>({name:v.name,meta:v.vet,date:v.date,notes:v.notes,dot:"#3a6b8a"}));
  const medItems=pet.medications.map(m=>({name:m.name,meta:m.notes,date:`Due: ${m.nextDue}`,notes:"",dot:t.gold}));
  const items=tab==="vaccinations"?vaccItems:tab==="visits"?visitItems:medItems;

  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>Health Records</div>
        <h1 style={S.pageTitle(t,mob)}>{pet.name}'s History</h1>
        <p style={S.pageSub(t)}>Complete medical records, organized and searchable.</p>
      </div>
      <div style={{display:"flex",gap:4,background:t.bgMid,padding:4,borderRadius:12,marginBottom:20,width:"fit-content"}}>
        {["vaccinations","visits","medications"].map(tb=>(
          <button key={tb} onClick={()=>{setTab(tb);setExpanded(null);}} style={{
            padding:mob?"7px 12px":"8px 18px",borderRadius:9,fontSize:mob?12:13,
            fontWeight:tab===tb?500:400,cursor:"pointer",border:"none",
            background:tab===tb?t.tabActiveBg:"transparent",
            color:tab===tb?t.ink:t.inkLight,fontFamily:"'DM Sans',sans-serif",
            boxShadow:tab===tb?`0 1px 4px ${t.shadow}`:"none",transition:"all 0.18s",
          }}>{tb.charAt(0).toUpperCase()+tb.slice(1)}</button>
        ))}
      </div>
      {tab==="vaccinations"&&<div style={{fontSize:12,color:t.inkLight,marginBottom:12,fontStyle:"italic"}}>Tap any vaccination to learn what it protects against.</div>}
      <div style={S.card(t)}>
        {items.length===0?(
          <div style={{textAlign:"center",color:t.inkLight,padding:"40px 0",fontStyle:"italic"}}>No records yet.</div>
        ):items.map((item,i)=>(
          <div key={i} style={{borderBottom:i<items.length-1?`1px solid ${t.bgDark}`:"none"}}>
            <div onClick={tab==="vaccinations"?()=>setExpanded(e=>e===i?null:i):undefined}
              style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",cursor:tab==="vaccinations"?"pointer":"default"}}
              onMouseEnter={e=>{if(tab==="vaccinations")e.currentTarget.style.opacity="0.75";}}
              onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:item.dot,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <div style={{fontSize:14,fontWeight:500,color:t.ink}}>{item.name}</div>
                  {tab==="vaccinations"&&(
                    <span style={{fontSize:10,color:t.green,border:`1px solid ${t.greenLight}`,borderRadius:4,padding:"1px 6px",fontWeight:500,background:t.greenPale,flexShrink:0}}>
                      {expanded===i?"Less":"What is this?"}
                    </span>
                  )}
                </div>
                <div style={{fontSize:12,color:t.inkLight,marginTop:3}}>{item.meta}</div>
                {item.notes?<div style={{fontSize:12,color:t.inkLight,marginTop:2,fontStyle:"italic"}}>{item.notes}</div>:null}
              </div>
              <div style={{fontSize:12,color:t.inkLight,whiteSpace:"nowrap",flexShrink:0}}>{fmtDate(item.date)}</div>
            </div>
            {tab==="vaccinations"&&expanded===i&&item.info&&(
              <div style={{marginBottom:14,borderRadius:12,background:t.greenPale,border:`1px solid ${t.greenLight}`,padding:"14px 16px",animation:"fadeUp 0.2s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
                  {[{label:"Protects against",val:item.info.protects},{label:"Why it matters",val:item.info.why},{label:"How often",val:item.info.frequency},{label:"Side effects",val:item.info.sideEffects}].map(row=>(
                    <div key={row.label}>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:t.green,fontWeight:600,marginBottom:4}}>{row.label}</div>
                      <div style={{fontSize:12,color:t.inkMid,lineHeight:1.6,fontWeight:300}}>{row.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button style={{...S.btnPrimary(t),marginTop:14,fontSize:13}}>+ Add Record</button>
    </div>
  );
}

function AIChecker({ pet, t, bp }) {
  const [symptoms,setSymptoms]=useState("");
  const [response,setResponse]=useState("");
  const [loading,setLoading]=useState(false);
  const [focused,setFocused]=useState(false);
  const mob=bp.mobile;

  const submit=async()=>{
    if(!symptoms.trim())return;
    setLoading(true);setResponse("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are a veterinary assistant helping with ${pet.name}, a ${getAge(pet.dob)} old ${pet.breed} (${pet.species}). Provide calm, organized guidance. Give a clear urgency level: "Monitor at home", "Schedule a vet visit soon", or "Seek emergency care now". List 2-3 things to watch for. Use plain paragraphs, no markdown. Remind them you are not a substitute for professional care.`,
          messages:[{role:"user",content:`${pet.name}'s symptoms: ${symptoms}`}],
        }),
      });
      const data=await res.json();
      setResponse(data.content?.find(c=>c.type==="text")?.text||"Unable to generate a response. Please try again.");
    }catch(e){setResponse("Something went wrong. Please check your connection and try again.");}
    setLoading(false);
  };

  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>AI Health Assistant</div>
        <h1 style={S.pageTitle(t,mob)}>Symptom Checker</h1>
        <p style={S.pageSub(t)}>Describe what you're observing. Get clear, calm guidance.</p>
      </div>
      <div style={{background:`linear-gradient(135deg,${t.greenPale},${t.surface})`,border:`1px solid ${t.greenLight}`,borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:t.green,marginBottom:6}}>Reviewing symptoms for {pet.name}</div>
        <div style={{fontSize:13,color:t.inkLight,lineHeight:1.6,fontWeight:300}}>Describe symptoms in plain language — when they started, how severe, and anything else you've noticed.</div>
        <div style={{fontSize:11,color:t.rust,marginTop:8,fontStyle:"italic"}}>This tool does not replace professional veterinary advice.</div>
      </div>
      <div style={S.card(t)}>
        <label style={S.label(t)}>Describe the symptoms</label>
        <textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} rows={5}
          placeholder={`e.g. "${pet.name} has been lethargic since this morning, refusing food..."`}
          style={{width:"100%",minHeight:100,border:`1.5px solid ${focused?t.green:t.border}`,borderRadius:12,padding:14,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:t.ink,background:t.inputBg,resize:"vertical",outline:"none",transition:"border-color 0.2s",lineHeight:1.6}}/>
        <button onClick={submit} disabled={loading||!symptoms.trim()} style={{...S.btnPrimary(t),marginTop:12,opacity:(loading||!symptoms.trim())?0.55:1}}>
          {loading?"Analyzing...":"Analyze Symptoms"}
        </button>
      </div>
      {loading&&(
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"18px 0",color:t.inkLight,fontSize:13,fontStyle:"italic"}}>
          {[0,200,400].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:t.green,animation:`pulse 1.2s ease-in-out ${d}ms infinite`}}/>)}
          <span>Analyzing...</span>
        </div>
      )}
      {response&&!loading&&(
        <div style={{...S.card(t),marginTop:20,animation:"fadeUp 0.3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${t.bgDark}`}}>
            <span style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",background:t.greenPale,color:t.green,padding:"4px 10px",borderRadius:20,fontWeight:600,border:`1px solid ${t.greenLight}`}}>AI Assessment</span>
            <span style={{fontSize:12,color:t.inkLight,fontFamily:"monospace"}}>{pet.name} · {pet.breed}</span>
          </div>
          <div style={{fontSize:14,color:t.inkMid,lineHeight:1.8,whiteSpace:"pre-wrap",fontWeight:300}}>{response}</div>
          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${t.bgDark}`,fontSize:12,color:t.rust,fontStyle:"italic"}}>
            Not a veterinary diagnosis. Contact {pet.vet} for professional evaluation.
          </div>
        </div>
      )}
    </div>
  );
}

function Documents({ pet, t, bp }) {
  const mob=bp.mobile;
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={S.eyebrow(t)}>Document Vault</div>
        <h1 style={S.pageTitle(t,mob)}>{pet.name}'s Records</h1>
        <p style={S.pageSub(t)}>Stored health certificates, vet reports, and records.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:12}}>
        {pet.documents.map((doc,i)=>(
          <div key={i} style={{...S.card(t),cursor:"pointer",padding:18,transition:"all 0.18s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=t.greenLight;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;}}>
            <div style={{width:40,height:40,background:t.surfaceAlt,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,border:`1px solid ${t.border}`}}>
              <Icon name="doc" size={18} color={t.inkLight}/>
            </div>
            <div style={{fontSize:14,fontWeight:500,color:t.ink,marginBottom:3}}>{doc.name}</div>
            <div style={{fontSize:12,color:t.inkLight,fontWeight:300}}>{doc.type} · {doc.size} · {doc.date}</div>
          </div>
        ))}
        <div style={{...S.card(t),border:`1.5px dashed ${t.border}`,background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:8,padding:28,cursor:"pointer",transition:"all 0.18s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=t.greenLight;e.currentTarget.style.background=t.greenPale;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background="transparent";}}>
          <Icon name="upload" size={22} color={t.inkLight}/>
          <div style={{fontSize:13,color:t.inkLight}}>Upload a document<br/><span style={{fontSize:11}}>PDF, JPG, PNG</span></div>
        </div>
      </div>
    </div>
  );
}

function Settings({ t, dark, setDark, onLogout, userName, bp }) {
  const mob=bp.mobile;
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:28}}>
        <div style={S.eyebrow(t)}>Account</div>
        <h1 style={S.pageTitle(t,mob)}>Settings</h1>
      </div>
      <div style={{...S.card(t),marginBottom:14}}>
        <div style={{...S.eyebrow(t),marginBottom:14}}>Account</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:t.green,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#fff",flexShrink:0}}>
            {(userName||"U").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:600,color:t.ink}}>{userName||"Your Account"}</div>
            <div style={{fontSize:12,color:t.inkLight,marginTop:2}}>VetVault member</div>
          </div>
        </div>
      </div>
      <div style={{...S.card(t),marginBottom:14}}>
        <div style={{...S.eyebrow(t),marginBottom:14}}>Appearance</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:14,fontWeight:500,color:t.ink}}>Dark Mode</div>
            <div style={{fontSize:12,color:t.inkLight,marginTop:2}}>Use a darker color scheme</div>
          </div>
          <div onClick={()=>setDark(d=>!d)} style={{width:48,height:28,borderRadius:14,background:dark?t.greenMid:t.border,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:dark?22:3,width:22,height:22,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left 0.2s"}}/>
          </div>
        </div>
      </div>
      <div style={{...S.card(t),marginBottom:14}}>
        <div style={{...S.eyebrow(t),marginBottom:14}}>About</div>
        {[{label:"Version",val:"VetVault v1.0"},{label:"AI Provider",val:"Anthropic Claude"},{label:"Data",val:"Local session"}].map((row,i,arr)=>(
          <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${t.bgDark}`:"none"}}>
            <span style={{fontSize:14,color:t.inkLight}}>{row.label}</span>
            <span style={{fontSize:14,color:t.ink,fontWeight:500}}>{row.val}</span>
          </div>
        ))}
      </div>
      <div style={S.card(t)}>
        <div style={{...S.eyebrow(t),marginBottom:14}}>Account Actions</div>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:t.rustLight,border:`1px solid ${t.rust}33`,borderRadius:10,color:t.rust,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:"100%"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <Icon name="logout" size={16} color={t.rust}/>Sign Out
        </button>
      </div>
    </div>
  );
}

function AddPetModal({ onClose, onAdd, t }) {
  const [form,setForm]=useState({name:"",breed:"",species:"Dog",dob:"",weight:"",sex:"Male"});
  const [focus,setFocus]=useState(null);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleAdd=()=>{
    if(!form.name||!form.breed)return;
    onAdd({id:Date.now(),...form,weightUnit:"lbs",microchip:"Not registered",vet:"Not assigned",color:"Unknown",vaccinations:[],visits:[],medications:[],documents:[]});
    onClose();
  };
  const fields=[
    {k:"name",   label:"Pet Name",     type:"text",  placeholder:"e.g. Hazel",              opts:null},
    {k:"breed",  label:"Breed",        type:"text",  placeholder:"e.g. Labrador Retriever",  opts:null},
    {k:"species",label:"Species",      type:"select",placeholder:"",                         opts:["Dog","Cat","Rabbit","Bird","Other"]},
    {k:"sex",    label:"Sex",          type:"select",placeholder:"",                         opts:["Male","Female","Male (neutered)","Female (spayed)"]},
    {k:"dob",    label:"Date of Birth",type:"date",  placeholder:"",                         opts:null},
    {k:"weight", label:"Weight (lbs)", type:"text",  placeholder:"e.g. 48",                  opts:null},
  ];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:t.overlay,backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:t.bg,borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto",boxShadow:`0 24px 80px ${t.shadow}`,animation:"fadeUp 0.25s ease"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink,marginBottom:4}}>Add a Pet</div>
        <div style={{fontSize:13,color:t.inkLight,marginBottom:22,fontWeight:300}}>Enter your pet's basic information to get started.</div>
        {fields.map(f=>(
          <div key={f.k} style={{marginBottom:14}}>
            <label style={S.label(t)}>{f.label}</label>
            {f.type==="select"
              ?<select style={S.input(t,false)} value={form[f.k]} onChange={e=>set(f.k,e.target.value)}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              :<input type={f.type} style={S.input(t,focus===f.k)} value={form[f.k]}
                  onChange={e=>set(f.k,e.target.value)} placeholder={f.placeholder}
                  onFocus={()=>setFocus(f.k)} onBlur={()=>setFocus(null)}/>
            }
          </div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          <button onClick={onClose} style={S.btnSecondary(t)}>Cancel</button>
          <button onClick={handleAdd} style={{...S.btnPrimary(t),opacity:(!form.name||!form.breed)?0.5:1}} disabled={!form.name||!form.breed}>Add Pet</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════
export default function VetVault() {
  const bp = useBreakpoint();
  const [loggedIn,setLoggedIn]=useState(false);
  const [userName,setUserName]=useState("");
  const [dark,setDark]=useState(false);
  const [pets,setPets]=useState([]);
  const [activePetId,setActivePetId]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [showAddPet,setShowAddPet]=useState(false);
  const [drawerOpen,setDrawerOpen]=useState(false);

  const t=dark?themes.dark:themes.light;
  const pet=pets.find(p=>p.id===activePetId)||(pets.length>0?pets[0]:null);

  const navItems=[
    {id:"dashboard",label:"Home",    icon:"home"},
    {id:"profile",  label:"Profile", icon:"paw"},
    {id:"records",  label:"Records", icon:"shield"},
    {id:"ai",       label:"AI Check",icon:"brain"},
    {id:"documents",label:"Vault",   icon:"file"},
    {id:"settings", label:"Settings",icon:"settings"},
  ];

  const handleLogin=(name)=>{setUserName(name);setLoggedIn(true);};
  const handleLogout=()=>{setLoggedIn(false);setPage("dashboard");setDrawerOpen(false);};
  const navigate=(id)=>{setPage(id);setDrawerOpen(false);};

  if(!loggedIn) return <><GlobalStyles/><LoginScreen onLogin={handleLogin} t={t} bp={bp}/></>;

  const showSidebar=bp.desktop||bp.tablet;

  return (
    <>
      <GlobalStyles/>
      <div style={{fontFamily:"'DM Sans',sans-serif",background:t.bg,minHeight:"100vh",display:"flex",color:t.ink,transition:"background 0.25s,color 0.25s",position:"relative"}}>

        {/* ── Sidebar (tablet+desktop) ── */}
        {showSidebar && (
          <aside style={{width:bp.tablet?64:168,height:"100vh",background:t.green,display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,overflowY:"auto",overflowX:"hidden"}}>
            {/* Logo */}
            <div onClick={()=>navigate("dashboard")} style={{padding:bp.tablet?"20px 0":"28px 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",textAlign:bp.tablet?"center":"left",cursor:"pointer"}}>
              {bp.tablet?(
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>VV</div>
              ):(
                <>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>VetVault</div>
                  <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginTop:4}}>Health Records</div>
                </>
              )}
            </div>

            {/* Pets — full sidebar only */}
            {!bp.tablet && (
              <div style={{padding:"16px 12px 8px"}}>
                <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",padding:"0 8px",marginBottom:6,fontWeight:500}}>Your Pets</div>
                {pets.map(p=>(
                  <div key={p.id} onClick={()=>{setActivePetId(p.id);setPage("dashboard");}}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:9,cursor:"pointer",marginBottom:2,transition:"background 0.18s",background:activePetId===p.id?"rgba(255,255,255,0.13)":"transparent"}}
                    onMouseEnter={e=>{if(activePetId!==p.id)e.currentTarget.style.background="rgba(255,255,255,0.07)";}}
                    onMouseLeave={e=>{if(activePetId!==p.id)e.currentTarget.style.background="transparent";}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:t.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:600,color:t.green,flexShrink:0}}>{initials(p.name)}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.9)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.breed}</div>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setShowAddPet(true)} style={{margin:"4px 0 0",padding:"7px 10px",borderRadius:9,border:"1px dashed rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6,width:"100%",transition:"all 0.18s"}}
                  onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)";e.currentTarget.style.borderColor="rgba(255,255,255,0.35)";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.45)";e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";}}>
                  <Icon name="plus" size={13} color="currentColor"/> Add pet
                </button>
              </div>
            )}

            {/* Nav */}
            <nav style={{padding:bp.tablet?"8px 0":"16px 12px 0",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:bp.tablet?0:8,flex:1,overflowY:"auto",minHeight:0}}>
              {!bp.tablet&&<div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",padding:"0 8px",marginBottom:6,fontWeight:500}}>Navigation</div>}
              {navItems.map(n=>(
                <div key={n.id} onClick={()=>navigate(n.id)}
                  style={{display:"flex",alignItems:"center",gap:bp.tablet?0:8,padding:bp.tablet?"12px 0":"9px 10px",justifyContent:bp.tablet?"center":"flex-start",borderRadius:bp.tablet?0:9,cursor:"pointer",marginBottom:2,transition:"all 0.18s",background:page===n.id?"rgba(255,255,255,0.13)":"transparent",color:page===n.id?"#fff":"rgba(255,255,255,0.55)",fontWeight:page===n.id?500:400,fontSize:13,width:"100%",border:"none"}}
                  onMouseEnter={e=>{if(page!==n.id){e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.85)";}}}
                  onMouseLeave={e=>{if(page!==n.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}}
                  title={bp.tablet?n.label:""}>
                  <Icon name={n.icon} size={bp.tablet?20:16} color="currentColor"/>
                  {!bp.tablet&&<span>{n.label}</span>}
                </div>
              ))}
            </nav>
            <div style={{padding:bp.tablet?"8px 0 12px":"8px 12px 16px",borderTop:"1px solid rgba(255,255,255,0.08)",flexShrink:0,textAlign:bp.tablet?"center":"left"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:1}}>v1.0</div>
            </div>
          </aside>
        )}

        {/* ── Mobile top bar ── */}
        {bp.mobile && (
          <div style={{position:"fixed",top:0,left:0,right:0,height:56,background:t.green,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",zIndex:60,boxShadow:`0 2px 8px ${t.shadow}`}}>
            <div onClick={()=>navigate("dashboard")} style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#fff",cursor:"pointer"}}>VetVault</div>
            <button onClick={()=>setDrawerOpen(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",padding:4}}>
              <Icon name={drawerOpen?"x":"menu"} size={22} color="#fff"/>
            </button>
          </div>
        )}

        {/* ── Mobile drawer ── */}
        {bp.mobile && drawerOpen && (
          <>
            <div onClick={()=>setDrawerOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:70,animation:"fadeIn 0.2s ease"}}/>
            <div style={{position:"fixed",top:0,right:0,bottom:0,width:260,background:t.green,zIndex:80,display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease",overflowY:"auto"}}>
              <div style={{padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div onClick={()=>navigate("dashboard")} style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#fff",cursor:"pointer"}}>VetVault</div>
                <button onClick={()=>setDrawerOpen(false)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}>
                  <Icon name="x" size={20} color="rgba(255,255,255,0.7)"/>
                </button>
              </div>
              <div style={{padding:"16px 16px 8px"}}>
                <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:8,fontWeight:500}}>Your Pets</div>
                {pets.map(p=>(
                  <div key={p.id} onClick={()=>{setActivePetId(p.id);navigate("dashboard");}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderRadius:10,cursor:"pointer",marginBottom:2,background:activePetId===p.id?"rgba(255,255,255,0.13)":"transparent"}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:t.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:t.green,flexShrink:0}}>{initials(p.name)}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.9)"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{p.breed}</div>
                    </div>
                  </div>
                ))}
                <button onClick={()=>{setShowAddPet(true);setDrawerOpen(false);}} style={{marginTop:4,padding:"8px 10px",borderRadius:10,border:"1px dashed rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6,width:"100%"}}>
                  <Icon name="plus" size={13} color="currentColor"/> Add pet
                </button>
              </div>
              <nav style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.08)",flex:1}}>
                <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:8,fontWeight:500}}>Navigation</div>
                {navItems.map(n=>(
                  <div key={n.id} onClick={()=>navigate(n.id)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 10px",borderRadius:10,cursor:"pointer",marginBottom:2,background:page===n.id?"rgba(255,255,255,0.13)":"transparent",color:page===n.id?"#fff":"rgba(255,255,255,0.6)",fontSize:14,fontWeight:page===n.id?500:400}}>
                    <Icon name={n.icon} size={17} color="currentColor"/>
                    {n.label}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* ── Main content ── */}
        <main style={{
          flex:1, overflowY:"auto",
          padding: bp.mobile ? "72px 16px 32px" : bp.tablet ? "32px 28px 32px" : "36px 44px 40px",
          minHeight:"100vh",
        }}>
          {page==="dashboard" && <Dashboard pets={pets} onNavigate={navigate} activePetId={activePetId} setActivePetId={setActivePetId} t={t} bp={bp} userName={userName} onAddPet={()=>setShowAddPet(true)}/>}
          {page==="profile"   && pet && <PetProfile   pet={pet} t={t} bp={bp}/>}
          {page==="records"   && pet && <Records       pet={pet} t={t} bp={bp}/>}
          {page==="ai"        && pet && <AIChecker     pet={pet} t={t} bp={bp}/>}
          {page==="documents" && pet && <Documents     pet={pet} t={t} bp={bp}/>}
          {page==="settings"  && <Settings      t={t} dark={dark} setDark={setDark} onLogout={handleLogout} userName={userName} bp={bp}/>}
          {["profile","records","ai","documents"].includes(page) && !pet && (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16,textAlign:"center",padding:32}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.ink}}>No pets yet</div>
              <div style={{fontSize:14,color:t.inkLight,maxWidth:280}}>Add your first pet to view this section.</div>
              <button onClick={()=>setShowAddPet(true)} style={{...S.btnPrimary(t),marginTop:4}}>Add Your First Pet</button>
            </div>
          )}
        </main>
      </div>
      {showAddPet&&<AddPetModal onClose={()=>setShowAddPet(false)} onAdd={p=>setPets(prev=>[...prev,p])} t={t}/>}
    </>
  );
}
