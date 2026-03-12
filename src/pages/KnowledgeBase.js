 src/pages/KnowledgeBase.js
import React, { useState, useMemo } from "react";
import { PageSkeleton, usePageLoad } from "../components/ui/Skeletons";
import { BookOpen, Eye, ThumbsUp, FileEdit, Search } from "lucide-react";
import { KB_ARTICLES } from "../data/mockData";
import { PageHeader, SearchBar, FilterPills, StatusBadge, Avatar, EmptyState, SortableHeader, TableRow, TD, Card, StatCard } from "../components/ui/PageHeader";

const STATUS_CFG = {
  "Published":    { bg:"rgb(34 197 94/0.12)",   color:"#22c55e" },
  "Draft":        { bg:"rgb(148 163 184/0.12)", color:"#94a3b8" },
  "Under Review": { bg:"rgb(234 179 8/0.12)",   color:"#eab308" },
};
const fmt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});

export default function KnowledgeBase() {
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("All");  const [cat,setCat]=useState("All"); const [sort,setSort]=useState({field:"views",dir:"desc"});
  const stats = useMemo(()=>({ total:KB_ARTICLES.length, published:KB_ARTICLES.filter(a=>a.status==="Published").length, draft:KB_ARTICLES.filter(a=>a.status==="Draft").length, totalViews:KB_ARTICLES.reduce((s,a)=>s+a.views,0), avgHelpful:Math.round(KB_ARTICLES.reduce((s,a)=>s+a.helpful,0)/KB_ARTICLES.length) }),[]);
  const categories = ["All",...new Set(KB_ARTICLES.map(a=>a.category))];
  function toggleSort(f){setSort(s=>s.field===f?{field:f,dir:s.dir==="asc"?"desc":"asc"}:{field:f,dir:"asc"});}
  const filtered = useMemo(()=>{
    let rows=[...KB_ARTICLES];
    if(search) rows=rows.filter(r=>r.title.toLowerCase().includes(search.toLowerCase())||r.category.toLowerCase().includes(search.toLowerCase()));
    if(status!=="All") rows=rows.filter(r=>r.status===status);
    if(cat!=="All") rows=rows.filter(r=>r.category===cat);
    rows.sort((a,b)=>{const v=x=>sort.field==="lastUpdated"?new Date(x.lastUpdated):sort.field==="views"||sort.field==="helpful"?x[sort.field]:x[sort.field]||"";const c=v(a)<v(b)?-1:v(a)>v(b)?1:0;return sort.dir==="asc"?c:-c;});
    return rows;
  },[search,status,cat,sort]);

  const loading = usePageLoad(550);
  if (loading) return <PageSkeleton cols={6} rows={8} stats={5} />;
  return (
    <div>
      <PageHeader title="Knowledge Base" subtitle="Self-service articles and IT documentation" stat={`${stats.published} published`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        <StatCard label="Total Articles" value={stats.total} icon={<BookOpen size={18}/>} color="#00c1ff"/>
        <StatCard label="Published" value={stats.published} icon={<Eye size={18}/>} color="#22c55e"/>
        <StatCard label="Drafts" value={stats.draft} icon={<FileEdit size={18}/>} color="#94a3b8"/>
        <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} icon={<Search size={18}/>} color="#6366f1"/>
        <StatCard label="Avg. Helpful" value={`${stats.avgHelpful}%`} icon={<ThumbsUp size={18}/>} color="#22c55e" trend={{up:true,label:"+3%"}}/>
      </div>
      <Card style={{marginBottom:16,padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search articles…" style={{flex:"1 1 220px",minWidth:180}}/>
          <FilterPills options={["All","Published","Draft","Under Review"]} value={status} onChange={setStatus}/>
          <FilterPills options={categories} value={cat} onChange={setCat}/>
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <SortableHeader label="ID" field="id" sort={sort} onSort={toggleSort} style={{paddingLeft:16}}/>
              <SortableHeader label="Title" field="title" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Category" field="category" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Status" field="status" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Author" field="author" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Views" field="views" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Helpful" field="helpful" sort={sort} onSort={toggleSort}/>
              <SortableHeader label="Updated" field="lastUpdated" sort={sort} onSort={toggleSort}/>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={8}><EmptyState icon="📚" title="No articles found" body="Try adjusting filters."/></td></tr>}
              {filtered.map(art=>(
                <TableRow key={art.id}>
                  <TD style={{paddingLeft:16,fontFamily:"monospace",fontSize:12,opacity:0.45,whiteSpace:"nowrap"}}>{art.id}</TD>
                  <TD style={{maxWidth:260}}>
                    <div style={{fontWeight:600,fontSize:13}}>{art.title}</div>
                    <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                      {art.tags.map(t=><span key={t} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"rgb(var(--hi5-accent)/0.08)",color:"rgb(var(--hi5-accent))",fontWeight:600}}>{t}</span>)}
                    </div>
                  </TD>
                  <TD style={{fontSize:12,opacity:0.55}}>{art.category}</TD>
                  <TD><StatusBadge status={art.status} config={STATUS_CFG}/></TD>
                  <TD><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={art.author} size={24}/><span style={{fontSize:12}}>{art.author}</span></div></TD>
                  <TD><div style={{display:"flex",alignItems:"center",gap:5,fontSize:12}}><Eye size={12} style={{opacity:0.40}}/>{art.views.toLocaleString()}</div></TD>
                  <TD>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:40,height:5,borderRadius:3,background:"rgb(var(--hi5-border)/0.12)",overflow:"hidden"}}>
                        <div style={{width:`${art.helpful}%`,height:"100%",background:"#22c55e",borderRadius:3}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,color:"#22c55e"}}>{art.helpful}%</span>
                    </div>
                  </TD>
                  <TD style={{fontSize:12,opacity:0.40,whiteSpace:"nowrap"}}>{fmt(art.lastUpdated)}</TD>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgb(var(--hi5-border)/0.08)",fontSize:12,opacity:0.40}}>Showing {filtered.length} of {KB_ARTICLES.length} articles</div>
      </Card>
    </div>
  );
}
