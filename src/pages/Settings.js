// src/pages/Settings.js
import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Palette, Users, Database, Globe, Sliders, ChevronRight, Check } from "lucide-react";
import { Card, PageHeader } from "../components/ui/PageHeader";
import { useThemeStore } from "../store/itsmStore";

const NAV = [
  { k:"general",   label:"General",        icon:<SettingsIcon size={15}/> },
  { k:"appearance",label:"Appearance",      icon:<Palette size={15}/> },
  { k:"notifications",label:"Notifications",icon:<Bell size={15}/> },
  { k:"security",  label:"Security",        icon:<Shield size={15}/> },
  { k:"users",     label:"Users & Roles",   icon:<Users size={15}/> },
  { k:"data",      label:"Data & Storage",  icon:<Database size={15}/> },
  { k:"integrations",label:"Integrations",  icon:<Globe size={15}/> },
  { k:"advanced",  label:"Advanced",        icon:<Sliders size={15}/> },
];

function Toggle({value,onChange}){
  return (
    <button type="button" onClick={()=>onChange(!value)} style={{width:42,height:24,borderRadius:12,background:value?"rgb(0 193 255)":"rgb(var(--hi5-border)/0.20)",border:"none",cursor:"pointer",position:"relative",transition:"background 200ms",flexShrink:0}}>
      <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:value?21:3,transition:"left 200ms",boxShadow:"0 1px 4px rgb(0 0 0/0.20)"}}/>
    </button>
  );
}

function SettingRow({label,desc,children}){
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"14px 0",borderBottom:"1px solid rgb(var(--hi5-border)/0.08)"}}>
      <div>
        <div style={{fontSize:13,fontWeight:600}}>{label}</div>
        {desc&&<div style={{fontSize:12,opacity:0.45,marginTop:2}}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [tab,setTab]=useState("general");
  const {mode,setMode}=useThemeStore();
  const [notifs,setNotifs]=useState({email:true,browser:true,slack:false,incidents:true,changes:true,approvals:true,sla:true,daily:false});
  const [saved,setSaved]=useState(false);
  function save(){setSaved(true);setTimeout(()=>setSaved(false),2000);}
  const THEMES=[{v:"light",label:"Light"},{v:"dark",label:"Dark"},{v:"ocean",label:"Ocean"},{v:"forest",label:"Forest"},{v:"sunset",label:"Sunset"}];
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your platform preferences and configuration"/>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        {/* Side nav */}
        <Card style={{width:200,flexShrink:0,padding:6}}>
          {NAV.map(n=>(
            <button key={n.k} type="button" onClick={()=>setTab(n.k)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,border:"none",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:tab===n.k?700:400,
                background:tab===n.k?"rgb(var(--hi5-accent)/0.10)":"transparent",
                color:tab===n.k?"rgb(var(--hi5-accent))":"rgb(var(--hi5-fg)/0.70)",
                transition:"all 130ms"}}>
              {n.icon}{n.label}
              {tab===n.k&&<ChevronRight size={12} style={{marginLeft:"auto"}}/>}
            </button>
          ))}
        </Card>
        {/* Content */}
        <div style={{flex:1,minWidth:280}}>
          {tab==="general"&&(
            <Card>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>General Settings</div>
              <div style={{fontSize:12,opacity:0.45,marginBottom:16}}>Basic platform configuration</div>
              <SettingRow label="Organisation Name" desc="Displayed across the platform"><input defaultValue="Hi5Tech Ltd" style={{height:34,padding:"0 10px",borderRadius:9,border:"1px solid rgb(var(--hi5-border)/0.20)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none",width:180}}/></SettingRow>
              <SettingRow label="Timezone" desc="Used for all timestamps"><select defaultValue="Europe/London" style={{height:34,padding:"0 10px",borderRadius:9,border:"1px solid rgb(var(--hi5-border)/0.20)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none"}}><option>Europe/London</option><option>UTC</option><option>America/New_York</option></select></SettingRow>
              <SettingRow label="Date Format" desc="How dates are displayed"><select defaultValue="DD/MM/YYYY" style={{height:34,padding:"0 10px",borderRadius:9,border:"1px solid rgb(var(--hi5-border)/0.20)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none"}}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></SettingRow>
              <SettingRow label="Auto-assign Incidents" desc="Automatically route to available agents"><Toggle value={true} onChange={()=>{}}/></SettingRow>
              <SettingRow label="SLA Tracking" desc="Enable SLA timers and breach alerts"><Toggle value={true} onChange={()=>{}}/></SettingRow>
              <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
                <button type="button" onClick={save} className="hi5-btn-primary no-min-touch" style={{height:36,padding:"0 20px",borderRadius:10,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                  {saved?<><Check size={14}/>Saved</>:"Save Changes"}
                </button>
              </div>
            </Card>
          )}
          {tab==="appearance"&&(
            <Card>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Appearance</div>
              <div style={{fontSize:12,opacity:0.45,marginBottom:20}}>Customise how the platform looks</div>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Theme</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8}}>
                {THEMES.map(t=>(
                  <button key={t.v} type="button" onClick={()=>setMode(t.v)}
                    style={{padding:"10px 8px",borderRadius:12,border:mode===t.v?"2px solid rgb(var(--hi5-accent))":"1px solid rgb(var(--hi5-border)/0.18)",background:mode===t.v?"rgb(var(--hi5-accent)/0.08)":"transparent",cursor:"pointer",fontSize:12,fontWeight:mode===t.v?700:400,color:mode===t.v?"rgb(var(--hi5-accent))":undefined,display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all 150ms"}}>
                    <div style={{width:36,height:22,borderRadius:6,background:t.v==="dark"?"#1a1c22":t.v==="ocean"?"#0d1b2a":t.v==="forest"?"#0f1a0f":t.v==="sunset"?"#1a0d0d":"#f8f9fb",border:"1px solid rgb(0 0 0/0.10)"}}/>
                    {t.label}
                  </button>
                ))}
              </div>
              <SettingRow label="Compact Mode" desc="Reduce spacing for higher information density"><Toggle value={false} onChange={()=>{}}/></SettingRow>
              <SettingRow label="Animated Background" desc="Show blob background effects"><Toggle value={true} onChange={()=>{}}/></SettingRow>
            </Card>
          )}
          {tab==="notifications"&&(
            <Card>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Notifications</div>
              <div style={{fontSize:12,opacity:0.45,marginBottom:16}}>Control when and how you get notified</div>
              <div style={{fontWeight:600,fontSize:12,opacity:0.45,marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>Channels</div>
              <SettingRow label="Email Notifications" desc="Receive updates via email"><Toggle value={notifs.email} onChange={v=>setNotifs(n=>({...n,email:v}))}/></SettingRow>
              <SettingRow label="Browser Push" desc="In-browser notifications"><Toggle value={notifs.browser} onChange={v=>setNotifs(n=>({...n,browser:v}))}/></SettingRow>
              <SettingRow label="Slack Integration" desc="Post to a Slack channel"><Toggle value={notifs.slack} onChange={v=>setNotifs(n=>({...n,slack:v}))}/></SettingRow>
              <div style={{fontWeight:600,fontSize:12,opacity:0.45,marginTop:16,marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>Events</div>
              <SettingRow label="New Incidents" desc="When a new incident is raised"><Toggle value={notifs.incidents} onChange={v=>setNotifs(n=>({...n,incidents:v}))}/></SettingRow>
              <SettingRow label="Change Approvals" desc="When a change requires sign-off"><Toggle value={notifs.changes} onChange={v=>setNotifs(n=>({...n,changes:v}))}/></SettingRow>
              <SettingRow label="Approval Requests" desc="When you have pending approvals"><Toggle value={notifs.approvals} onChange={v=>setNotifs(n=>({...n,approvals:v}))}/></SettingRow>
              <SettingRow label="SLA Breach Warnings" desc="30 minutes before SLA breach"><Toggle value={notifs.sla} onChange={v=>setNotifs(n=>({...n,sla:v}))}/></SettingRow>
              <SettingRow label="Daily Summary" desc="Daily digest of open items"><Toggle value={notifs.daily} onChange={v=>setNotifs(n=>({...n,daily:v}))}/></SettingRow>
            </Card>
          )}
          {tab==="security"&&(
            <Card>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Security</div>
              <div style={{fontSize:12,opacity:0.45,marginBottom:16}}>Authentication and access control</div>
              <SettingRow label="Two-Factor Authentication" desc="Require 2FA for all users"><Toggle value={true} onChange={()=>{}}/></SettingRow>
              <SettingRow label="Single Sign-On (SSO)" desc="Enable SAML/OIDC SSO"><Toggle value={false} onChange={()=>{}}/></SettingRow>
              <SettingRow label="Session Timeout" desc="Auto-logout after inactivity"><select style={{height:34,padding:"0 10px",borderRadius:9,border:"1px solid rgb(var(--hi5-border)/0.20)",background:"rgb(var(--hi5-card)/0.80)",fontSize:13,outline:"none"}}><option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>8 hours</option></select></SettingRow>
              <SettingRow label="IP Allowlist" desc="Restrict access to specific IPs"><Toggle value={false} onChange={()=>{}}/></SettingRow>
              <SettingRow label="Audit Logging" desc="Log all user actions"><Toggle value={true} onChange={()=>{}}/></SettingRow>
            </Card>
          )}
          {(tab==="users"||tab==="data"||tab==="integrations"||tab==="advanced")&&(
            <Card style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 24px",textAlign:"center",gap:12}}>
              <div style={{fontSize:36,opacity:0.15}}>🚧</div>
              <div style={{fontWeight:700,fontSize:15}}>{NAV.find(n=>n.k===tab)?.label}</div>
              <div style={{fontSize:13,opacity:0.45,maxWidth:280}}>This section is coming soon. Configuration options will appear here.</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
