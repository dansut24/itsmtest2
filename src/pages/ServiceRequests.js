// src/pages/ServiceRequests.js
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, Clock, CheckCircle2, XCircle, PauseCircle } from "lucide-react";
import { SERVICE_REQUESTS } from "../data/mockData";
import {
  PageHeader, SearchBar, FilterPills, StatusBadge,
  PriorityDot, Avatar, EmptyState, SortableHeader,
  TableRow, TD, Card, StatCard,
} from "../components/ui/PageHeader";

const STATUS_CFG = {
  "Pending Approval": { bg:"rgb(234 179 8/0.12)",   color:"#eab308" },
  "In Progress":      { bg:"rgb(59 130 246/0.12)",  color:"#3b82f6" },
  "Fulfilled":        { bg:"rgb(34 197 94/0.12)",   color:"#22c55e" },
  "Rejected":         { bg:"rgb(239 68 68/0.12)",   color:"#ef4444" },
  "On Hold":          { bg:"rgb(148 163 184/0.14)", color:"#94a3b8" },
};
const SLA_COLOR = { "On Track":"#22c55e","At Risk":"#f97316","Breached":"#ef4444" };
const PRI_COLOR = { High:"#f97316", Medium:"#eab308", Low:"#22c55e" };
const fmt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});

export default function ServiceRequests() {
  const navigate = useNavigate();
  const [search,setSearch] = useState("");
  const [status,setStatus] = useState("All");
  const [priority,setPriority] = useState("All");
  const [sort,setSort] = useState({field:"created",dir:"desc"});

  const stats = useMemo(()=>({
    total:    SERVICE_REQUESTS.length,
    pending:  SERVICE_REQUESTS.filter(r=>r.status==="Pending Approval").length,
    active:   SERVICE_REQUESTS.filter(r=>r.status==="In Progress").length,
    fulfilled:SERVICE_REQUESTS.filter(r=>r.status==="Fulfilled").length,
    breached: SERVICE_REQUESTS.filter(r=>r.sla==="Breached").length,
  }),[]);

  const filtered = useMemo(()=>{
    let rows=[...SERVICE_REQUESTS];
    if(search) rows=rows.filter(r=>
      r.title.toLowerCase().includes(search.toLowerCase())||
      r.id.toLowerCase().includes(search.toLowerCase())||
      r.requester.toLowerCase().includes(search.toLowerCase()));
    if(status!=="All") rows=rows.filter(r=>r.status===status);
    if(priority!=="All") rows=rows.filter(r=>r.priority===priority);
    rows.sort((a,b)=>{
      const v=x=>sort.field==="created"?new Date(x.created):x[sort.field]||"";
      const c=v(a)<v(b)?-1:v(a)>v(b)?1:0;
      return sort.dir==="asc"?c:-c;
    });
    return rows;
  },[search,status,priority,sort]);

  function toggleSort(f){setSort(s=>s.field===f?{field:f,dir:s.dir==="asc"?"desc":"asc"}:{field:f,dir:"asc"});}

  return (
    <div>
      <PageHeader
        title="Service Requests"
        subtitle="Track and manage all user service requests"
        stat={`${stats.total} total`}
        actions={
          <button type="button" className="hi5-btn-primary no-min-touch"
            onClick={()=>navigate("/new-incident")}
            style={{height:36,padding:"0 16px",borderRadius:10,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            <Plus size={15}/> New Request
          </button>
        }
      />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        <StatCard label="Total"       value={stats.total}     icon={<ClipboardList size={18}/>} color="#00c1ff"/>
        <StatCard label="Pending"     value={stats.pending}   icon={<Clock size={18}/>}         color="#eab308"/>
        <StatCard label="In Progress" value={stats.active}    icon={<PauseCircle size={18}/>}   color="#3b82f6"/>
        <StatCard label="Fulfilled"   value={stats.fulfilled} icon={<CheckCircle2 size={18}/>}  color="#22c55e" trend={{up:true,label:"+4"}}/>
        <StatCard label="SLA Breached"value={stats.breached}  icon={<XCircle size={18}/>}       color="#ef4444"/>
      </div>
      <Card style={{marginBottom:16,padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search requests…" style={{flex:"1 1 220px",minWidth:180}}/>
          <FilterPills options={["All","Pending Approval","In Progress","Fulfilled","Rejected","On Hold"]} value={status} onChange={setStatus}/>
          <FilterPills options={["All","High","Medium","Low"]} value={priority} onChange={setPriority}/>
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                <SortableHeader label="ID"        field="id"        sort={sort} onSort={toggleSort} style={{paddingLeft:16}}/>
                <SortableHeader label="Request"   field="title"     sort={sort} onSort={toggleSort}/>
                <SortableHeader label="Requester" field="requester" sort={sort} onSort={toggleSort}/>
                <SortableHeader label="Priority"  field="priority"  sort={sort} onSort={toggleSort}/>
                <SortableHeader label="Status"    field="status"    sort={sort} onSort={toggleSort}/>
                <SortableHeader label="SLA"       field="sla"       sort={sort} onSort={toggleSort}/>
                <SortableHeader label="Category"  field="category"  sort={sort} onSort={toggleSort}/>
                <SortableHeader label="Raised"    field="created"   sort={sort} onSort={toggleSort}/>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={8}><EmptyState icon="📋" title="No requests found" body="Try adjusting your filters."/></td></tr>}
              {filtered.map(req=>(
                <TableRow key={req.id}>
                  <TD style={{paddingLeft:16,fontFamily:"monospace",fontSize:12,opacity:0.45,whiteSpace:"nowrap"}}>{req.id}</TD>
                  <TD style={{maxWidth:240}}>
                    <div style={{fontWeight:600,fontSize:13}}>{req.title}</div>
                    <div style={{fontSize:11,opacity:0.40,marginTop:2}}>Assigned: {req.assignee}</div>
                  </TD>
                  <TD>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <Avatar name={req.requester} size={24}/>
                      <span style={{fontSize:12}}>{req.requester}</span>
                    </div>
                  </TD>
                  <TD>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <PriorityDot priority={req.priority}/>
                      <span style={{fontSize:12,color:PRI_COLOR[req.priority],fontWeight:600}}>{req.priority}</span>
                    </div>
                  </TD>
                  <TD><StatusBadge status={req.status} config={STATUS_CFG}/></TD>
                  <TD><span style={{fontSize:12,fontWeight:700,color:SLA_COLOR[req.sla]}}>{req.sla}</span></TD>
                  <TD style={{fontSize:12,opacity:0.50}}>{req.category}</TD>
                  <TD style={{fontSize:12,opacity:0.40,whiteSpace:"nowrap"}}>{fmt(req.created)}</TD>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",fontSize:12,opacity:0.40}}>
          Showing {filtered.length} of {SERVICE_REQUESTS.length} requests
        </div>
      </Card>
    </div>
  );
}
