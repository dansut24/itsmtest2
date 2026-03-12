// src/pages/Reports.js
import React, { useState } from "react";
import { BarChart2, TrendingUp, Download, FileText, AlertCircle, Clock, CheckCircle2, Layers } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageHeader, Card, StatCard } from "../components/ui/PageHeader";

const MONTH_DATA = [
  {month:"Sep",incidents:42,requests:28,changes:8},
  {month:"Oct",incidents:38,requests:31,changes:11},
  {month:"Nov",incidents:51,requests:24,changes:7},
  {month:"Dec",incidents:35,requests:19,changes:5},
  {month:"Jan",incidents:44,requests:33,changes:14},
  {month:"Feb",incidents:29,requests:27,changes:9},
  {month:"Mar",incidents:37,requests:31,changes:12},
];
const SLA_DATA = [{name:"On Track",value:68,color:"#22c55e"},{name:"At Risk",value:18,color:"#f97316"},{name:"Breached",value:14,color:"#ef4444"}];
const CATEGORY_DATA = [
  {cat:"Hardware",count:24},{cat:"Software",count:31},{cat:"Network",count:18},
  {cat:"Access",count:22},{cat:"Service",count:15},{cat:"Other",count:8},
];
const RESOLUTION_DATA = [
  {month:"Sep",avgH:5.2},{month:"Oct",avgH:4.8},{month:"Nov",avgH:6.1},
  {month:"Dec",avgH:4.3},{month:"Jan",avgH:4.7},{month:"Feb",avgH:3.9},{month:"Mar",avgH:4.1},
];

const REPORTS = [
  {id:"RPT-001",name:"Monthly SLA Summary",type:"SLA",lastRun:"2026-03-01",schedule:"Monthly"},
  {id:"RPT-002",name:"Incident Volume by Priority",type:"Incident",lastRun:"2026-03-05",schedule:"Weekly"},
  {id:"RPT-003",name:"Change Success Rate",type:"Change",lastRun:"2026-02-28",schedule:"Monthly"},
  {id:"RPT-004",name:"Asset Warranty Report",type:"Asset",lastRun:"2026-03-10",schedule:"Quarterly"},
  {id:"RPT-005",name:"Knowledge Base Effectiveness",type:"Knowledge",lastRun:"2026-02-15",schedule:"Monthly"},
  {id:"RPT-006",name:"Team Performance Dashboard",type:"Performance",lastRun:"2026-03-07",schedule:"Weekly"},
];

const CHART_COLORS = ["#00c1ff","#ff4fe1","#ffc42d","#22c55e","#6366f1","#f97316"];
const tooltipStyle = {background:"rgb(12 14 18/0.90)",border:"1px solid rgb(255 255 255/0.10)",borderRadius:10,fontSize:12,backdropFilter:"blur(12px)"};

export default function Reports() {
  const [activeTab,setActiveTab]=useState("overview");
  const tabs = [{k:"overview",label:"Overview"},{k:"incidents",label:"Incidents"},{k:"sla",label:"SLA"},{k:"saved",label:"Saved Reports"}];
  return (
    <div>
      <PageHeader title="Reports" subtitle="Analytics, trends, and performance metrics" actions={
        <button type="button" className="hi5-btn-ghost no-min-touch"
          style={{height:36,padding:"0 14px",borderRadius:10,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
          <Download size={14}/> Export
        </button>
      }/>
      {/* Tab bar */}
      <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"1px solid rgb(var(--hi5-border)/0.10)",paddingBottom:0}}>
        {tabs.map(t=>(
          <button key={t.k} type="button" onClick={()=>setActiveTab(t.k)}
            style={{padding:"8px 14px",fontSize:13,fontWeight:activeTab===t.k?700:500,background:"none",border:"none",cursor:"pointer",
              borderBottom:activeTab===t.k?"2px solid rgb(var(--hi5-accent))":"2px solid transparent",
              color:activeTab===t.k?"rgb(var(--hi5-accent))":"rgb(var(--hi5-fg)/0.55)",
              transition:"all 130ms",marginBottom:-1}}>
            {t.label}
          </button>
        ))}
      </div>
      {(activeTab==="overview"||activeTab==="incidents") && (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
            <StatCard label="Incidents (MTD)" value="37" icon={<AlertCircle size={18}/>} color="#00c1ff" trend={{up:false,label:"-19%"}}/>
            <StatCard label="Avg Resolution" value="4.1h" icon={<Clock size={18}/>} color="#22c55e" trend={{up:true,label:"-0.6h"}}/>
            <StatCard label="SLA Compliance" value="86%" icon={<CheckCircle2 size={18}/>} color="#6366f1" trend={{up:true,label:"+4%"}}/>
            <StatCard label="Changes (MTD)" value="12" icon={<Layers size={18}/>} color="#ffc42d"/>
            <StatCard label="Open Problems" value="7" icon={<TrendingUp size={18}/>} color="#f97316"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16,marginBottom:16}}>
            <Card>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>Volume Over Time</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MONTH_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--hi5-border)/0.08)"/>
                  <XAxis dataKey="month" tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={tooltipStyle} cursor={{fill:"rgb(var(--hi5-accent)/0.05)"}}/>
                  <Legend wrapperStyle={{fontSize:11,opacity:0.60}}/>
                  <Bar dataKey="incidents" name="Incidents" fill="#00c1ff" radius={[4,4,0,0]}/>
                  <Bar dataKey="requests"  name="Requests"  fill="#ff4fe1" radius={[4,4,0,0]}/>
                  <Bar dataKey="changes"   name="Changes"   fill="#ffc42d" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>Avg Resolution Time (hours)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={RESOLUTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--hi5-border)/0.08)"/>
                  <XAxis dataKey="month" tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={tooltipStyle}/>
                  <Line type="monotone" dataKey="avgH" stroke="#22c55e" strokeWidth={2} dot={{fill:"#22c55e",r:4}} name="Avg Hours"/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
            <Card>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>Incidents by Category</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CATEGORY_DATA} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--hi5-border)/0.08)" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="cat" tick={{fontSize:11,opacity:0.60}} axisLine={false} tickLine={false} width={60}/>
                  <Tooltip contentStyle={tooltipStyle} cursor={{fill:"rgb(var(--hi5-accent)/0.05)"}}/>
                  <Bar dataKey="count" name="Incidents" radius={[0,4,4,0]}>
                    {CATEGORY_DATA.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>SLA Status</div>
              <div style={{display:"flex",alignItems:"center",gap:20}}>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={SLA_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                      {SLA_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {SLA_DATA.map(s=>(
                    <div key={s.name} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                      <span style={{fontSize:13,fontWeight:600}}>{s.name}</span>
                      <span style={{fontSize:18,fontWeight:800,color:s.color,marginLeft:"auto"}}>{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
      {activeTab==="sla" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
          <Card style={{gridColumn:"1/-1"}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>SLA Compliance Trend</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[{m:"Sep",rate:78},{m:"Oct",rate:82},{m:"Nov",rate:75},{m:"Dec",rate:88},{m:"Jan",rate:84},{m:"Feb",rate:87},{m:"Mar",rate:86}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--hi5-border)/0.08)"/>
                <XAxis dataKey="m" tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                <YAxis domain={[60,100]} tick={{fontSize:11,opacity:0.50}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Line type="monotone" dataKey="rate" stroke="#00c1ff" strokeWidth={2.5} dot={{fill:"#00c1ff",r:5}} name="Compliance %"/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
      {activeTab==="saved" && (
        <Card style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["Report Name","Type","Last Run","Schedule",""].map(h=>(
                <th key={h} style={{padding:"10px 16px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",opacity:0.45,textAlign:"left",borderBottom:"1px solid rgb(var(--hi5-border)/0.10)"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {REPORTS.map(r=>(
                <tr key={r.id} style={{borderBottom:"1px solid rgb(var(--hi5-border)/0.07)"}}>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:9,background:"rgb(var(--hi5-accent)/0.10)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgb(var(--hi5-accent))"}}>
                        <FileText size={15}/>
                      </div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{r.name}</div>
                        <div style={{fontSize:11,opacity:0.40,fontFamily:"monospace"}}>{r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:12,opacity:0.55}}>{r.type}</td>
                  <td style={{padding:"12px 16px",fontSize:12,opacity:0.50}}>{new Date(r.lastRun).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</td>
                  <td style={{padding:"12px 16px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:"rgb(var(--hi5-accent)/0.10)",color:"rgb(var(--hi5-accent))"}}>{r.schedule}</span></td>
                  <td style={{padding:"12px 16px"}}>
                    <button type="button" className="hi5-btn-ghost no-min-touch" style={{height:32,padding:"0 12px",borderRadius:8,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                      <Download size={12}/> Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
