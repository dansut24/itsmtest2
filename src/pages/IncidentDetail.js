// src/pages/IncidentDetail.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock, User, Tag, Building2, AlertCircle,
  CheckCircle2, RotateCcw, XCircle, Flame, ArrowUp,
  MessageSquare, Paperclip, Activity, ChevronRight,
  Send, UserCheck, Edit3, MoreVertical,
} from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_INCIDENT = {
  id: 42,
  ref:         "INC-0042",
  title:       "VPN access failure for remote workers",
  description: "Multiple users are reporting complete inability to connect to the corporate VPN. The issue started at approximately 09:15 and is affecting all remote workers. The VPN service appears to be running but connections are timing out at the authentication stage. Users are unable to access internal systems, shared drives, or the intranet.",
  priority:    "Critical",
  status:      "In Progress",
  category:    "Network",
  team:        "Network Ops",
  assignee:    "Priya R.",
  reporter:    "Sarah K.",
  created:     new Date(Date.now() - 92 * 60 * 1000),
  updated:     new Date(Date.now() - 8 * 60 * 1000),
  slaMinutes:  60,
  slaRemaining: -32,
  tags:        ["VPN", "Authentication", "Remote Work", "P1"],
};

const TIMELINE = [
  { id: 1, type: "comment",   user: "Sarah K.",   time: new Date(Date.now() - 90 * 60000), text: "Issue first reported. Multiple users confirmed affected across all departments.", avatar: "SK" },
  { id: 2, type: "status",    user: "System",     time: new Date(Date.now() - 88 * 60000), text: "Status changed from Open → In Progress", isSystem: true },
  { id: 3, type: "assign",    user: "System",     time: new Date(Date.now() - 87 * 60000), text: "Assigned to Priya R. (Network Ops)", isSystem: true },
  { id: 4, type: "comment",   user: "Priya R.",   time: new Date(Date.now() - 72 * 60000), text: "Investigated authentication logs. Seeing repeated TLS handshake failures. Suspect a certificate issue post last night's maintenance window.", avatar: "PR" },
  { id: 5, type: "comment",   user: "James T.",   time: new Date(Date.now() - 55 * 60000), text: "Confirmed — the VPN gateway certificate expired overnight. Working on emergency renewal now.", avatar: "JT" },
  { id: 6, type: "comment",   user: "Priya R.",   time: new Date(Date.now() - 22 * 60000), text: "Certificate renewed and deployed to primary gateway. Testing connectivity now with 5 users.", avatar: "PR" },
  { id: 7, type: "comment",   user: "Alex M.",    time: new Date(Date.now() - 8 * 60000),  text: "Can confirm VPN is working on my end. Recommend we monitor for 30 min before resolving.", avatar: "AM" },
];

const STATUS_STEPS = ["Open", "In Progress", "Resolved", "Closed"];

const PRIORITY_CONFIG = {
  Critical: { color: "#ef4444", bg: "rgb(239 68 68/0.12)", border: "rgb(239 68 68/0.28)", Icon: Flame },
  High:     { color: "#f97316", bg: "rgb(249 115 22/0.12)", border: "rgb(249 115 22/0.28)", Icon: ArrowUp },
  Medium:   { color: "#ca8a04", bg: "rgb(234 179 8/0.12)",  border: "rgb(234 179 8/0.28)",  Icon: AlertCircle },
  Low:      { color: "#64748b", bg: "rgb(148 163 184/0.12)",border: "rgb(148 163 184/0.28)",Icon: AlertCircle },
};

const STATUS_CONFIG = {
  "Open":        { color: "#2563eb", bg: "rgb(59 130 246/0.12)",  border: "rgb(59 130 246/0.25)",  Icon: AlertCircle },
  "In Progress": { color: "#7c3aed", bg: "rgb(168 85 247/0.12)",  border: "rgb(168 85 247/0.25)",  Icon: RotateCcw },
  "Resolved":    { color: "#059669", bg: "rgb(16 185 129/0.12)",  border: "rgb(16 185 129/0.25)",  Icon: CheckCircle2 },
  "Closed":      { color: "#475569", bg: "rgb(100 116 139/0.12)", border: "rgb(100 116 139/0.25)", Icon: XCircle },
};

const AVATAR_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f97316","#06b6d4","#10b981"];

function Avatar({ name, size }) {
  const sz = size || 32;
  const parts = (name || "?").trim().split(" ");
  const init = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
  const color = AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div style={{ width: sz, height: sz, borderRadius: "50%", background: color + "22", border: "1.5px solid " + color + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * 0.36, fontWeight: 700, color, flexShrink: 0 }}>
      {init}
    </div>
  );
}

function relativeTime(date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

const TABS = [
  { id: "timeline",    label: "Timeline",    Icon: Activity },
  { id: "comments",    label: "Comments",    Icon: MessageSquare },
  { id: "attachments", label: "Attachments", Icon: Paperclip },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab,      setTab]      = useState("timeline");
  const [comment,  setComment]  = useState("");
  const [status,   setStatus]   = useState(MOCK_INCIDENT.status);
  const [timeline, setTimeline] = useState(TIMELINE);

  const inc = { ...MOCK_INCIDENT, id: id || MOCK_INCIDENT.id, status };
  const priorityCfg = PRIORITY_CONFIG[inc.priority] || PRIORITY_CONFIG.Medium;
  const statusCfg   = STATUS_CONFIG[inc.status]     || STATUS_CONFIG["Open"];
  const stepIdx     = STATUS_STEPS.indexOf(inc.status);
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
    const next = STATUS_STEPS[stepIdx + 1];
    if (!next) return;
    setStatus(next);
    setTimeline((tl) => [...tl, {
      id: tl.length + 1, type: "status",
      user: "You", time: new Date(),
      text: "Status changed from " + status + " → " + next,
      isSystem: true,
    }]);
  }

  const nextStatus = STATUS_STEPS[stepIdx + 1];

  return (
    <div>
      <style>{`
        @keyframes sla-blink { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      {/* Back button + heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button type="button" onClick={() => navigate(-1)} className="hi5-btn-ghost no-min-touch"
          style={{ height: 36, width: 36, padding: 0, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", opacity: 0.5 }}>{inc.ref}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, background: priorityCfg.bg, color: priorityCfg.color, border: "1px solid " + priorityCfg.border, borderRadius: 8, padding: "2px 8px" }}>
              <priorityCfg.Icon size={10} /> {inc.priority}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, background: statusCfg.bg, color: statusCfg.color, border: "1px solid " + statusCfg.border, borderRadius: 8, padding: "2px 8px" }}>
              <statusCfg.Icon size={10} /> {inc.status}
            </span>
            {isSlaBreached && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, background: "rgb(239 68 68/0.12)", color: "#ef4444", border: "1px solid rgb(239 68 68/0.28)", borderRadius: 8, padding: "2px 8px", animation: "sla-blink 1.5s ease infinite" }}>
                <Clock size={10} /> SLA Breached {Math.abs(inc.slaRemaining)}m
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", margin: "6px 0 0", lineHeight: 1.2 }}>
            {inc.title}
          </h1>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
          {nextStatus && (
            <button type="button" className="hi5-btn-primary no-min-touch" onClick={advanceStatus}
              style={{ height: 36, padding: "0 14px", borderRadius: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <ChevronRight size={13} /> Mark {nextStatus}
            </button>
          )}
          <button type="button" className="hi5-btn-ghost no-min-touch"
            style={{ height: 36, width: 36, padding: 0, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* ── Status stepper ── */}
      <div className="hi5-card" style={{ padding: "18px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {/* Connector line */}
          <div style={{ position: "absolute", top: 16, left: "12.5%", right: "12.5%", height: 2, background: "rgb(var(--hi5-border)/0.15)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 16, left: "12.5%", height: 2, zIndex: 1, background: "linear-gradient(90deg, rgb(var(--hi5-accent)), rgb(var(--hi5-accent-2)))", width: stepIdx === 0 ? "0%" : stepIdx === 1 ? "33%" : stepIdx === 2 ? "67%" : "100%", transition: "width 400ms ease" }} />

          {STATUS_STEPS.map((step, i) => {
            const done    = i < stepIdx;
            const current = i === stepIdx;
            const scfg    = STATUS_CONFIG[step];
            return (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 2, flex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: current ? scfg.bg : done ? "rgb(var(--hi5-accent)/0.15)" : "rgb(var(--hi5-border)/0.08)",
                  border: current ? "2px solid " + scfg.color : done ? "2px solid rgb(var(--hi5-accent)/0.50)" : "2px solid rgb(var(--hi5-border)/0.20)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: current ? scfg.color : done ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-muted))",
                  boxShadow: current ? "0 0 0 4px " + scfg.color + "18" : "none",
                  transition: "all 300ms",
                }}>
                  {done ? <CheckCircle2 size={14} /> : <scfg.Icon size={14} />}
                </div>
                <div style={{ fontSize: 11, fontWeight: current ? 700 : 500, opacity: current ? 1 : done ? 0.7 : 0.4, whiteSpace: "nowrap" }}>{step}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>

        {/* Left: description + tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Description */}
          <div className="hi5-card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.6 }}>Description</div>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, display: "flex", alignItems: "center", minHeight: "unset" }}>
                <Edit3 size={13} />
              </button>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.82, margin: 0 }}>{inc.description}</p>
          </div>

          {/* Tabs */}
          <div className="hi5-card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Tab strip */}
            <div style={{ display: "flex", borderBottom: "1px solid rgb(var(--hi5-border)/0.10)", padding: "0 4px" }}>
              {TABS.map(({ id: tid, label, Icon }) => (
                <button key={tid} type="button" onClick={() => setTab(tid)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "13px 14px", borderRadius: 0, border: "none",
                    background: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: tab === tid ? 700 : 500,
                    color: tab === tid ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-fg))",
                    opacity: tab === tid ? 1 : 0.55,
                    borderBottom: "2px solid " + (tab === tid ? "rgb(var(--hi5-accent))" : "transparent"),
                    transition: "all 140ms", minHeight: "unset",
                  }}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: "16px 20px" }}>
              {tab === "timeline" && (
                <div>
                  {timeline.map((entry, i) => (
                    <div key={entry.id} style={{ display: "flex", gap: 12, marginBottom: i < timeline.length - 1 ? 18 : 0, position: "relative" }}>
                      {i < timeline.length - 1 && (
                        <div style={{ position: "absolute", left: 15, top: 36, bottom: -18, width: 1, background: "rgb(var(--hi5-border)/0.12)", zIndex: 0 }} />
                      )}
                      {entry.isSystem ? (
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgb(var(--hi5-border)/0.10)", border: "1px solid rgb(var(--hi5-border)/0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                          <Activity size={13} style={{ opacity: 0.5 }} />
                        </div>
                      ) : (
                        <div style={{ zIndex: 1, flexShrink: 0 }}>
                          <Avatar name={entry.user} size={30} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: entry.isSystem ? 0 : 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{entry.user}</span>
                          <span style={{ fontSize: 11, opacity: 0.45 }}>{relativeTime(entry.time)}</span>
                        </div>
                        {entry.isSystem ? (
                          <div style={{ fontSize: 12, opacity: 0.5, fontStyle: "italic" }}>{entry.text}</div>
                        ) : (
                          <div className="hi5-card" style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.55, background: "rgb(var(--hi5-border)/0.04)" }}>
                            {entry.text}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add comment */}
                  <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Avatar name="You" size={30} />
                    <div style={{ flex: 1, display: "flex", gap: 8 }}>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addComment(); }}
                        placeholder="Add a comment… (⌘Enter to send)"
                        rows={2}
                        style={{
                          flex: 1, resize: "vertical", minHeight: 64,
                          borderRadius: 12, padding: "10px 12px",
                          background: "rgb(var(--hi5-border)/0.06)",
                          border: "1px solid rgb(var(--hi5-border)/0.15)",
                          outline: "none", fontSize: 13, color: "rgb(var(--hi5-fg))",
                          fontFamily: "inherit", lineHeight: 1.5,
                          transition: "border-color 140ms",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgb(var(--hi5-accent)/0.40)"}
                        onBlur={e => e.target.style.borderColor = "rgb(var(--hi5-border)/0.15)"}
                      />
                      <button type="button" className="hi5-btn-primary no-min-touch" onClick={addComment} disabled={!comment.trim()}
                        style={{ height: 36, width: 36, padding: 0, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-end" }}>
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {tab === "comments" && (
                <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.4 }}>
                  <MessageSquare size={28} style={{ margin: "0 auto 10px", display: "block" }} />
                  <div style={{ fontSize: 14 }}>Comments shown in Timeline</div>
                </div>
              )}
              {tab === "attachments" && (
                <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.4 }}>
                  <Paperclip size={28} style={{ margin: "0 auto 10px", display: "block" }} />
                  <div style={{ fontSize: 14 }}>No attachments yet</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: metadata rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Key details */}
          <div className="hi5-card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Details</div>
            {[
              { label: "Assignee",  Icon: User,      value: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={inc.assignee} size={22} />
                  <span style={{ fontSize: 13 }}>{inc.assignee}</span>
                  <button type="button" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", opacity: 0.5, minHeight: "unset" }}><Edit3 size={11} /></button>
                </div>
              )},
              { label: "Reporter",  Icon: User,      value: <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={inc.reporter} size={22} /><span style={{ fontSize: 13 }}>{inc.reporter}</span></div> },
              { label: "Team",      Icon: Building2, value: inc.team },
              { label: "Category",  Icon: Tag,       value: inc.category },
              { label: "Created",   Icon: Clock,     value: relativeTime(inc.created) },
              { label: "Updated",   Icon: Clock,     value: relativeTime(inc.updated) },
            ].map(({ label, Icon, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgb(var(--hi5-border)/0.08)", border: "1px solid rgb(var(--hi5-border)/0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} style={{ opacity: 0.55 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.45, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 1 }}>{label}</div>
                  {typeof value === "string"
                    ? <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                    : value}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="hi5-card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {inc.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8, background: "rgb(var(--hi5-accent)/0.10)", color: "rgb(var(--hi5-accent))", border: "1px solid rgb(var(--hi5-accent)/0.22)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="hi5-card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Assign to me",       Icon: UserCheck, color: "rgb(var(--hi5-accent))" },
                { label: "Link to Problem",     Icon: Activity,  color: "#7c3aed" },
                { label: "Raise Change",        Icon: ChevronRight, color: "#059669" },
              ].map(({ label, Icon, color }) => (
                <button key={label} type="button"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "1px solid rgb(var(--hi5-border)/0.12)", background: "transparent", cursor: "pointer", fontSize: 13, color: "rgb(var(--hi5-fg))", textAlign: "left", transition: "background 120ms, border-color 120ms", minHeight: "unset" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgb(var(--hi5-border)/0.06)"; e.currentTarget.style.borderColor = "rgb(var(--hi5-border)/0.20)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgb(var(--hi5-border)/0.12)"; }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: color + "18", border: "1px solid " + color + "30", color, flexShrink: 0 }}>
                    <Icon size={13} />
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .inc-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
