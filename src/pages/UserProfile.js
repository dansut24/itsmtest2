// src/pages/UserProfile.js
import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Shield, Clock, Edit2, Check } from "lucide-react";
import { Card, PageHeader, Avatar, StatCard } from "../components/ui/PageHeader";

export default function UserProfile() {
  const storedUser = (() => { try { return JSON.parse(sessionStorage.getItem("user")||"{}"); } catch { return {}; } })();
  const name = storedUser.name || storedUser.username || "Demo User";
  const role = storedUser.role || "Administrator";
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({ displayName:name, email:"user@hi5tech.co.uk", phone:"+44 20 1234 5678", location:"London, UK", bio:"ITSM professional managing service desk operations." });
  const [saved,setSaved]=useState(false);
  function save(){setSaved(true);setEditing(false);setTimeout(()=>setSaved(false),2000);}
  const ACTIVITY = [
    {label:"Resolved INC-2041",time:"2 hours ago",icon:"✅"},
    {label:"Updated CHG-3012",time:"5 hours ago",icon:"✏️"},
    {label:"Commented on PRB-4003",time:"Yesterday",icon:"💬"},
    {label:"Approved SR-2108",time:"2 days ago",icon:"👍"},
    {label:"Created KB-6021",time:"3 days ago",icon:"📝"},
  ];
  const ROLES_MAP = { admin:"Administrator", itsm:"ITSM Agent", selfservice:"Self Service", control:"Control Engineer" };
  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your account and preferences"/>
      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        {/* Profile card */}
        <Card style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:24}}>
          <div style={{position:"relative"}}>
            <Avatar name={name} size={72}/>
            <div style={{position:"absolute",bottom:0,right:0,width:22,height:22,borderRadius:"50%",background:"rgb(0 193 255)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgb(var(--hi5-card))"}}>
              <Edit2 size={10} color="#fff"/>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontWeight:800,fontSize:16,letterSpacing:"-0.02em"}}>{name}</div>
            <div style={{fontSize:12,opacity:0.50,marginTop:3}}>{role}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
            {(storedUser.roles||["itsm"]).map(r=>(
              <span key={r} style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:"rgb(var(--hi5-accent)/0.10)",color:"rgb(var(--hi5-accent))"}}>
                {ROLES_MAP[r]||r}
              </span>
            ))}
          </div>
          <div style={{width:"100%",borderTop:"1px solid rgb(var(--hi5-border)/0.10)",paddingTop:12,display:"flex",flexDirection:"column",gap:8}}>
            {[{icon:<Mail size={13}/>,val:form.email},{icon:<Phone size={13}/>,val:form.phone},{icon:<MapPin size={13}/>,val:form.location}].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,opacity:0.60}}>
                {item.icon}<span>{item.val}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* Details */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            <StatCard label="Incidents Handled" value="142" icon={<Shield size={18}/>} color="#00c1ff"/>
            <StatCard label="Avg Response" value="1.8h" icon={<Clock size={18}/>} color="#22c55e"/>
            <StatCard label="CSAT Score" value="94%" icon={<User size={18}/>} color="#6366f1" trend={{up:true,label:"+2%"}}/>
          </div>
          <Card>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:15}}>Personal Information</div>
              <button type="button" onClick={()=>editing?save():setEditing(true)}
                className="hi5-btn-ghost no-min-touch"
                style={{height:32,padding:"0 12px",borderRadius:9,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                {editing?<><Check size={12}/>Save</>:<><Edit2 size={12}/>Edit</>}
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
              {[{label:"Display Name",key:"displayName"},{label:"Email Address",key:"email"},{label:"Phone",key:"phone"},{label:"Location",key:"location"}].map(f=>(
                <div key={f.key}>
                  <div style={{fontSize:11,fontWeight:700,opacity:0.45,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:5}}>{f.label}</div>
                  {editing
                    ?<input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",height:34,padding:"0 10px",borderRadius:9,border:"1px solid rgb(var(--hi5-border)/0.20)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none"}}/>
                    :<div style={{fontSize:13,fontWeight:500}}>{form[f.key]}</div>}
                </div>
              ))}
              <div style={{gridColumn:"1/-1"}}>
                <div style={{fontSize:11,fontWeight:700,opacity:0.45,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:5}}>Bio</div>
                {editing
                  ?<textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} style={{width:"100%",height:72,padding:"8px 10px",borderRadius:9,border:"1px solid rgb(var(--hi5-border)/0.20)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none",resize:"none"}}/>
                  :<div style={{fontSize:13,opacity:0.65}}>{form.bio}</div>}
              </div>
            </div>
          </Card>
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Recent Activity</div>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {ACTIVITY.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<ACTIVITY.length-1?"1px solid rgb(var(--hi5-border)/0.07)":"none"}}>
                  <div style={{width:32,height:32,borderRadius:10,background:"rgb(var(--hi5-border)/0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{a.icon}</div>
                  <div style={{flex:1,fontSize:13}}>{a.label}</div>
                  <div style={{fontSize:11,opacity:0.40,whiteSpace:"nowrap"}}>{a.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
