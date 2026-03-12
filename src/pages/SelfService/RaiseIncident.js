// src/pages/SelfService/RaiseIncident.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["Hardware","Network","Software","Access","Email","Other"];

export default function RaiseIncident() {
  const navigate = useNavigate();
  const [form,setForm] = useState({ title:"",category:"",priority:"Medium",description:"" });
  const [submitted,setSubmitted] = useState(false);
  const [incRef] = useState("INC-" + (2100 + Math.floor(Math.random()*100)));
  function set(k,v){setForm(f=>({...f,[k]:v}));}
  function submit(e){e.preventDefault();if(form.title&&form.category)setSubmitted(true);}
  if(submitted) return (
    <div style={{ textAlign:"center",padding:"60px 0",animation:"hi5-page-in 300ms ease both" }}>
      <style>{`@keyframes hi5-page-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width:64,height:64,borderRadius:"50%",background:"rgb(34 197 94/0.12)",border:"2px solid rgb(34 197 94/0.30)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#22c55e" }}><CheckCircle2 size={28}/></div>
      <h2 style={{ fontSize:22,fontWeight:800,letterSpacing:"-0.03em",margin:"0 0 8px" }}>Incident Raised</h2>
      <div style={{ fontSize:13,fontFamily:"monospace",fontWeight:700,color:"rgb(var(--hi5-accent))",margin:"0 0 8px" }}>{incRef}</div>
      <p style={{ fontSize:13,opacity:0.50,margin:"0 0 28px" }}>Our team has been notified and will respond shortly.</p>
      <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
        <button type="button" onClick={()=>navigate("/self-service")} style={{ padding:"10px 20px",borderRadius:10,border:"1px solid rgb(var(--hi5-border)/0.18)",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:600 }}>Back to Home</button>
        <button type="button" onClick={()=>setSubmitted(false)} style={{ padding:"10px 20px",borderRadius:10,border:"none",background:"rgb(var(--hi5-accent))",color:"#000",cursor:"pointer",fontSize:13,fontWeight:700 }}>Report Another</button>
      </div>
    </div>
  );
  const inputStyle = { width:"100%",height:40,padding:"0 12px",borderRadius:10,border:"1px solid rgb(var(--hi5-border)/0.18)",background:"rgb(var(--hi5-card)/0.85)",fontSize:13,outline:"none",color:"rgb(var(--hi5-fg))",backdropFilter:"blur(8px)" };
  const PRIORITIES = [{ k:"Low",color:"#22c55e" },{ k:"Medium",color:"#eab308" },{ k:"High",color:"#f97316" },{ k:"Critical",color:"#ef4444" }];
  return (
    <div style={{ maxWidth:560,margin:"0 auto",animation:"hi5-page-in 300ms ease both" }}>
      <style>{`@keyframes hi5-page-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <button type="button" onClick={()=>navigate("/self-service")} style={{ display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,background:"none",border:"none",cursor:"pointer",opacity:0.55,marginBottom:20,padding:0 }}><ArrowLeft size={14}/> Back</button>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:28 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:"rgb(239 68 68/0.12)",border:"1px solid rgb(239 68 68/0.25)",color:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center" }}><AlertCircle size={20}/></div>
        <div>
          <h1 style={{ fontSize:22,fontWeight:900,letterSpacing:"-0.03em",margin:0 }}>Report an Issue</h1>
          <p style={{ fontSize:12,opacity:0.45,margin:0 }}>Describe the problem and we'll get it resolved.</p>
        </div>
      </div>
      <form onSubmit={submit} style={{ display:"flex",flexDirection:"column",gap:16 }}>
        <div>
          <label style={{ fontSize:12,fontWeight:700,opacity:0.55,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em" }}>What's the issue? *</label>
          <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Cannot connect to VPN" required style={inputStyle}/>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:700,opacity:0.55,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em" }}>Category *</label>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
            {CATEGORIES.map(c=>(
              <button key={c} type="button" onClick={()=>set("category",c)}
                style={{ padding:"10px 8px",borderRadius:10,border:form.category===c?"1px solid rgb(var(--hi5-accent)/0.40)":"1px solid rgb(var(--hi5-border)/0.15)",background:form.category===c?"rgb(var(--hi5-accent)/0.10)":"transparent",cursor:"pointer",fontSize:12,fontWeight:form.category===c?700:500,color:form.category===c?"rgb(var(--hi5-accent))":undefined,transition:"all 130ms" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:700,opacity:0.55,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em" }}>Impact / Priority</label>
          <div style={{ display:"flex",gap:8 }}>
            {PRIORITIES.map(p=>(
              <button key={p.k} type="button" onClick={()=>set("priority",p.k)}
                style={{ flex:1,padding:"8px",borderRadius:10,border:form.priority===p.k?"1px solid "+p.color+"60":"1px solid rgb(var(--hi5-border)/0.15)",background:form.priority===p.k?p.color+"18":"transparent",cursor:"pointer",fontSize:12,fontWeight:form.priority===p.k?700:500,color:form.priority===p.k?p.color:undefined,transition:"all 130ms" }}>
                {p.k}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:700,opacity:0.55,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em" }}>Description</label>
          <textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What happened? When did it start? Who is affected?" rows={4}
            style={{ ...inputStyle,height:"auto",padding:"10px 12px",resize:"vertical" }}/>
        </div>
        <button type="submit" disabled={!form.title||!form.category}
          style={{ height:44,borderRadius:12,border:"none",background:!form.title||!form.category?"rgb(var(--hi5-border)/0.15)":"#ef4444",color:!form.title||!form.category?"rgb(var(--hi5-fg)/0.40)":"#fff",cursor:!form.title||!form.category?"not-allowed":"pointer",fontSize:14,fontWeight:700,transition:"all 150ms" }}>
          Submit Incident
        </button>
      </form>
    </div>
  );
}
