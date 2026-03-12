// src/pages/SelfService/SelfServiceHome.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, AlertCircle, ClipboardList, ShoppingBag, Search, ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";
import { KB_ARTICLES } from "../../data/mockData";

const QUICK_ACTIONS = [
  { icon:<AlertCircle size={22}/>, label:"Report an Issue",   sub:"Something is broken or not working",   href:"/self-service/raise-incident", color:"#ef4444" },
  { icon:<ClipboardList size={22}/>, label:"Raise a Request", sub:"Request access, hardware or software",  href:"/self-service/raise-request",  color:"#3b82f6" },
  { icon:<ShoppingBag size={22}/>, label:"Service Catalogue", sub:"Browse all available IT services",      href:"/self-service/catalog",        color:"#6366f1" },
  { icon:<BookOpen size={22}/>, label:"Knowledge Base",       sub:"Find answers in our help articles",     href:"/self-service/knowledge-base",  color:"#00c1ff" },
];

const POPULAR = KB_ARTICLES.filter(a=>a.status==="Published").slice(0,4);

export default function SelfServiceHome(){
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div>
      {/* Hero */}
      <div style={{textAlign:"center",padding:"40px 16px 32px",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(800px 300px at 50% 0%,rgb(0 193 255/0.08),transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <h1 style={{fontSize:"clamp(24px,5vw,38px)",fontWeight:900,letterSpacing:"-0.04em",margin:"0 0 10px",lineHeight:1.1}}>
            How can we help?
          </h1>
          <p style={{fontSize:15,opacity:0.55,margin:"0 0 28px",lineHeight:1.6}}>
            Search our knowledge base or choose an option below
          </p>
          {/* Search */}
          <div style={{maxWidth:480,margin:"0 auto",position:"relative"}}>
            <Search size={16} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",opacity:0.35,pointerEvents:"none"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search for help articles, services..."
              onKeyDown={e=>{if(e.key==="Enter"&&search.trim()) navigate("/self-service/knowledge-base");}}
              style={{width:"100%",height:48,paddingLeft:44,paddingRight:16,borderRadius:16,fontSize:14,
                background:"rgb(var(--hi5-card)/0.90)",border:"1px solid rgb(var(--hi5-border)/0.20)",
                color:"rgb(var(--hi5-fg))",outline:"none",boxSizing:"border-box",
                boxShadow:"0 4px 20px rgb(0 0 0/0.08)",backdropFilter:"blur(12px)"}}
              onFocus={e=>e.target.style.borderColor="rgb(var(--hi5-accent)/0.40)"}
              onBlur={e=>e.target.style.borderColor="rgb(var(--hi5-border)/0.20)"}/>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:32}}>
        {QUICK_ACTIONS.map(qa=>(
          <button key={qa.href} type="button" onClick={()=>navigate(qa.href)}
            style={{textAlign:"left",padding:"20px",borderRadius:16,border:"1px solid rgb(var(--hi5-border)/0.12)",
              background:"rgb(var(--hi5-card)/0.80)",cursor:"pointer",transition:"all 160ms",backdropFilter:"blur(8px)"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgb(0 0 0/0.10)";e.currentTarget.style.borderColor=qa.color+"40";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor="rgb(var(--hi5-border)/0.12)";}}>
            <div style={{width:44,height:44,borderRadius:12,background:qa.color+"15",border:"1px solid "+qa.color+"25",color:qa.color,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>{qa.icon}</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{qa.label}</div>
            <div style={{fontSize:12,opacity:0.50,lineHeight:1.4}}>{qa.sub}</div>
            <div style={{marginTop:10,display:"flex",alignItems:"center",gap:4,fontSize:12,color:qa.color,fontWeight:600}}>
              Get started<ArrowRight size={12}/>
            </div>
          </button>
        ))}
      </div>

      {/* Status banner */}
      <div style={{padding:"12px 16px",borderRadius:14,background:"rgb(34 197 94/0.08)",border:"1px solid rgb(34 197 94/0.18)",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
        <CheckCircle2 size={16} style={{color:"#22c55e",flexShrink:0}}/>
        <div style={{fontSize:13,fontWeight:600,color:"#22c55e"}}>All systems operational</div>
        <div style={{fontSize:12,opacity:0.55,marginLeft:4}}>· Last checked 2 minutes ago</div>
        <Zap size={12} style={{color:"#22c55e",marginLeft:"auto",flexShrink:0}}/>
      </div>

      {/* Popular articles */}
      <div>
        <div style={{fontSize:14,fontWeight:800,letterSpacing:"-0.02em",marginBottom:12}}>Popular Articles</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {POPULAR.map(art=>(
            <button key={art.id} type="button" onClick={()=>navigate("/self-service/knowledge-base")}
              style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,border:"1px solid rgb(var(--hi5-border)/0.10)",background:"rgb(var(--hi5-card)/0.70)",cursor:"pointer",textAlign:"left",transition:"all 130ms"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgb(var(--hi5-accent)/0.04)";e.currentTarget.style.borderColor="rgb(var(--hi5-accent)/0.20)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgb(var(--hi5-card)/0.70)";e.currentTarget.style.borderColor="rgb(var(--hi5-border)/0.10)";}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgb(var(--hi5-accent)/0.08)",border:"1px solid rgb(var(--hi5-accent)/0.15)",color:"rgb(var(--hi5-accent))",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={15}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{art.title}</div>
                <div style={{fontSize:11,opacity:0.45,marginTop:2,display:"flex",alignItems:"center",gap:8}}>
                  <span>{art.category}</span>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Clock size={10}/>{art.views.toLocaleString()} views</span>
                </div>
              </div>
              <ArrowRight size={14} style={{opacity:0.30,flexShrink:0}}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
