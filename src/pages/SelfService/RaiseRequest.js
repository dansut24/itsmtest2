// src/pages/SelfService/RaiseRequest.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, CheckCircle2, ChevronRight } from "lucide-react";

const REQUEST_TYPES = [
  { key:"hardware",  label:"New Hardware",    sub:"Laptop, monitor, keyboard" },
  { key:"software",  label:"Software Licence",sub:"Install or request a new app" },
  { key:"access",    label:"System Access",   sub:"Permissions, VPN, logins" },
  { key:"account",   label:"Account Request", sub:"New user, password reset" },
  { key:"other",     label:"Other",           sub:"Something not listed above" },
];

export default function RaiseRequest(){
  const navigate = useNavigate();
  const [reqType,setReqType]=useState("");
  const [form,setForm]=useState({title:"",description:"",name:"",email:"",urgency:"Normal"});
  const [submitted,setSubmitted]=useState(false);
  const upd=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const valid=reqType&&form.title.trim()&&form.email.trim();
  const inputStyle={width:"100%",height:38,padding:"0 12px",borderRadius:10,border:"1px solid rgb(var(--hi5-border)/0.18)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none",boxSizing:"border-box",color:"rgb(var(--hi5-fg))",transition:"border-color 150ms"};
  const labelStyle={fontSize:11,fontWeight:700,opacity:0.50,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:5,display:"block"};

  if(submitted) return (
    <div style={{textAlign:"center",padding:"60px 24px",maxWidth:400,margin:"0 auto"}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"rgb(59 130 246/0.12)",border:"2px solid rgb(59 130 246/0.30)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#3b82f6"}}><CheckCircle2 size={28}/></div>
      <h2 style={{fontSize:20,fontWeight:800,margin:"0 0 8px"}}>Request Submitted</h2>
      <p style={{fontSize:14,opacity:0.55,margin:"0 0 24px",lineHeight:1.6}}>Your request has been logged as <strong>SR-{Math.floor(Math.random()*1000)+2100}</strong>. You'll hear back within 2 working days.</p>
      <button type="button" onClick={()=>navigate("/self-service")} className="hi5-btn-primary no-min-touch"
        style={{height:40,padding:"0 20px",borderRadius:12,fontSize:13,fontWeight:700}}>Back to Portal</button>
    </div>
  );

  return (
    <div style={{maxWidth:560,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
        <div style={{width:40,height:40,borderRadius:12,background:"rgb(59 130 246/0.10)",border:"1px solid rgb(59 130 246/0.20)",color:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center"}}><ClipboardList size={20}/></div>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,margin:0}}>Raise a Request</h2>
          <p style={{fontSize:12,opacity:0.45,margin:0}}>Let us know what you need</p>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <label style={labelStyle}>Request Type *</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
            {REQUEST_TYPES.map(rt=>(
              <button key={rt.key} type="button" onClick={()=>setReqType(rt.key)}
                style={{padding:"12px",borderRadius:12,border:reqType===rt.key?"1px solid rgb(var(--hi5-accent)/0.40)":"1px solid rgb(var(--hi5-border)/0.15)",
                  background:reqType===rt.key?"rgb(var(--hi5-accent)/0.08)":"transparent",cursor:"pointer",textAlign:"left",transition:"all 130ms"}}>
                <div style={{fontSize:12,fontWeight:700,color:reqType===rt.key?"rgb(var(--hi5-accent))":undefined}}>{rt.label}</div>
                <div style={{fontSize:11,opacity:0.45,marginTop:2}}>{rt.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Request Title *</label>
          <input value={form.title} onChange={upd("title")} placeholder="Brief description of what you need" style={inputStyle}
            onFocus={e=>e.target.style.borderColor="rgb(var(--hi5-accent)/0.40)"} onBlur={e=>e.target.style.borderColor="rgb(var(--hi5-border)/0.18)"}/>
        </div>
        <div>
          <label style={labelStyle}>Additional Details</label>
          <textarea value={form.description} onChange={upd("description")} rows={3} placeholder="Any extra context or requirements..."
            style={{...inputStyle,height:"auto",padding:"10px 12px",resize:"vertical",lineHeight:1.5,fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor="rgb(var(--hi5-accent)/0.40)"} onBlur={e=>e.target.style.borderColor="rgb(var(--hi5-border)/0.18)"}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input value={form.name} onChange={upd("name")} placeholder="Full name" style={inputStyle}
              onFocus={e=>e.target.style.borderColor="rgb(var(--hi5-accent)/0.40)"} onBlur={e=>e.target.style.borderColor="rgb(var(--hi5-border)/0.18)"}/>
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={form.email} onChange={upd("email")} placeholder="you@company.co.uk" style={inputStyle}
              onFocus={e=>e.target.style.borderColor="rgb(var(--hi5-accent)/0.40)"} onBlur={e=>e.target.style.borderColor="rgb(var(--hi5-border)/0.18)"}/>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
          <button type="button" onClick={()=>valid&&setSubmitted(true)} disabled={!valid}
            className="hi5-btn-primary no-min-touch"
            style={{height:42,padding:"0 24px",borderRadius:12,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,opacity:valid?1:0.45}}>
            Submit Request<ChevronRight size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}
