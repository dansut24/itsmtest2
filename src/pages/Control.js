// src/pages/Control.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Wifi, Server, Cpu, HardDrive, AlertTriangle, Activity, RefreshCw, Terminal, Shield, Zap, ArrowLeft } from "lucide-react";

const DEVICES = [
  { id:"dev-01", name:"WSRV-PROD-01", type:"Server",  os:"Windows Server 2022", ip:"10.0.1.10", status:"Online",  cpu:78, ram:65, disk:45, lastSeen:"just now" },
  { id:"dev-02", name:"WSRV-PROD-02", type:"Server",  os:"Windows Server 2022", ip:"10.0.1.11", status:"Online",  cpu:22, ram:48, disk:72, lastSeen:"1 min ago" },
  { id:"dev-03", name:"LNSRV-DB-01",  type:"Server",  os:"Ubuntu 22.04 LTS",   ip:"10.0.1.20", status:"Alert",   cpu:95, ram:88, disk:82, lastSeen:"just now", alert:"High CPU" },
  { id:"dev-04", name:"FW-EDGE-01",   type:"Firewall",os:"PfSense 2.7",        ip:"10.0.0.1",  status:"Online",  cpu:14, ram:32, disk:18, lastSeen:"2 min ago" },
  { id:"dev-05", name:"SW-CORE-01",   type:"Switch",  os:"Cisco IOS 17.3",     ip:"10.0.0.2",  status:"Online",  cpu:8,  ram:24, disk:12, lastSeen:"3 min ago" },
  { id:"dev-06", name:"LAPTOP-SM-01", type:"Laptop",  os:"Windows 11 Pro",     ip:"10.0.2.54", status:"Online",  cpu:34, ram:55, disk:61, lastSeen:"5 min ago" },
  { id:"dev-07", name:"LAPTOP-JT-01", type:"Laptop",  os:"macOS 14.2",         ip:"10.0.2.30", status:"Offline", cpu:0,  ram:0,  disk:58, lastSeen:"2 hr ago" },
  { id:"dev-08", name:"PRINT-FL3-01", type:"Printer", os:"Brother Firmware",   ip:"10.0.3.10", status:"Offline", cpu:0,  ram:0,  disk:5,  lastSeen:"1 day ago" },
];

function MetricBar({ value, warn = 70, crit = 90 }) {
  const color = value >= crit ? "#ef4444" : value >= warn ? "#f97316" : "#22c55e";
  return (
    <div style={{ width:"100%", height:5, borderRadius:3, background:"rgb(var(--hi5-border)/0.12)", overflow:"hidden" }}>
      <div style={{ width:value+"%", height:"100%", borderRadius:3, background:color, transition:"width 500ms ease" }}/>
    </div>
  );
}

const STATUS_CFG = {
  Online:  { color:"#22c55e", bg:"rgb(34 197 94/0.10)",   dot:"#22c55e"  },
  Offline: { color:"#94a3b8", bg:"rgb(148 163 184/0.10)", dot:"#94a3b8"  },
  Alert:   { color:"#ef4444", bg:"rgb(239 68 68/0.10)",   dot:"#ef4444", blink:true },
};

const TYPE_ICON = { Server:<Server size={14}/>, Firewall:<Shield size={14}/>, Switch:<Wifi size={14}/>, Laptop:<Monitor size={14}/>, Printer:<HardDrive size={14}/> };

export default function Control() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(()=>{ const t=setInterval(()=>setTick(n=>n+1),5000); return ()=>clearInterval(t); },[]);

  function refresh() { setRefreshing(true); setTimeout(()=>setRefreshing(false),1200); }

  const filtered = filter==="All" ? DEVICES : DEVICES.filter(d=>d.status===filter);
  const stats = { total:DEVICES.length, online:DEVICES.filter(d=>d.status==="Online").length, alert:DEVICES.filter(d=>d.status==="Alert").length, offline:DEVICES.filter(d=>d.status==="Offline").length };

  return (
    <div>
      <style>{`
        @keyframes hi5-page-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes status-blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* Header */}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
            <div style={{ width:32,height:32,borderRadius:9,background:"rgb(255 196 45/0.15)",border:"1px solid rgb(255 196 45/0.30)",color:"#ffc42d",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Activity size={15}/>
            </div>
            <h1 style={{ fontSize:22,fontWeight:800,letterSpacing:"-0.03em",margin:0 }}>Control</h1>
            <span style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:"rgb(255 196 45/0.12)",color:"#ffc42d",border:"1px solid rgb(255 196 45/0.25)" }}>RMM</span>
          </div>
          <p style={{ fontSize:13,opacity:0.45,margin:0 }}>Remote monitoring and device management</p>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button type="button" onClick={refresh}
            className="hi5-btn-ghost no-min-touch"
            style={{ height:36,padding:"0 14px",borderRadius:10,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6 }}>
            <RefreshCw size={14} style={{ animation:refreshing?"spin 0.8s linear infinite":"none" }}/> Refresh
          </button>
          <button type="button" onClick={()=>navigate("/dashboard")}
            className="hi5-btn-ghost no-min-touch"
            style={{ height:36,padding:"0 14px",borderRadius:10,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6 }}>
            <ArrowLeft size={14}/> ITSM
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20 }}>
        {[
          { label:"Total Devices",  value:stats.total,   color:"#00c1ff", Icon:Monitor },
          { label:"Online",         value:stats.online,  color:"#22c55e", Icon:Wifi },
          { label:"Alerting",       value:stats.alert,   color:"#ef4444", Icon:AlertTriangle },
          { label:"Offline",        value:stats.offline, color:"#94a3b8", Icon:Activity },
        ].map(s=>(
          <div key={s.label} className="hi5-card" style={{ padding:"14px 16px",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:10,background:s.color+"18",border:"1px solid "+s.color+"30",color:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <s.Icon size={16}/>
            </div>
            <div>
              <div style={{ fontSize:22,fontWeight:800,letterSpacing:"-0.04em",color:s.color,lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11,opacity:0.50,marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex",gap:6,marginBottom:14 }}>
        {["All","Online","Alert","Offline"].map(f=>(
          <button key={f} type="button" onClick={()=>setFilter(f)}
            style={{ fontSize:12,fontWeight:filter===f?700:500,padding:"5px 12px",borderRadius:9999,border:filter===f?"1px solid rgb(var(--hi5-accent)/0.40)":"1px solid rgb(var(--hi5-border)/0.15)",background:filter===f?"rgb(var(--hi5-accent)/0.10)":"transparent",color:filter===f?"rgb(var(--hi5-accent))":"rgb(var(--hi5-fg)/0.60)",cursor:"pointer",transition:"all 130ms" }}>
            {f} {f==="Alert"&&stats.alert>0&&<span style={{ marginLeft:4,background:"#ef4444",color:"#fff",fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:9999 }}>{stats.alert}</span>}
          </button>
        ))}
      </div>

      {/* Device grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12 }}>
        {filtered.map(dev=>{
          const cfg=STATUS_CFG[dev.status]||STATUS_CFG.Online;
          return (
            <div key={dev.id} className="hi5-card" style={{ padding:"16px",position:"relative",overflow:"hidden" }}>
              {dev.alert&&(
                <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#ef4444,#f97316)" }}/>
              )}
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                  <div style={{ width:34,height:34,borderRadius:10,background:"rgb(var(--hi5-border)/0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgb(var(--hi5-fg)/0.50)" }}>
                    {TYPE_ICON[dev.type]||<Monitor size={14}/>}
                  </div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:13 }}>{dev.name}</div>
                    <div style={{ fontSize:11,opacity:0.40,fontFamily:"monospace" }}>{dev.ip}</div>
                  </div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
                  <span style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:cfg.bg,color:cfg.color,display:"flex",alignItems:"center",gap:4 }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:cfg.dot,flexShrink:0,animation:cfg.blink?"status-blink 1.2s ease infinite":"none" }}/>
                    {dev.status}
                  </span>
                  {dev.alert&&<span style={{ fontSize:10,fontWeight:700,color:"#ef4444" }}>{dev.alert}</span>}
                </div>
              </div>
              <div style={{ fontSize:11,opacity:0.40,marginBottom:12 }}>{dev.os}</div>
              {dev.status!=="Offline"&&(
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  {[{label:"CPU",val:dev.cpu},{label:"RAM",val:dev.ram},{label:"Disk",val:dev.disk}].map(m=>(
                    <div key={m.label} style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontSize:11,fontWeight:600,opacity:0.45,width:30,flexShrink:0 }}>{m.label}</span>
                      <div style={{ flex:1 }}><MetricBar value={m.val}/></div>
                      <span style={{ fontSize:11,fontWeight:700,width:32,textAlign:"right",color:m.val>=90?"#ef4444":m.val>=70?"#f97316":undefined }}>{m.val}%</span>
                    </div>
                  ))}
                </div>
              )}
              {dev.status==="Offline"&&<div style={{ fontSize:12,opacity:0.40,padding:"8px 0" }}>Last seen: {dev.lastSeen}</div>}
              <div style={{ display:"flex",gap:6,marginTop:14 }}>
                <button type="button" className="hi5-btn-ghost no-min-touch"
                  style={{ flex:1,height:30,borderRadius:8,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
                  <Terminal size={11}/> Remote
                </button>
                <button type="button" className="hi5-btn-ghost no-min-touch"
                  style={{ flex:1,height:30,borderRadius:8,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
                  <Zap size={11}/> Action
                </button>
                <button type="button" className="hi5-btn-ghost no-min-touch"
                  style={{ flex:1,height:30,borderRadius:8,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
                  <Cpu size={11}/> Metrics
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
