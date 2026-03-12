// src/components/ui/CommandPalette.js
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search, AlertCircle, LayoutDashboard, ClipboardList,
  GitBranch, AlertTriangle, Monitor, BookOpen, BarChart2,
  ThumbsUp, Settings, User, Plus, Laptop, FileText,
  Zap, ArrowRight,
} from "lucide-react";
import { SERVICE_REQUESTS, CHANGES, PROBLEMS, ASSETS, KB_ARTICLES, APPROVALS } from "../../data/mockData";

// ---- Build searchable record index ------------------------------------------
function buildRecords() {
  const out = [];
  const incTitles = ["VPN access failure","Email service down","Printer offline","Server high CPU","Network latency spike","Software crash","Database timeout","Login issues","File share unavailable","Security alert"];
  const PRIS = ["Critical","High","Medium","Low"];
  const STATS = ["Open","In Progress","Resolved","Closed"];
  const CATS = ["Hardware","Software","Network","Access","Service"];
  for (let i=1;i<=30;i++) {
    out.push({ id:`inc-${i}`, group:"Incidents",
      label:`INC-${String(2000+i).padStart(4,"0")} -- ${incTitles[i%incTitles.length]}`,
      sub:`${PRIS[i%4]} · ${STATS[i%4]}`, icon:<AlertCircle size={14}/>, color:["#ef4444","#f97316","#eab308","#22c55e"][i%4],
      href:`/incidents/${2000+i}`, keywords:`incident ticket ${PRIS[i%4]} ${STATS[i%4]} ${CATS[i%5]}` });
  }
  SERVICE_REQUESTS.slice(0,20).forEach(sr => out.push({ id:sr.id, group:"Service Requests", label:`${sr.id} -- ${sr.title}`, sub:`${sr.priority} · ${sr.status}`, icon:<ClipboardList size={14}/>, color:"#3b82f6", href:"/service-requests", keywords:`request sr ${sr.category} ${sr.requester} ${sr.status}` }));
  CHANGES.slice(0,15).forEach(chg => out.push({ id:chg.id, group:"Changes", label:`${chg.id} -- ${chg.title}`, sub:`${chg.type} · ${chg.status}`, icon:<GitBranch size={14}/>, color:"#6366f1", href:"/changes", keywords:`change ${chg.type} ${chg.risk} ${chg.status}` }));
  PROBLEMS.slice(0,12).forEach(prb => out.push({ id:prb.id, group:"Problems", label:`${prb.id} -- ${prb.title}`, sub:`${prb.impact} · ${prb.status}`, icon:<AlertTriangle size={14}/>, color:"#f97316", href:"/problems", keywords:`problem rca ${prb.impact} ${prb.status}` }));
  ASSETS.slice(0,15).forEach(ast => out.push({ id:ast.id, group:"Assets", label:`${ast.id} -- ${ast.name}`, sub:`${ast.type} · ${ast.status}`, icon:<Laptop size={14}/>, color:"#22c55e", href:"/assets", keywords:`asset ${ast.type} ${ast.manufacturer} ${ast.location} ${ast.serialNumber}` }));
  KB_ARTICLES.filter(a=>a.status==="Published").slice(0,15).forEach(art => out.push({ id:art.id, group:"Knowledge Base", label:art.title, sub:art.category, icon:<FileText size={14}/>, color:"#06b6d4", href:"/knowledge-base", keywords:`kb article ${art.category} ${art.author} ${art.tags.join(" ")}` }));
  APPROVALS.filter(a=>a.status==="Pending").slice(0,8).forEach(apv => out.push({ id:apv.id, group:"Approvals", label:`${apv.id} -- ${apv.title}`, sub:`${apv.type} · Pending`, icon:<ThumbsUp size={14}/>, color:"#eab308", href:"/approvals", keywords:`approval ${apv.type} ${apv.requester}` }));
  return out;
}
const ALL_RECORDS = buildRecords();

const NAV_ITEMS = [
  { id:"nav-dashboard",  group:"Navigation", label:"Dashboard",       icon:<LayoutDashboard size={14}/>, href:"/dashboard",       keywords:"home main" },
  { id:"nav-incidents",  group:"Navigation", label:"Incidents",        icon:<AlertCircle size={14}/>,    href:"/incidents",       keywords:"tickets issues" },
  { id:"nav-requests",   group:"Navigation", label:"Service Requests", icon:<ClipboardList size={14}/>,  href:"/service-requests",keywords:"requests sr" },
  { id:"nav-changes",    group:"Navigation", label:"Changes",          icon:<GitBranch size={14}/>,       href:"/changes",         keywords:"change mgmt cab" },
  { id:"nav-problems",   group:"Navigation", label:"Problems",         icon:<AlertTriangle size={14}/>,   href:"/problems",        keywords:"root cause rca" },
  { id:"nav-assets",     group:"Navigation", label:"Assets",           icon:<Monitor size={14}/>,         href:"/assets",          keywords:"hardware cmdb" },
  { id:"nav-kb",         group:"Navigation", label:"Knowledge Base",   icon:<BookOpen size={14}/>,        href:"/knowledge-base",  keywords:"docs articles" },
  { id:"nav-reports",    group:"Navigation", label:"Reports",          icon:<BarChart2 size={14}/>,       href:"/reports",         keywords:"analytics charts" },
  { id:"nav-approvals",  group:"Navigation", label:"Approvals",        icon:<ThumbsUp size={14}/>,        href:"/approvals",       keywords:"pending sign off" },
  { id:"nav-settings",   group:"Navigation", label:"Settings",         icon:<Settings size={14}/>,        href:"/settings",        keywords:"config admin" },
  { id:"nav-profile",    group:"Navigation", label:"Profile",          icon:<User size={14}/>,            href:"/profile",         keywords:"account me" },
  { id:"act-new-inc",    group:"Quick Actions", label:"New Incident",        icon:<Plus size={14}/>, href:"/new-incident", keywords:"create raise" },
  { id:"act-self",       group:"Quick Actions", label:"Self-Service Portal", icon:<Zap size={14}/>,  href:"/self-service", keywords:"portal end user" },
];

function scoreItem(item, q) {
  const lq = q.toLowerCase();
  const label = item.label.toLowerCase();
  const kw = (item.keywords||"").toLowerCase();
  const sub = (item.sub||"").toLowerCase();
  if (label === lq) return 100;
  if (label.startsWith(lq)) return 90;
  if ((item.id||"").toLowerCase().includes(lq)) return 85;
  if (label.includes(lq)) return 70;
  if (sub.includes(lq)) return 55;
  if (kw.includes(lq)) return 40;
  return 0;
}

const GROUP_ORDER = ["Quick Actions","Navigation","Incidents","Service Requests","Changes","Problems","Assets","Knowledge Base","Approvals"];

export default function CommandPalette() {
  const [open,setOpen]             = useState(false);
  const [query,setQuery]           = useState("");
  const [selectedIdx,setSelectedIdx] = useState(0);
  const [animating,setAnimating]   = useState(false);
  const inputRef = useRef(null);
  const listRef  = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(()=>{
    const q = query.trim();
    if (!q) return [...NAV_ITEMS.filter(i=>i.group==="Quick Actions"), ...NAV_ITEMS.filter(i=>i.group==="Navigation").slice(0,6)];
    const allItems = [...NAV_ITEMS, ...ALL_RECORDS];
    const scored = allItems.map(item=>({item,s:scoreItem(item,q)})).filter(({s})=>s>0).sort((a,b)=>b.s-a.s).map(({item})=>item);
    // Limit 4 per group
    const counts = {};
    return scored.filter(item=>{ counts[item.group]=(counts[item.group]||0)+1; return counts[item.group]<=4; });
  },[query]);

  const grouped = useMemo(()=>filtered.reduce((acc,item)=>{ (acc[item.group]=acc[item.group]||[]).push(item); return acc; },{}),[filtered]);
  const flat = useMemo(()=>GROUP_ORDER.filter(g=>grouped[g]).flatMap(g=>grouped[g]),[grouped]);

  const openPalette = useCallback(()=>{ setOpen(true); setQuery(""); setSelectedIdx(0); setTimeout(()=>{ setAnimating(true); inputRef.current?.focus(); },10); },[]);
  const closePalette = useCallback(()=>{ setAnimating(false); setTimeout(()=>{ setOpen(false); setQuery(""); },180); },[]);
  const select = useCallback((item)=>{ if(item?.href){ navigate(item.href); closePalette(); } },[navigate,closePalette]);

  useEffect(()=>{
    function onKey(e){
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){ e.preventDefault(); open?closePalette():openPalette(); }
      if(!open) return;
      if(e.key==="Escape") closePalette();
      if(e.key==="ArrowDown"){ e.preventDefault(); setSelectedIdx(i=>Math.min(i+1,flat.length-1)); }
      if(e.key==="ArrowUp"){ e.preventDefault(); setSelectedIdx(i=>Math.max(i-1,0)); }
      if(e.key==="Enter"){ e.preventDefault(); select(flat[selectedIdx]); }
    }
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[open,flat,selectedIdx,openPalette,closePalette,select]);

  useEffect(()=>setSelectedIdx(0),[query]);
  useEffect(()=>{ if(!listRef.current) return; listRef.current.querySelector(`[data-idx="${selectedIdx}"]`)?.scrollIntoView({block:"nearest"}); },[selectedIdx]);

  return (
    <>
      <button type="button" id="hi5-cmd-palette" onClick={openPalette} aria-label="Open command palette (Cmd+K)"
        className="hi5-btn-ghost no-min-touch"
        style={{height:36,padding:"0 10px",borderRadius:10,display:"flex",alignItems:"center",gap:7,fontSize:12,opacity:0.70}}>
        <Search size={14}/>
        <span style={{fontSize:12}}>Search</span>
        <kbd style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:5,background:"rgb(var(--hi5-border)/0.12)",border:"1px solid rgb(var(--hi5-border)/0.18)",opacity:0.70}}>K</kbd>
      </button>

      {open && createPortal(
        <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"clamp(60px,12vh,120px) 16px 16px"}}
          onMouseDown={e=>{if(e.target===e.currentTarget) closePalette();}}>
          <div style={{position:"fixed",inset:0,background:"rgb(0 0 0/0.45)",backdropFilter:"blur(8px)",transition:"opacity 180ms",opacity:animating?1:0}}/>
          <div style={{position:"relative",width:"100%",maxWidth:580,maxHeight:"70vh",display:"flex",flexDirection:"column",
            background:"rgb(var(--hi5-card)/0.95)",backdropFilter:"blur(24px)",
            border:"1px solid rgb(var(--hi5-border)/0.20)",borderRadius:18,
            boxShadow:"0 32px 80px rgb(0 0 0/0.32), 0 0 0 1px rgb(255 255 255/0.05)",
            transition:"opacity 180ms ease, transform 180ms cubic-bezier(0.34,1.20,0.64,1)",
            opacity:animating?1:0, transform:animating?"translateY(0) scale(1)":"translateY(-12px) scale(0.97)",
            overflow:"hidden"}}>

            {/* Input */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid rgb(var(--hi5-border)/0.10)"}}>
              <Search size={16} style={{opacity:0.40,flexShrink:0}}/>
              <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Search incidents, assets, changes, KB articles..."
                style={{flex:1,fontSize:14,background:"transparent",border:"none",outline:"none",color:"rgb(var(--hi5-fg))"}}
                autoComplete="off" spellCheck={false}/>
              {query&&<button type="button" onClick={()=>setQuery("")} style={{background:"none",border:"none",cursor:"pointer",opacity:0.35,padding:2,fontSize:14}}>✕</button>}
              <kbd style={{fontSize:11,padding:"3px 7px",borderRadius:6,background:"rgb(var(--hi5-border)/0.10)",border:"1px solid rgb(var(--hi5-border)/0.16)",opacity:0.55}}>Esc</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{overflowY:"auto",flex:1}}>
              {flat.length===0?(
                <div style={{padding:"32px 16px",textAlign:"center",opacity:0.40}}>
                  <div style={{fontSize:28,marginBottom:8}}>🔍</div>
                  <div style={{fontSize:13}}>No results for "{query}"</div>
                </div>
              ):(
                GROUP_ORDER.filter(g=>grouped[g]).map(groupName=>(
                  <div key={groupName}>
                    <div style={{padding:"8px 16px 4px",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",opacity:0.35}}>{groupName}</div>
                    {(grouped[groupName]||[]).map(item=>{
                      const idx=flat.indexOf(item); const active=idx===selectedIdx;
                      return (
                        <button key={item.id} type="button" data-idx={idx}
                          onMouseEnter={()=>setSelectedIdx(idx)} onClick={()=>select(item)}
                          style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 16px",
                            background:active?"rgb(var(--hi5-accent)/0.08)":"transparent",
                            border:"none",cursor:"pointer",textAlign:"left",
                            borderLeft:active?"2px solid rgb(var(--hi5-accent))":"2px solid transparent",
                            transition:"background 80ms"}}>
                          <div style={{width:28,height:28,borderRadius:8,flexShrink:0,
                            background:(item.color||"rgb(var(--hi5-accent))")+"18",
                            border:"1px solid "+(item.color||"rgb(var(--hi5-accent))")+"30",
                            color:item.color||"rgb(var(--hi5-accent))",
                            display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {item.icon}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:active?700:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</div>
                            {item.sub&&<div style={{fontSize:11,opacity:0.45,marginTop:1}}>{item.sub}</div>}
                          </div>
                          {active&&<ArrowRight size={12} style={{opacity:0.40,flexShrink:0}}/>}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{padding:"8px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",display:"flex",alignItems:"center",gap:12,fontSize:11,opacity:0.40}}>
              <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
              {query.trim()&&<span style={{marginLeft:"auto"}}>{flat.length} result{flat.length!==1?"s":""}</span>}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
