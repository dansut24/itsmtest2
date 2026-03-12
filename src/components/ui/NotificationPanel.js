// src/components/ui/NotificationPanel.js
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Bell, X, AlertCircle, Clock, CheckCircle2, AlertTriangle, Flame, Zap, Check, Trash2, ChevronRight } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  { id:"n1", type:"critical", read:false, title:"SLA Breach Imminent", body:"INC-0042 VPN access failure is 15 min from breach", time:"2 min ago", href:"/incidents/42" },
  { id:"n2", type:"incident", read:false, title:"Critical Incident Raised", body:"INC-0051 Core switch failure affecting 3 floors", time:"8 min ago", href:"/incidents/51" },
  { id:"n3", type:"approval", read:false, title:"Change Approval Required", body:"CHG-0019 Emergency patch deployment needs sign-off", time:"22 min ago", href:"/approvals" },
  { id:"n4", type:"resolved", read:false, title:"Incident Resolved", body:"INC-0038 Email server connectivity restored by James T.", time:"1 hr ago", href:"/incidents/38" },
  { id:"n5", type:"warning",  read:true,  title:"High CPU on PROD-DB-02", body:"Asset PROD-DB-02 above 90% CPU for 20+ minutes", time:"2 hr ago", href:"/assets" },
  { id:"n6", type:"resolved", read:true,  title:"Service Request Fulfilled", body:"SR-2108 New laptop provisioned for Alex M.", time:"3 hr ago", href:"/service-requests" },
  { id:"n7", type:"approval", read:true,  title:"Change Approved", body:"CHG-3005 Firewall rule update approved by Emma L.", time:"4 hr ago", href:"/changes" },
];

const TYPE_CFG = {
  critical: { icon:<Flame size={14}/>,  color:"#ef4444", bg:"rgb(239 68 68/0.12)", label:"Critical" },
  incident: { icon:<AlertCircle size={14}/>, color:"#f97316", bg:"rgb(249 115 22/0.12)", label:"Incident" },
  approval: { icon:<Clock size={14}/>,  color:"#eab308", bg:"rgb(234 179 8/0.12)",  label:"Approval" },
  resolved: { icon:<CheckCircle2 size={14}/>, color:"#22c55e", bg:"rgb(34 197 94/0.12)", label:"Resolved" },
  warning:  { icon:<AlertTriangle size={14}/>, color:"#f97316", bg:"rgb(249 115 22/0.12)", label:"Warning" },
  sla:      { icon:<Zap size={14}/>,    color:"#ff4fe1", bg:"rgb(255 79 225/0.12)", label:"SLA" },
};

export default function NotificationPanel() {
  const navigate = useNavigate();
  const [notifs, setNotifs]   = useState(MOCK_NOTIFICATIONS);
  const [open,   setOpen]     = useState(false);
  const [animating,setAnimating] = useState(false);
  const btnRef   = useRef(null);
  const panelRef = useRef(null);
  const unread   = notifs.filter(n=>!n.read).length;

  function toggle() {
    if (open) { setAnimating(false); setTimeout(()=>setOpen(false),180); }
    else { setOpen(true); setTimeout(()=>setAnimating(true),10); }
  }

  function markRead(id) { setNotifs(ns=>ns.map(n=>n.id===id?{...n,read:true}:n)); }
  function markAllRead() { setNotifs(ns=>ns.map(n=>({...n,read:true}))); }
  function dismiss(id,e) { e.stopPropagation(); setNotifs(ns=>ns.filter(n=>n.id!==id)); }

  function handleClick(notif) {
    markRead(notif.id);
    setAnimating(false);
    setTimeout(()=>{ setOpen(false); navigate(notif.href); },100);
  }

  useEffect(()=>{
    if(!open) return;
    function onOutside(e) {
      if(panelRef.current&&!panelRef.current.contains(e.target)&&btnRef.current&&!btnRef.current.contains(e.target)) {
        setAnimating(false); setTimeout(()=>setOpen(false),180);
      }
    }
    document.addEventListener("mousedown",onOutside);
    return ()=>document.removeEventListener("mousedown",onOutside);
  },[open]);

  return (
    <>
      <button ref={btnRef} id="hi5-notif-btn" type="button" onClick={toggle}
        aria-label={`Notifications${unread>0?`, ${unread} unread`:""}` }
        className="hi5-btn-ghost no-min-touch"
        style={{height:42,width:42,padding:0,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
        <Bell size={17}/>
        {unread>0&&(
          <span style={{position:"absolute",top:6,right:6,width:16,height:16,borderRadius:"50%",
            background:"#ef4444",color:"#fff",fontSize:9,fontWeight:800,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 0 2px rgb(var(--hi5-card))",
            animation:"hi5-bell-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
            {unread>9?"9+":unread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes hi5-bell-pop{from{transform:scale(0)}to{transform:scale(1)}}
      `}</style>

      {open && createPortal(
        <div ref={panelRef} style={{
          position:"fixed", zIndex:900,
          top:68, right:12,
          width:360, maxWidth:"calc(100vw - 24px)",
          maxHeight:"70vh",
          background:"rgb(var(--hi5-card)/0.97)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgb(var(--hi5-border)/0.18)",
          borderRadius:18,
          boxShadow:"0 20px 60px rgb(0 0 0/0.20), 0 4px 16px rgb(0 0 0/0.10)",
          display:"flex", flexDirection:"column", overflow:"hidden",
          transition:"opacity 180ms ease, transform 180ms cubic-bezier(0.34,1.20,0.64,1)",
          opacity:animating?1:0,
          transform:animating?"translateY(0) scale(1)":"translateY(-8px) scale(0.97)",
        }}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 12px",borderBottom:"1px solid rgb(var(--hi5-border)/0.10)"}}>
            <div>
              <div style={{fontWeight:800,fontSize:14}}>Notifications</div>
              {unread>0&&<div style={{fontSize:11,color:"#ef4444",fontWeight:600,marginTop:1}}>{unread} unread</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              {unread>0&&(
                <button type="button" onClick={markAllRead}
                  style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:8,border:"1px solid rgb(var(--hi5-border)/0.15)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <Check size={11}/> All read
                </button>
              )}
              <button type="button" onClick={toggle}
                className="hi5-btn-ghost no-min-touch"
                style={{width:28,height:28,padding:0,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <X size={14}/>
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{overflowY:"auto",flex:1}}>
            {notifs.length===0?(
              <div style={{padding:"40px 16px",textAlign:"center",opacity:0.40}}>
                <div style={{fontSize:28,marginBottom:8}}>🔔</div>
                <div style={{fontSize:13}}>All caught up!</div>
              </div>
            ):notifs.map(n=>{
              const cfg=TYPE_CFG[n.type]||TYPE_CFG.incident;
              return (
                <div key={n.id}
                  onClick={()=>handleClick(n)}
                  style={{
                    display:"flex",gap:10,padding:"12px 16px",cursor:"pointer",
                    background:n.read?"transparent":"rgb(var(--hi5-accent)/0.03)",
                    borderLeft:n.read?"3px solid transparent":"3px solid "+cfg.color,
                    borderBottom:"1px solid rgb(var(--hi5-border)/0.07)",
                    transition:"background 120ms",
                    position:"relative",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgb(var(--hi5-accent)/0.05)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=n.read?"transparent":"rgb(var(--hi5-accent)/0.03)";}}
                >
                  <div style={{width:32,height:32,borderRadius:10,flexShrink:0,background:cfg.bg,border:"1px solid "+cfg.color+"30",color:cfg.color,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                    {cfg.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                      <div style={{fontSize:13,fontWeight:n.read?500:700,lineHeight:1.3}}>{n.title}</div>
                      {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:"rgb(var(--hi5-accent))",flexShrink:0,marginTop:3}}/>}
                    </div>
                    <div style={{fontSize:12,opacity:0.55,marginTop:3,lineHeight:1.4}}>{n.body}</div>
                    <div style={{fontSize:11,opacity:0.35,marginTop:4}}>{n.time}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <ChevronRight size={12} style={{opacity:0.25}}/>
                    <button type="button" onClick={e=>dismiss(n.id,e)}
                      style={{background:"none",border:"none",cursor:"pointer",opacity:0,padding:2,display:"flex",transition:"opacity 120ms"}}
                      className="notif-dismiss"
                    ><Trash2 size={11}/></button>
                  </div>
                </div>
              );
            })}
          </div>
          <style>{`.notif-dismiss:hover{opacity:0.5 !important} div:hover .notif-dismiss{opacity:0.25 !important}`}</style>
        </div>,
        document.body
      )}
    </>
  );
}
