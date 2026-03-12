// src/pages/Approvals.js
import React, { useState, useMemo } from "react";
import { PageSkeleton, usePageLoad } from "../components/ui/Skeletons";
import { CheckCircle2, XCircle, Clock, AlertTriangle, UserCheck } from "lucide-react";
import { APPROVALS } from "../data/mockData";
import { PageHeader, SearchBar, FilterPills, StatusBadge, PriorityDot, Avatar, EmptyState, SortableHeader, TableRow, TD, Card, StatCard } from "../components/ui/PageHeader";

const STATUS_CFG = {
  "Pending":   { bg:"rgb(234 179 8/0.12)",   color:"#eab308" },
  "Approved":  { bg:"rgb(34 197 94/0.12)",   color:"#22c55e" },
  "Rejected":  { bg:"rgb(239 68 68/0.12)",   color:"#ef4444" },
  "Escalated": { bg:"rgb(239 68 68/0.14)",   color:"#f97316" },
  "Delegated": { bg:"rgb(99 102 241/0.12)",  color:"#6366f1" },
};
const URGENCY_COLOR = { Critical:"#ef4444", High:"#f97316", Normal:"#3b82f6", Low:"#22c55e" };
const fmt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const isDue = iso => { const d=new Date(iso); const now=new Date(); return d<now; };
const isDueSoon = iso => { const d=new Date(iso); const now=new Date(); return (d-now)<86400000*2 && d>now; };

export default function Approvals() {
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("All");  const [type,setType]=useState("All"); const [sort,setSort]=useState({field:"dueDate",dir:"asc"});
  const stats = useMemo(()=>({ total:APPROVALS.length, pending:APPROVALS.filter(a=>a.status==="Pending").length, approved:APPROVALS.filter(a=>a.status==="Approved").length, rejected:APPROVALS.filter(a=>a.status==="Rejected").length, overdue:APPROVALS.filter(a=>a.status==="Pending"&&isDue(a.dueDate)).length }),[]);
  const types = ["All",...new Set(APPROVALS.map(a=>a.type))];
  function toggleSort(f){setSort(s=>s.field===f?{field:f,dir:s.dir==="asc"?"desc":"asc"}:{field:f,dir:"asc"});}
  const filtered = useMemo(()=>{
    let rows=[...APPROVALS];
    if(search) rows=rows.filter(r=>r.title.toLowerCase().includes(search.toLowerCase())||r.id.toLowerCase().includes(search.toLowerCase()));
    if(status!=="All") rows=rows.filter(r=>r.status===status);
    if(type!=="All") rows=rows.filter(r=>r.type===type);
    rows.sort((a,b)=>{const v=x=>sort.field==="dueDate"||sort.field==="created"?new Date(x[sort.field]):x[sort.field]||"";const c=v(a)<v(b)?-1:v(a)>v(b)?1:0;return sort.dir==="asc"?c:-c;});
    return rows;
  },[search,status,type,sort]);

  const loading = usePageLoad(550);
  if (loading) return <PageSkeleton cols={6} rows={8} stats={5} />;
  return (
    <div>
      <PageHeader title="Approvals" subtitle="Review and action pending approval requests" stat={`${stats.pending} pending`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        <StatCard label="Total" value={stats.total} icon={<UserCheck size={18}/>} color="#00c1ff"/>
        <StatCard label="Pending" value={stats.pending} icon={<Clock size={18}/>} color="#eab308"/>
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle2 size={18}/>} color="#22c55e"/>
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle size={18}/>} color="#ef4444"/>
        <StatCard label="Overdue" value={stats.overdue} icon={<AlertTriangle size={18}/>} color="#ef4444" trend={{up:false,label:`${stats.overdue} past due`}}/>
      </div>
      <Card style={{marginBottom:16,padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search approvals…" style={{flex:"1 1 220px",minWidth:180}}/>
          <FilterPills options={["All","Pending","Approved","Rejected","Escalated","Delegated"]} value={status} onChange={setStatus}/>
          <FilterPills options={types} value={type} onChange={setType}/>
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <SortableHeader label="ID" field="id" sort={sort} onSort={toggleSort} style={{paddingLeft:16}}/>
              <SortableHeader label="Request" field="title" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Type" field="type" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Urgency" field="urgency" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Status" field="status" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Requester" field="requester" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Approver" field="approver" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Due" field="dueDate" sort={sort} onSort={toggleSort}/>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={8}><EmptyState icon="✅" title="No approvals found" body="Try adjusting filters."/></td></tr>}
              {filtered.map(apv=>{
                const overdue=apv.status==="Pending"&&isDue(apv.dueDate); const dueSoon=apv.status==="Pending"&&isDueSoon(apv.dueDate);
                return (
                  <TableRow key={apv.id}>
                    <TD style={{paddingLeft:16,fontFamily:"monospace",fontSize:12,opacity:0.45,whiteSpace:"nowrap"}}>{apv.id}</TD>
                    <TD style={{maxWidth:240}}>
                      <div style={{fontWeight:600,fontSize:13}}>{apv.title}</div>
                      <div style={{fontSize:11,opacity:0.40,marginTop:2,fontFamily:"monospace"}}>{apv.refId}</div>
                    </TD>
                    <TD style={{fontSize:12,opacity:0.55,whiteSpace:"nowrap"}}>{apv.type}</TD>
                    <TD><div style={{display:"flex",alignItems:"center",gap:6}}><PriorityDot priority={apv.urgency}/><span style={{fontSize:12,color:URGENCY_COLOR[apv.urgency],fontWeight:600}}>{apv.urgency}</span></div></TD>
                    <TD><StatusBadge status={apv.status} config={STATUS_CFG}/></TD>
                    <TD><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={apv.requester} size={24}/><span style={{fontSize:12}}>{apv.requester}</span></div></TD>
                    <TD><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={apv.approver} size={24}/><span style={{fontSize:12}}>{apv.approver}</span></div></TD>
                    <TD>
                      <span style={{fontSize:12,fontWeight:overdue||dueSoon?700:400,color:overdue?"#ef4444":dueSoon?"#f97316":undefined,opacity:overdue||dueSoon?1:0.50}}>
                        {overdue?"OVERDUE":fmt(apv.dueDate)}
                      </span>
                    </TD>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",fontSize:12,opacity:0.40}}>Showing {filtered.length} of {APPROVALS.length} approvals</div>
      </Card>
    </div>
  );
}
