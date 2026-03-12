// src/pages/Problems.js
import React, { useState, useMemo } from "react";
import { PageSkeleton, usePageLoad } from "../components/ui/Skeletons";
import { AlertTriangle, Search as SearchIcon, Lightbulb, Activity, BookMarked } from "lucide-react";
import { PROBLEMS } from "../data/mockData";
import { PageHeader, SearchBar, FilterPills, StatusBadge, PriorityDot, Avatar, EmptyState, SortableHeader, TableRow, TD, Card, StatCard } from "../components/ui/PageHeader";

const STATUS_CFG = {
  "Open":                    { bg:"rgb(239 68 68/0.12)",  color:"#ef4444" },
  "Under Investigation":     { bg:"rgb(234 179 8/0.12)",  color:"#eab308" },
  "Root Cause Identified":   { bg:"rgb(59 130 246/0.12)", color:"#3b82f6" },
  "Fix In Progress":         { bg:"rgb(99 102 241/0.12)", color:"#6366f1" },
  "Resolved":                { bg:"rgb(34 197 94/0.12)",  color:"#22c55e" },
  "Known Error":             { bg:"rgb(148 163 184/0.14)",color:"#94a3b8" },
};
const IMPACT_COLOR = { Critical:"#ef4444", High:"#f97316", Medium:"#eab308", Low:"#22c55e" };
const fmt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});

export default function Problems() {
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("All"); const [impact,setImpact]=useState("All");

  const loading = usePageLoad(550);
  if (loading) return <PageSkeleton cols={10} rows={8} stats={5} />;  const [sort,setSort]=useState({field:"created",dir:"desc"});
  const stats = useMemo(()=>({ total:PROBLEMS.length, open:PROBLEMS.filter(p=>p.status==="Open").length, investigating:PROBLEMS.filter(p=>p.status==="Under Investigation").length, knownError:PROBLEMS.filter(p=>p.status==="Known Error").length, resolved:PROBLEMS.filter(p=>p.status==="Resolved").length }),[]);
  function toggleSort(f){setSort(s=>s.field===f?{field:f,dir:s.dir==="asc"?"desc":"asc"}:{field:f,dir:"asc"});}
  const filtered = useMemo(()=>{
    let rows=[...PROBLEMS];
    if(search) rows=rows.filter(r=>r.title.toLowerCase().includes(search.toLowerCase())||r.id.toLowerCase().includes(search.toLowerCase()));
    if(status!=="All") rows=rows.filter(r=>r.status===status);
    if(impact!=="All") rows=rows.filter(r=>r.impact===impact);
    rows.sort((a,b)=>{const v=x=>sort.field==="created"||sort.field==="lastUpdated"?new Date(x[sort.field]):x[sort.field]||"";const c=v(a)<v(b)?-1:v(a)>v(b)?1:0;return sort.dir==="asc"?c:-c;});
    return rows;
  },[search,status,impact,sort]);
  return (
    <div>
      <PageHeader title="Problems" subtitle="Identify root causes and prevent recurring incidents" stat={`${stats.total} total`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        <StatCard label="Total" value={stats.total} icon={<AlertTriangle size={18}/>} color="#00c1ff"/>
        <StatCard label="Open" value={stats.open} icon={<SearchIcon size={18}/>} color="#ef4444"/>
        <StatCard label="Investigating" value={stats.investigating} icon={<Activity size={18}/>} color="#eab308"/>
        <StatCard label="Known Errors" value={stats.knownError} icon={<BookMarked size={18}/>} color="#94a3b8"/>
        <StatCard label="Resolved" value={stats.resolved} icon={<Lightbulb size={18}/>} color="#22c55e" trend={{up:true,label:"+2"}}/>
      </div>
      <Card style={{marginBottom:16,padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search problems…" style={{flex:"1 1 220px",minWidth:180}}/>
          <FilterPills options={["All","Open","Under Investigation","Root Cause Identified","Fix In Progress","Resolved","Known Error"]} value={status} onChange={setStatus}/>
          <FilterPills options={["All","Critical","High","Medium","Low"]} value={impact} onChange={setImpact}/>
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <SortableHeader label="ID" field="id" sort={sort} onSort={toggleSort} style={{paddingLeft:16}}/>
              <SortableHeader label="Problem" field="title" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Impact" field="impact" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Status" field="status" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Linked Inc." field="linkedIncidents" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Workaround" field="workaround" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Assignee" field="assignee" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Opened" field="created" sort={sort} onSort={toggleSort}/>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={8}><EmptyState icon="🔍" title="No problems found" body="Try adjusting filters."/></td></tr>}
              {filtered.map(prb=>(
                <TableRow key={prb.id}>
                  <TD style={{paddingLeft:16,fontFamily:"monospace",fontSize:12,opacity:0.45,whiteSpace:"nowrap"}}>{prb.id}</TD>
                  <TD style={{maxWidth:260}}><div style={{fontWeight:600,fontSize:13}}>{prb.title}</div>{prb.rootCause&&<div style={{fontSize:11,opacity:0.40,marginTop:2}}>RC: {prb.rootCause}</div>}</TD>
                  <TD><div style={{display:"flex",alignItems:"center",gap:6}}><PriorityDot priority={prb.impact}/><span style={{fontSize:12,color:IMPACT_COLOR[prb.impact],fontWeight:600}}>{prb.impact}</span></div></TD>
                  <TD><StatusBadge status={prb.status} config={STATUS_CFG}/></TD>
                  <TD><span style={{fontSize:13,fontWeight:700,color:"rgb(var(--hi5-accent))"}}>{prb.linkedIncidents}</span></TD>
                  <TD>{prb.workaround?<span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:5,background:"rgb(34 197 94/0.12)",color:"#22c55e"}}>Yes</span>:<span style={{fontSize:11,opacity:0.30}}>No</span>}</TD>
                  <TD><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={prb.assignee} size={24}/><span style={{fontSize:12}}>{prb.assignee}</span></div></TD>
                  <TD style={{fontSize:12,opacity:0.40,whiteSpace:"nowrap"}}>{fmt(prb.created)}</TD>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",fontSize:12,opacity:0.40}}>Showing {filtered.length} of {PROBLEMS.length} problems</div>
      </Card>
    </div>
  );
}
