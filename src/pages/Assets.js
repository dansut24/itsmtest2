// src/pages/Assets.js
import React, { useState, useMemo } from "react";
import { PageSkeleton, usePageLoad } from "../components/ui/Skeletons";
import { Monitor, Server, Laptop, Wifi, HardDrive, AlertCircle } from "lucide-react";
import { ASSETS } from "../data/mockData";
import { PageHeader, SearchBar, FilterPills, StatusBadge, Avatar, EmptyState, SortableHeader, TableRow, TD, Card, StatCard } from "../components/ui/PageHeader";

const STATUS_CFG = {
  "Active":    { bg:"rgb(34 197 94/0.12)",   color:"#22c55e" },
  "Inactive":  { bg:"rgb(148 163 184/0.12)", color:"#94a3b8" },
  "In Repair": { bg:"rgb(234 179 8/0.12)",   color:"#eab308" },
  "Retired":   { bg:"rgb(239 68 68/0.10)",   color:"#ef4444" },
  "In Stock":  { bg:"rgb(59 130 246/0.12)",  color:"#3b82f6" },
};
const TYPE_ICON = { Laptop:<Laptop size={14}/>, Desktop:<Monitor size={14}/>, Server:<Server size={14}/>, Switch:<Wifi size={14}/>, Router:<Wifi size={14}/>, default:<HardDrive size={14}/> };
const fmt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const currency = n => "£"+n.toLocaleString();
const isWarrantyExpiringSoon = iso => { const d=new Date(iso); const now=new Date(); const diff=(d-now)/(86400000*30); return diff<3 && diff>0; };
const isWarrantyExpired = iso => new Date(iso)<new Date();

export default function Assets() {
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("All");  const [type,setType]=useState("All"); const [sort,setSort]=useState({field:"name",dir:"asc"});
  const stats = useMemo(()=>({
    total:ASSETS.length, active:ASSETS.filter(a=>a.status==="Active").length,
    inRepair:ASSETS.filter(a=>a.status==="In Repair").length,
    warrantyAlert:ASSETS.filter(a=>isWarrantyExpiringSoon(a.warrantyEnd)||isWarrantyExpired(a.warrantyEnd)).length,
    totalValue:ASSETS.reduce((s,a)=>s+a.value,0),
  }),[]);
  function toggleSort(f){setSort(s=>s.field===f?{field:f,dir:s.dir==="asc"?"desc":"asc"}:{field:f,dir:"asc"});}
  const assetTypes = ["All",...new Set(ASSETS.map(a=>a.type))];
  const filtered = useMemo(()=>{
    let rows=[...ASSETS];
    if(search) rows=rows.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.id.toLowerCase().includes(search.toLowerCase())||r.serialNumber.toLowerCase().includes(search.toLowerCase()));
    if(status!=="All") rows=rows.filter(r=>r.status===status);
    if(type!=="All") rows=rows.filter(r=>r.type===type);
    rows.sort((a,b)=>{const v=x=>sort.field==="purchaseDate"||sort.field==="warrantyEnd"?new Date(x[sort.field]):sort.field==="value"?x.value:x[sort.field]||"";const c=v(a)<v(b)?-1:v(a)>v(b)?1:0;return sort.dir==="asc"?c:-c;});
    return rows;
  },[search,status,type,sort]);

  const loading = usePageLoad(550);
  if (loading) return <PageSkeleton cols={6} rows={8} stats={5} />;
  return (
    <div>
      <PageHeader title="Assets" subtitle="Manage hardware and software assets across the organisation" stat={`${stats.total} assets`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        <StatCard label="Total Assets" value={stats.total} icon={<HardDrive size={18}/>} color="#00c1ff"/>
        <StatCard label="Active" value={stats.active} icon={<Monitor size={18}/>} color="#22c55e"/>
        <StatCard label="In Repair" value={stats.inRepair} icon={<AlertCircle size={18}/>} color="#eab308"/>
        <StatCard label="Warranty Alerts" value={stats.warrantyAlert} icon={<AlertCircle size={18}/>} color="#ef4444"/>
        <StatCard label="Total Value" value={currency(stats.totalValue)} icon={<Server size={18}/>} color="#6366f1"/>
      </div>
      <Card style={{marginBottom:16,padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, serial…" style={{flex:"1 1 220px",minWidth:180}}/>
          <FilterPills options={["All","Active","Inactive","In Repair","Retired","In Stock"]} value={status} onChange={setStatus}/>
          <FilterPills options={assetTypes} value={type} onChange={setType}/>
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <SortableHeader label="ID" field="id" sort={sort} onSort={toggleSort} style={{paddingLeft:16}}/>
              <SortableHeader label="Asset Name" field="name" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Type" field="type" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Status" field="status" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Assigned To" field="assignedTo" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Location" field="location" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Warranty" field="warrantyEnd" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Value" field="value" sort={sort} onSort={toggleSort}/>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={8}><EmptyState icon="💻" title="No assets found" body="Try adjusting filters."/></td></tr>}
              {filtered.map(ast=>{
                const warnExp=isWarrantyExpired(ast.warrantyEnd); const warnSoon=isWarrantyExpiringSoon(ast.warrantyEnd);
                return (
                  <TableRow key={ast.id}>
                    <TD style={{paddingLeft:16,fontFamily:"monospace",fontSize:12,opacity:0.45,whiteSpace:"nowrap"}}>{ast.id}</TD>
                    <TD>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:28,height:28,borderRadius:8,background:"rgb(var(--hi5-accent)/0.10)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgb(var(--hi5-accent))",flexShrink:0}}>
                          {TYPE_ICON[ast.type]||TYPE_ICON.default}
                        </div>
                        <div>
                          <div style={{fontWeight:600,fontSize:13}}>{ast.name}</div>
                          <div style={{fontSize:10,opacity:0.40,fontFamily:"monospace"}}>{ast.serialNumber}</div>
                        </div>
                      </div>
                    </TD>
                    <TD style={{fontSize:12,opacity:0.55}}>{ast.type}</TD>
                    <TD><StatusBadge status={ast.status} config={STATUS_CFG}/></TD>
                    <TD>{ast.assignedTo?<div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={ast.assignedTo} size={24}/><span style={{fontSize:12}}>{ast.assignedTo}</span></div>:<span style={{fontSize:12,opacity:0.35}}>Unassigned</span>}</TD>
                    <TD style={{fontSize:12,opacity:0.55}}>{ast.location}</TD>
                    <TD>
                      <span style={{fontSize:12,fontWeight:warnExp||warnSoon?700:400,color:warnExp?"#ef4444":warnSoon?"#f97316":undefined,opacity:warnExp||warnSoon?1:0.50}}>
                        {warnExp?"EXPIRED":fmt(ast.warrantyEnd)}
                      </span>
                    </TD>
                    <TD style={{fontSize:12,fontWeight:600,opacity:0.70}}>{currency(ast.value)}</TD>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",fontSize:12,opacity:0.40}}>Showing {filtered.length} of {ASSETS.length} assets</div>
      </Card>
    </div>
  );
}
