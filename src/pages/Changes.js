// src/pages/Changes.js
import React, { useState, useMemo } from "react";
import { PageSkeleton, usePageLoad } from "../components/ui/Skeletons";
import { GitBranch, AlertTriangle, CheckCircle2, Clock, Shield } from "lucide-react";
import { CHANGES } from "../data/mockData";
import { PageHeader, SearchBar, FilterPills, StatusBadge, Avatar, EmptyState, SortableHeader, TableRow, TD, Card, StatCard } from "../components/ui/PageHeader";

const STATUS_CFG = {
  "Draft":            { bg:"rgb(148 163 184/0.12)", color:"#94a3b8" },
  "Pending Approval": { bg:"rgb(234 179 8/0.12)",   color:"#eab308" },
  "Approved":         { bg:"rgb(59 130 246/0.12)",  color:"#3b82f6" },
  "In Progress":      { bg:"rgb(99 102 241/0.12)",  color:"#6366f1" },
  "Completed":        { bg:"rgb(34 197 94/0.12)",   color:"#22c55e" },
  "Failed":           { bg:"rgb(239 68 68/0.12)",   color:"#ef4444" },
  "Cancelled":        { bg:"rgb(148 163 184/0.10)", color:"#64748b" },
};
const RISK_COLOR = { High:"#ef4444", Medium:"#f97316", Low:"#22c55e" };
const TYPE_CFG = { Emergency:{bg:"rgb(239 68 68/0.10)",color:"#ef4444"}, Normal:{bg:"rgb(59 130 246/0.10)",color:"#3b82f6"}, Standard:{bg:"rgb(34 197 94/0.10)",color:"#22c55e"} };
const fmtDt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});

export default function Changes() {
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("All");  const [type,setType]=useState("All"); const [sort,setSort]=useState({field:"scheduledStart",dir:"asc"});
  const stats = useMemo(()=>({ total:CHANGES.length, pending:CHANGES.filter(c=>c.status==="Pending Approval").length, upcoming:CHANGES.filter(c=>["Approved","Draft"].includes(c.status)).length, active:CHANGES.filter(c=>c.status==="In Progress").length, emergency:CHANGES.filter(c=>c.type==="Emergency").length }),[]);
  function toggleSort(f){setSort(s=>s.field===f?{field:f,dir:s.dir==="asc"?"desc":"asc"}:{field:f,dir:"asc"});}
  const filtered = useMemo(()=>{
    let rows=[...CHANGES];
    if(search) rows=rows.filter(r=>r.title.toLowerCase().includes(search.toLowerCase())||r.id.toLowerCase().includes(search.toLowerCase()));
    if(status!=="All") rows=rows.filter(r=>r.status===status);
    if(type!=="All") rows=rows.filter(r=>r.type===type);
    rows.sort((a,b)=>{const v=x=>sort.field.includes("scheduled")||sort.field==="created"?new Date(x[sort.field]):x[sort.field]||"";const c=v(a)<v(b)?-1:v(a)>v(b)?1:0;return sort.dir==="asc"?c:-c;});
    return rows;
  },[search,status,type,sort]);

  const loading = usePageLoad(550);
  if (loading) return <PageSkeleton cols={6} rows={8} stats={5} />;
  return (
    <div>
      <PageHeader title="Changes" subtitle="Plan and track infrastructure and service changes" stat={`${stats.total} total`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        <StatCard label="Total" value={stats.total} icon={<GitBranch size={18}/>} color="#00c1ff"/>
        <StatCard label="Pending CAB" value={stats.pending} icon={<Clock size={18}/>} color="#eab308"/>
        <StatCard label="Upcoming" value={stats.upcoming} icon={<CheckCircle2 size={18}/>} color="#3b82f6"/>
        <StatCard label="In Progress" value={stats.active} icon={<Shield size={18}/>} color="#6366f1"/>
        <StatCard label="Emergency" value={stats.emergency} icon={<AlertTriangle size={18}/>} color="#ef4444"/>
      </div>
      <Card style={{marginBottom:16,padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search changes…" style={{flex:"1 1 220px",minWidth:180}}/>
          <FilterPills options={["All","Draft","Pending Approval","Approved","In Progress","Completed","Failed"]} value={status} onChange={setStatus}/>
          <FilterPills options={["All","Standard","Normal","Emergency"]} value={type} onChange={setType}/>
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <SortableHeader label="ID" field="id" sort={sort} onSort={toggleSort} style={{paddingLeft:16}}/>
              <SortableHeader label="Title" field="title" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Type" field="type" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Risk" field="risk" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Status" field="status" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Assignee" field="assignee" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Scheduled" field="scheduledStart" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="CAB" field="cab" sort={sort} onSort={toggleSort}/>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={8}><EmptyState icon="🔧" title="No changes found" body="Try adjusting filters."/></td></tr>}
              {filtered.map(chg=>(
                <TableRow key={chg.id}>
                  <TD style={{paddingLeft:16,fontFamily:"monospace",fontSize:12,opacity:0.45,whiteSpace:"nowrap"}}>{chg.id}</TD>
                  <TD style={{maxWidth:240}}><div style={{fontWeight:600,fontSize:13}}>{chg.title}</div><div style={{fontSize:11,opacity:0.40,marginTop:2}}>{chg.team}</div></TD>
                  <TD><span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:TYPE_CFG[chg.type]?.bg,color:TYPE_CFG[chg.type]?.color}}>{chg.type}</span></TD>
                  <TD><span style={{fontSize:12,fontWeight:700,color:RISK_COLOR[chg.risk]}}>{chg.risk}</span></TD>
                  <TD><StatusBadge status={chg.status} config={STATUS_CFG}/></TD>
                  <TD><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={chg.assignee} size={24}/><span style={{fontSize:12}}>{chg.assignee}</span></div></TD>
                  <TD style={{fontSize:12,opacity:0.55,whiteSpace:"nowrap"}}>{fmtDt(chg.scheduledStart)}</TD>
                  <TD>{chg.cab?<span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:5,background:"rgb(234 179 8/0.12)",color:"#eab308"}}>CAB</span>:<span style={{fontSize:11,opacity:0.30}}>—</span>}</TD>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",fontSize:12,opacity:0.40}}>Showing {filtered.length} of {CHANGES.length} changes</div>
      </Card>
    </div>
  );
}
