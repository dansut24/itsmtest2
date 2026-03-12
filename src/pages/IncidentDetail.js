// src/pages/IncidentDetail.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock, User, Tag, Building2, AlertCircle,
  CheckCircle2, RotateCcw, XCircle, Flame, ArrowUp,
  Paperclip, Activity, ChevronRight,
  Send, UserCheck, Edit3, MoreVertical, Monitor,
} from "lucide-react";
 
// ---- Mock data ---------------------------------------------------------------
const MOCK_INCIDENT = {
  id: 42,
  ref:          "INC-0042",
  title:        "VPN access failure for remote workers",
  description:  "Multiple users are reporting complete inability to connect to the corporate VPN. The issue started at approximately 09:15 and is affecting all remote workers. The VPN service appears to be running but connections are timing out at the authentication stage. Users are unable to access internal systems, shared drives, or the intranet.",
  priority:     "Critical",
  status:       "In Progress",
  category:     "Network",
  team:         "Network Ops",
  assignee:     "Priya R.",
  reporter:     "Sarah K.",
  created:      new Date(Date.now() - 92 * 60 * 1000),
  updated:      new Date(Date.now() - 8  * 60 * 1000),
  slaMinutes:   60,
  slaRemaining: -32,
  tags:         ["VPN", "Authentication", "Remote Work", "P1"],
};
 
const TIMELINE = [
  { id: 1, type: "comment", user: "Sarah K.", time: new Date(Date.now() - 90 * 60000), text: "Issue first reported. Multiple users confirmed affected across all departments.", avatar: "SK" },
  { id: 2, isSystem: true,  user: "System",  time: new Date(Date.now() - 88 * 60000), text: "Status changed from Open to In Progress" },
  { id: 3, isSystem: true,  user: "System",  time: new Date(Date.now() - 87 * 60000), text: "Assigned to Priya R. (Network Ops)" },
  { id: 4, type: "comment", user: "Priya R.", time: new Date(Date.now() - 72 * 60000), text: "Investigated authentication logs. Seeing repeated TLS handshake failures. Suspect a certificate issue post last night's maintenance window.", avatar: "PR" },
  { id: 5, type: "comment", user: "James T.", time: new Date(Date.now() - 55 * 60000), text: "Confirmed -- the VPN gateway certificate expired overnight. Working on emergency renewal now.", avatar: "JT" },
  { id: 6, type: "comment", user: "Priya R.", time: new Date(Date.now() - 22 * 60000), text: "Certificate renewed and deployed to primary gateway. Testing connectivity now with 5 users.", avatar: "PR" },
  { id: 7, type: "comment", user: "Alex M.",  time: new Date(Date.now() - 8  * 60000), text: "Can confirm VPN is working on my end. Recommend we monitor for 30 min before resolving.", avatar: "AM" },
];
 
const STATUS_STEPS = ["Open", "In Progress", "Resolved", "Closed"];
 
const PRIORITY_CFG = {
  Critical: { color: "#ef4444", bg: "rgb(239 68 68/0.12)",   border: "rgb(239 68 68/0.28)",   Icon: Flame },
  High:     { color: "#f97316", bg: "rgb(249 115 22/0.12)",  border: "rgb(249 115 22/0.28)",  Icon: ArrowUp },
  Medium:   { color: "#ca8a04", bg: "rgb(234 179 8/0.12)",   border: "rgb(234 179 8/0.28)",   Icon: AlertCircle },
  Low:      { color: "#64748b", bg: "rgb(148 163 184/0.12)", border: "rgb(148 163 184/0.28)", Icon: AlertCircle },
};
 
const STATUS_CFG = {
  "Open":        { color: "#2563eb", bg: "rgb(59 130 246/0.12)",  border: "rgb(59 130 246/0.25)",  Icon: AlertCircle },
  "In Progress": { color: "#7c3aed", bg: "rgb(168 85 247/0.12)",  border: "rgb(168 85 247/0.25)",  Icon: RotateCcw },
  "Resolved":    { color: "#059669", bg: "rgb(16 185 129/0.12)",  border: "rgb(16 185 129/0.25)",  Icon: CheckCircle2 },
  "Closed":      { color: "#475569", bg: "rgb(100 116 139/0.12)", border: "rgb(100 116 139/0.25)", Icon: XCircle },
};
 
const AVATAR_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f97316","#06b6d4","#10b981"];
function avatarColor(name) { return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length]; }
 
function Avatar({ name, size = 32 }) {
  const parts = (name || "?").trim().split(" ");
  const init  = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
  const c     = avatarColor(name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: c + "22", border: "1.5px solid " + c + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: c, flexShrink: 0 }}>
      {init}
    </div>
  );
}
 
function relTime(date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}
 
const TABS = [
  { id: "timeline",    label: "Timeline",    Icon: Activity },
  { id: "attachments", label: "Attachments", Icon: Paperclip },
];
 
// ---- useWindowWidth hook -----------------------------------------------------
function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}
 
// ---- StatusStepper -----------------------------------------------------------
function StatusStepper({ stepIdx }) {
  const w       = useWidth();
  const compact = w < 540;
 
  // Progress line: spans between first and last step circles
  // Each step takes 25% of the row. Circle centred at 12.5%, 37.5%, 62.5%, 87.5%
  const lineLeft  = "calc(12.5% + 16px)";
  const lineRight = "calc(12.5% + 16px)";
  const fillPct   = stepIdx === 0 ? 0 : stepIdx === 1 ? 33.3 : stepIdx === 2 ? 66.6 : 100;
 
  return (
    <div className="hi5-card" style={{ padding: compact ? "14px 12px" : "18px 24px", marginBottom: 16 }}>
      <div style={{ position: "relative" }}>
        {/* Background track */}
        <div style={{
          position: "absolute",
          top: 15, left: lineLeft, right: lineRight,
          height: 2,
          background: "rgb(12 14 18/0.10)",
          zIndex: 0,
        }} />
        {/* Fill track */}
        <div style={{
          position: "absolute",
          top: 15, left: lineLeft,
          height: 2,
          background: "linear-gradient(90deg,rgb(0 193 255),rgb(255 79 225))",
          width: "calc(" + fillPct + "% * 0.75)",
          zIndex: 1,
          transition: "width 400ms ease",
          borderRadius: 2,
        }} />
 
        {/* Steps row */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          {STATUS_STEPS.map((step, i) => {
            const done    = i < stepIdx;
            const current = i === stepIdx;
            const scfg    = STATUS_CFG[step];
            return (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "0 0 25%", minWidth: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: current ? scfg.bg : done ? "rgb(0 193 255/0.15)" : "rgb(12 14 18/0.06)",
                  border: "2px solid " + (current ? scfg.color : done ? "rgb(0 193 255/0.50)" : "rgb(12 14 18/0.15)"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: current ? scfg.color : done ? "rgb(0 193 255)" : "rgb(12 14 18/0.30)",
                  boxShadow: current ? "0 0 0 4px " + scfg.color + "18" : "none",
                  transition: "all 300ms",
                }}>
                  {done ? <CheckCircle2 size={14} /> : <scfg.Icon size={14} />}
                </div>
                <div style={{
                  fontSize: compact ? 10 : 11,
                  fontWeight: current ? 700 : 500,
                  opacity: current ? 1 : done ? 0.65 : 0.38,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxWidth: "100%",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                }}>
                  {compact && step === "In Progress" ? "In Prog." : step}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
 
// ---- Main component ----------------------------------------------------------
export default function IncidentDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const width    = useWidth();
  const isMobile = width < 860;
 
  const [tab,      setTab]      = useState("timeline");
  const [comment,  setComment]  = useState("");
  const [status,   setStatus]   = useState(MOCK_INCIDENT.status);
  const [timeline, setTimeline] = useState(TIMELINE);
  const [showMeta, setShowMeta] = useState(false);
 
  const inc         = { ...MOCK_INCIDENT, id: id || MOCK_INCIDENT.id, status };
  const priorityCfg = PRIORITY_CFG[inc.priority] || PRIORITY_CFG.Medium;
  const statusCfg   = STATUS_CFG[inc.status]     || STATUS_CFG["Open"];
  const stepIdx     = STATUS_STEPS.indexOf(inc.status);
  const nextStatus  = STATUS_STEPS[stepIdx + 1];
  const isSlaBreached = inc.slaRemaining < 0;
 
  function addComment() {
    if (!comment.trim()) return;
    setTimeline((tl) => [...tl, {
      id: tl.length + 1, type: "comment",
      user: "You", time: new Date(),
      text: comment.trim(), avatar: "YO",
    }]);
    setComment("");
  }
 
  function advanceStatus() {
    if (!nextStatus) return;
    setTimeline((tl) => [...tl, {
      id: tl.length + 1, isSystem: true,
      user: "You", time: new Date(),
      text: "Status changed from " + status + " to " + nextStatus,
    }]);
    setStatus(nextStatus);
  }
 
  // ---- Metadata panel (shared between sidebar and mobile drawer) -------------
  const MetaPanel = () => (
    <>
      {/* Details card */}
      <div className="hi5-card" style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>Details</div>
        {[
          { label: "Assignee", Icon: User, content: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={inc.assignee} size={22} />
              <span style={{ fontSize: 13 }}>{inc.assignee}</span>
              <button type="button" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", opacity: 0.4, minHeight: "unset", display: "flex" }}><Edit3 size={11} /></button>
            </div>
          )},
          { label: "Reporter", Icon: User, content: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={inc.reporter} size={22} />
              <span style={{ fontSize: 13 }}>{inc.reporter}</span>
            </div>
          )},
          { label: "Team",     Icon: Building2, content: <span style={{ fontSize: 13 }}>{inc.team}</span> },
          { label: "Category", Icon: Tag,       content: <span style={{ fontSize: 13 }}>{inc.category}</span> },
          { label: "Asset",    Icon: Monitor,   content: <span style={{ fontSize: 13 }}>VPN-GW-01</span> },
          { label: "Created",  Icon: Clock,     content: <span style={{ fontSize: 13 }}>{relTime(inc.created)}</span> },
          { label: "Updated",  Icon: Clock,     content: <span style={{ fontSize: 13 }}>{relTime(inc.updated)}</span> },
        ].map(({ label, Icon, content }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgb(12 14 18/0.06)", border: "1px solid rgb(12 14 18/0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={12} style={{ opacity: 0.5 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.4, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
              {content}
            </div>
          </div>
        ))}
      </div>
 
      {/* Tags */}
      <div className="hi5-card" style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>Tags</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {inc.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8, background: "rgb(0 193 255/0.10)", color: "rgb(0 193 255)", border: "1px solid rgb(0 193 255/0.22)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
 
      {/* Quick actions */}
      <div className="hi5-card" style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "Assign to me",   Icon: UserCheck,     color: "rgb(0 193 255)" },
            { label: "Link to Problem", Icon: Activity,     color: "#7c3aed" },
            { label: "Raise Change",    Icon: ChevronRight, color: "#059669" },
          ].map(({ label, Icon, color }) => (
            <button key={label} type="button"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "1px solid rgb(12 14 18/0.12)", background: "transparent", cursor: "pointer", fontSize: 13, textAlign: "left", transition: "background 120ms", minHeight: "unset", width: "100%" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgb(12 14 18/0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: color + "18", border: "1px solid " + color + "30", color, flexShrink: 0 }}>
                <Icon size={13} />
              </div>
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
 
  return (
    <div>
      <style>{`
        @keyframes sla-blink { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
 
      {/* ---- Header --------------------------------------------------------- */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
        <button type="button" onClick={() => navigate(-1)} className="hi5-btn-ghost no-min-touch"
          style={{ height: 36, width: 36, padding: 0, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <ArrowLeft size={16} />
        </button>
 
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Ref + badges row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", opacity: 0.5 }}>{inc.ref}</span>
 
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, background: priorityCfg.bg, color: priorityCfg.color, border: "1px solid " + priorityCfg.border, borderRadius: 8, padding: "2px 8px", whiteSpace: "nowrap" }}>
              <priorityCfg.Icon size={10} /> {inc.priority}
            </span>
 
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, background: statusCfg.bg, color: statusCfg.color, border: "1px solid " + statusCfg.border, borderRadius: 8, padding: "2px 8px", whiteSpace: "nowrap" }}>
              <statusCfg.Icon size={10} /> {inc.status}
            </span>
 
            {isSlaBreached && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, background: "rgb(239 68 68/0.12)", color: "#ef4444", border: "1px solid rgb(239 68 68/0.28)", borderRadius: 8, padding: "2px 8px", animation: "sla-blink 1.5s ease infinite", whiteSpace: "nowrap" }}>
                <Clock size={10} /> SLA Breached {Math.abs(inc.slaRemaining)}m
              </span>
            )}
          </div>
 
          <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.25 }}>
            {inc.title}
          </h1>
        </div>
 
        {/* Action buttons */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
          {nextStatus && (
            <button type="button" className="hi5-btn-primary no-min-touch" onClick={advanceStatus}
              style={{ height: 36, padding: "0 12px", borderRadius: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <CheckCircle2 size={13} />
              {isMobile ? nextStatus : "Mark " + nextStatus}
            </button>
          )}
          {isMobile && (
            <button type="button" className="hi5-btn-ghost no-min-touch" onClick={() => setShowMeta(true)}
              style={{ height: 36, width: 36, padding: 0, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MoreVertical size={15} />
            </button>
          )}
        </div>
      </div>
 
      {/* ---- Status stepper ------------------------------------------------- */}
      <StatusStepper stepIdx={stepIdx} />
 
      {/* ---- Two-column / single-column layout ------------------------------ */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 292px", gap: 14, alignItems: "start" }}>
 
        {/* Left: description + tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
 
          {/* Description */}
          <div className="hi5-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.55 }}>Description</div>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, display: "flex", alignItems: "center", minHeight: "unset" }}>
                <Edit3 size={13} />
              </button>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.68, opacity: 0.8, margin: 0 }}>{inc.description}</p>
          </div>
 
          {/* Tabs */}
          <div className="hi5-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid rgb(12 14 18/0.08)", padding: "0 4px" }}>
              {TABS.map(({ id: tid, label, Icon }) => (
                <button key={tid} type="button" onClick={() => setTab(tid)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "12px 14px", border: "none", background: "none",
                    cursor: "pointer", fontSize: 13, fontWeight: tab === tid ? 700 : 500,
                    color: tab === tid ? "rgb(0 193 255)" : "inherit",
                    opacity: tab === tid ? 1 : 0.5,
                    borderBottom: "2px solid " + (tab === tid ? "rgb(0 193 255)" : "transparent"),
                    transition: "all 140ms", minHeight: "unset", borderRadius: 0,
                  }}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
 
            <div style={{ padding: "16px 18px" }}>
              {/* Timeline */}
              {tab === "timeline" && (
                <div>
                  {timeline.map((entry, i) => (
                    <div key={entry.id} style={{ display: "flex", gap: 10, marginBottom: i < timeline.length - 1 ? 16 : 0, position: "relative" }}>
                      {i < timeline.length - 1 && (
                        <div style={{ position: "absolute", left: 14, top: 32, bottom: -16, width: 1, background: "rgb(12 14 18/0.10)", zIndex: 0 }} />
                      )}
 
                      {entry.isSystem ? (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgb(12 14 18/0.06)", border: "1px solid rgb(12 14 18/0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                          <Activity size={12} style={{ opacity: 0.45 }} />
                        </div>
                      ) : (
                        <div style={{ zIndex: 1, flexShrink: 0 }}>
                          <Avatar name={entry.user} size={28} />
                        </div>
                      )}
 
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: entry.isSystem ? 0 : 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{entry.user}</span>
                          <span style={{ fontSize: 11, opacity: 0.4 }}>{relTime(entry.time)}</span>
                        </div>
                        {entry.isSystem ? (
                          <div style={{ fontSize: 12, opacity: 0.45, fontStyle: "italic" }}>{entry.text}</div>
                        ) : (
                          <div style={{ padding: "9px 13px", borderRadius: 12, fontSize: 13, lineHeight: 1.58, background: "rgb(12 14 18/0.04)", border: "1px solid rgb(12 14 18/0.07)" }}>
                            {entry.text}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
 
                  {/* Comment composer */}
                  <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Avatar name="You" size={28} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addComment(); }}
                        placeholder="Add a comment... (Cmd+Enter to send)"
                        rows={2}
                        style={{
                          width: "100%", resize: "vertical", minHeight: 60,
                          borderRadius: 12, padding: "10px 12px",
                          background: "rgb(12 14 18/0.04)",
                          border: "1px solid rgb(12 14 18/0.12)",
                          outline: "none", fontSize: 13, lineHeight: 1.5,
                          fontFamily: "inherit", transition: "border-color 140ms",
                          boxSizing: "border-box",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgb(0 193 255/0.40)"}
                        onBlur={e  => e.target.style.borderColor = "rgb(12 14 18/0.12)"}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="button" className="hi5-btn-primary no-min-touch" onClick={addComment} disabled={!comment.trim()}
                          style={{ height: 34, padding: "0 14px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 6, opacity: comment.trim() ? 1 : 0.45 }}>
                          <Send size={12} /> Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
 
              {tab === "attachments" && (
                <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.35 }}>
                  <Paperclip size={28} style={{ margin: "0 auto 10px", display: "block" }} />
                  <div style={{ fontSize: 14 }}>No attachments yet</div>
                </div>
              )}
            </div>
          </div>
 
          {/* On mobile: show MetaPanel inline below tabs */}
          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <MetaPanel />
            </div>
          )}
        </div>
 
        {/* Right sidebar -- desktop only */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <MetaPanel />
          </div>
        )}
      </div>
 
      {/* ---- Mobile meta drawer --------------------------------------------- */}
      {isMobile && showMeta && (
        <div style={{ position: "fixed", inset: 0, zIndex: 600 }}>
          <div onClick={() => setShowMeta(false)} style={{ position: "absolute", inset: 0, background: "rgb(0 0 0/0.45)", backdropFilter: "blur(6px)" }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "var(--hi5-surface, #fff)",
            borderRadius: "20px 20px 0 0",
            padding: "20px 16px 32px",
            maxHeight: "85dvh",
            overflowY: "auto",
            animation: "slideUp 250ms cubic-bezier(0.34,1.20,0.64,1)",
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgb(12 14 18/0.15)", margin: "0 auto 20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <MetaPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
