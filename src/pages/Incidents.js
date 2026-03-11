// src/pages/Incidents.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle, Clock, User, ChevronRight, Plus, Search,
  Download, Flame, ArrowUp, CheckCircle2, RotateCcw,
  XCircle, UserCheck, Filter,
} from "lucide-react";
import ExportPreviewModal from "../components/ExportPreviewModal";
import { exportToCSV, exportToXLSX, exportToPDF } from "../utils/exportUtils";

const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const STATUSES   = ["Open", "In Progress", "Resolved", "Closed"];
const CATEGORIES = ["Hardware", "Software", "Network", "Access", "Service"];
const TEAMS      = ["Infrastructure", "Desktop Support", "Network Ops", "Security"];
const ASSIGNEES  = ["Sarah K.", "James T.", "Alex M.", "Priya R.", "Mohammed A.", "Unassigned"];

function slaMinutes(p) {
  return { Critical: 60, High: 240, Medium: 480, Low: 1440 }[p] ?? 480;
}

const INCIDENTS = Array.from({ length: 30 }, (_, i) => {
  const priority  = PRIORITIES[i % 4];
  const created   = new Date(Date.now() - (i * 47 + 12) * 60 * 1000);
  const elapsed   = Math.floor((Date.now() - created.getTime()) / 60000);
  const sla       = slaMinutes(priority);
  const remaining = sla - elapsed;
  return {
    id: 50 - i,
    ref: "INC-" + String(50 - i).padStart(4, "0"),
    title: [
      "VPN access failure for remote workers",
      "Core switch failure — floors 2-4 offline",
      "Email server intermittent connectivity",
      "Laptop won't boot after Windows update",
      "Printer offline in Finance dept",
      "CRM application throwing 500 errors",
      "Database backup job failing nightly",
      "MFA not working for new starters",
      "Wi-Fi dropping in Meeting Room B",
      "Shared drive inaccessible from VPN",
    ][i % 10],
    priority,
    status: STATUSES[i % 4],
    category: CATEGORIES[i % 5],
    team: TEAMS[i % 4],
    assignee: ASSIGNEES[i % 6],
    created,
    slaMinutes: sla,
    slaRemaining: remaining,
    slaBreached: remaining < 0,
    updates: Math.floor((i * 7) % 9),
  };
});

function relativeTime(date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

function formatSla(mins) {
  if (mins < 0) return Math.abs(mins) + "m overdue";
  if (mins < 60) return mins + "m left";
  return Math.floor(mins / 60) + "h " + (mins % 60) + "m left";
}

const PRIORITY_STRIPE = {
  Critical: { color: "#ef4444", bg: "linear-gradient(180deg,#ef4444,#dc2626)" },
  High:     { color: "#f97316", bg: "linear-gradient(180deg,#f97316,#ea580c)" },
  Medium:   { color: "#eab308", bg: "linear-gradient(180deg,#eab308,#ca8a04)" },
  Low:      { color: "#94a3b8", bg: "linear-gradient(180deg,#94a3b8,#64748b)" },
};

const PRIORITY_BADGE = {
  Critical: { bg: "rgb(239 68 68/0.12)",  color: "#ef4444",  border: "rgb(239 68 68/0.28)" },
  High:     { bg: "rgb(249 115 22/0.12)", color: "#f97316",  border: "rgb(249 115 22/0.28)" },
  Medium:   { bg: "rgb(234 179 8/0.12)",  color: "#ca8a04",  border: "rgb(234 179 8/0.28)" },
  Low:      { bg: "rgb(148 163 184/0.12)",color: "#64748b",  border: "rgb(148 163 184/0.28)" },
};

const STATUS_CONFIG = {
  "Open":        { bg: "rgb(59 130 246/0.12)",  color: "#2563eb", border: "rgb(59 130 246/0.25)",  Icon: AlertCircle },
  "In Progress": { bg: "rgb(168 85 247/0.12)",  color: "#7c3aed", border: "rgb(168 85 247/0.25)",  Icon: RotateCcw },
  "Resolved":    { bg: "rgb(16 185 129/0.12)",  color: "#059669", border: "rgb(16 185 129/0.25)",  Icon: CheckCircle2 },
  "Closed":      { bg: "rgb(100 116 139/0.12)", color: "#475569", border: "rgb(100 116 139/0.25)", Icon: XCircle },
};

function SmallBadge({ cfgKey, cfg, label }) {
  const IconComp = cfg.Icon || null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: "1px solid " + cfg.border,
      borderRadius: 8, padding: "2px 8px", whiteSpace: "nowrap",
    }}>
      {IconComp && <IconComp size={10} />}
      {label}
    </span>
  );
}

function AvatarInitials({ name, size }) {
  const sz = size || 26;
  const parts = (name || "?").trim().split(" ");
  const init = ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase() || "?";
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f97316","#06b6d4","#10b981"];
  const color = name !== "Unassigned" ? colors[(name || "").charCodeAt(0) % colors.length] : null;

  if (!color) return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%",
      background: "rgb(var(--hi5-border)/0.12)",
      border: "1.5px dashed rgb(var(--hi5-border)/0.30)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <User size={sz * 0.4} style={{ opacity: 0.4 }} />
    </div>
  );

  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%",
      background: color + "22", border: "1.5px solid " + color + "44",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: sz * 0.36, fontWeight: 700, color, flexShrink: 0,
    }}>{init}</div>
  );
}

const STATUS_FILTERS   = ["All", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

export default function Incidents() {
  const navigate = useNavigate();
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [hoveredId,      setHoveredId]      = useState(null);
  const [previewOpen,    setPreviewOpen]    = useState(false);
  const [exportType,     setExportType]     = useState("csv");
  const [exportTitle,    setExportTitle]    = useState("Incidents Export");
  const [exportOpen,     setExportOpen]     = useState(false);
  const exportRef = useRef(null);

  const filtered = INCIDENTS.filter((inc) => {
    const q = search.toLowerCase();
    return (
      (!search || inc.ref.toLowerCase().includes(q) || inc.title.toLowerCase().includes(q)) &&
      (statusFilter   === "All" || inc.status   === statusFilter) &&
      (priorityFilter === "All" || inc.priority === priorityFilter)
    );
  });

  const stats = {
    open:       INCIDENTS.filter((i) => i.status === "Open").length,
    inProgress: INCIDENTS.filter((i) => i.status === "In Progress").length,
    critical:   INCIDENTS.filter((i) => i.priority === "Critical" && i.status !== "Closed").length,
    breached:   INCIDENTS.filter((i) => i.slaBreached && i.status !== "Closed" && i.status !== "Resolved").length,
  };

  useEffect(() => {
    if (!exportOpen) return;
    const fn = (e) => { if (!exportRef.current?.contains(e.target)) setExportOpen(false); };
    window.addEventListener("pointerdown", fn, { capture: true });
    return () => window.removeEventListener("pointerdown", fn, { capture: true });
  }, [exportOpen]);

  return (
    <div>
      <style>{`
        @keyframes sla-pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        .inc-row { transition: transform 140ms ease, box-shadow 140ms ease; }
        .inc-row:hover { transform: translateY(-1px); }
      `}</style>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Open",         value: stats.open,       color: "#2563eb", Icon: AlertCircle },
          { label: "In Progress",  value: stats.inProgress, color: "#7c3aed", Icon: RotateCcw },
          { label: "Critical",     value: stats.critical,   color: "#ef4444", Icon: Flame },
          { label: "SLA Breached", value: stats.breached,   color: "#f97316", Icon: Clock },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="hi5-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em", color }}>{value}</div>
                <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.55, marginTop: 2 }}>{label}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", border: "1px solid " + color + "28", display: "flex", alignItems: "center", justifyContent: "center", color }}>
                <Icon size={17} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="hi5-card" style={{ padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: 8, background: "rgb(var(--hi5-border)/0.07)", border: "1px solid rgb(var(--hi5-border)/0.12)", borderRadius: 11, padding: "7px 12px" }}>
            <Search size={13} style={{ opacity: 0.45, flexShrink: 0 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search incidents…"
              style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "rgb(var(--hi5-fg))", flex: 1, minWidth: 0 }} />
          </div>

          {/* Status pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {STATUS_FILTERS.map((f) => (
              <button key={f} type="button" onClick={() => setStatusFilter(f)} style={{
                fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 8, cursor: "pointer", transition: "all 120ms", minHeight: "unset",
                border: "1px solid " + (statusFilter === f ? "rgb(var(--hi5-accent)/0.35)" : "rgb(var(--hi5-border)/0.15)"),
                background: statusFilter === f ? "rgb(var(--hi5-accent)/0.12)" : "transparent",
                color: statusFilter === f ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-fg))",
              }}>{f}</button>
            ))}
          </div>

          {/* Priority select */}
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 9, border: "1px solid rgb(var(--hi5-border)/0.15)", background: "transparent", color: "rgb(var(--hi5-fg))", cursor: "pointer" }}>
            {PRIORITY_FILTERS.map((p) => <option key={p}>{p === "All" ? "All Priorities" : p}</option>)}
          </select>

          {/* Export */}
          <div ref={exportRef} style={{ position: "relative" }}>
            <button type="button" className="hi5-btn-ghost no-min-touch" onClick={() => setExportOpen((v) => !v)}
              style={{ height: 34, padding: "0 12px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={13} /> Export
            </button>
            {exportOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 300, background: "rgb(255 255 255/0.97)", backdropFilter: "blur(16px)", border: "1px solid rgb(var(--hi5-border)/0.14)", borderRadius: 12, padding: 6, boxShadow: "0 16px 40px rgb(0 0 0/0.16)", minWidth: 160 }}>
                {["csv","xlsx","pdf"].map((t) => (
                  <button key={t} type="button" onClick={() => { setExportType(t); setExportOpen(false); setPreviewOpen(true); }}
                    style={{ display: "flex", alignItems: "center", width: "100%", padding: "8px 12px", borderRadius: 8, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "rgb(var(--hi5-fg))", textAlign: "left", transition: "background 120ms", minHeight: "unset" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgb(var(--hi5-border)/0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    Export as {t.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New */}
          <button type="button" className="hi5-btn-primary no-min-touch" onClick={() => navigate("/new-incident")}
            style={{ height: 34, padding: "0 14px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={13} /> New Incident
          </button>
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: 11, opacity: 0.45, marginBottom: 8, paddingLeft: 2 }}>
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.map((inc) => {
          const stripe = PRIORITY_STRIPE[inc.priority];
          const statusCfg = STATUS_CONFIG[inc.status] || STATUS_CONFIG["Open"];
          const priorityCfg = PRIORITY_BADGE[inc.priority];
          const isHov = hoveredId === inc.id;
          const slaCrit = inc.slaBreached || inc.slaRemaining < 30;
          const slaWarn = !inc.slaBreached && inc.slaRemaining < 120;

          return (
            <div key={inc.id} className="hi5-card inc-row"
              onClick={() => navigate("/incidents/" + inc.id)}
              onMouseEnter={() => setHoveredId(inc.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ padding: 0, overflow: "hidden", display: "flex", cursor: "pointer",
                boxShadow: isHov ? "0 8px 28px " + stripe.color + "22, 0 2px 8px rgb(0 0 0/0.07)" : undefined,
                border: isHov ? "1px solid " + stripe.color + "30" : undefined,
              }}>

              {/* Stripe */}
              <div style={{ width: 4, flexShrink: 0, background: stripe.bg, borderRadius: "3px 0 0 3px" }} />

              {/* Body */}
              <div style={{ flex: 1, minWidth: 0, padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Badges row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.02em", opacity: 0.5, fontFamily: "monospace" }}>{inc.ref}</span>
                    <SmallBadge cfg={{ ...priorityCfg, Icon: inc.priority === "Critical" ? Flame : inc.priority === "High" ? ArrowUp : null }} label={inc.priority} />
                    <SmallBadge cfg={statusCfg} label={inc.status} />
                    {inc.status !== "Resolved" && inc.status !== "Closed" && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, whiteSpace: "nowrap",
                        background: slaCrit ? "rgb(239 68 68/0.12)" : slaWarn ? "rgb(234 179 8/0.12)" : "rgb(var(--hi5-border)/0.08)",
                        color: slaCrit ? "#ef4444" : slaWarn ? "#ca8a04" : "rgb(var(--hi5-muted))",
                        border: "1px solid " + (slaCrit ? "rgb(239 68 68/0.25)" : slaWarn ? "rgb(234 179 8/0.25)" : "rgb(var(--hi5-border)/0.15)"),
                        animation: slaCrit ? "sla-pulse 1.5s ease infinite" : "none",
                      }}>
                        <Clock size={10} /> {formatSla(inc.slaRemaining)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>
                    {inc.title}
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, opacity: 0.45, display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} />{relativeTime(inc.created)}</span>
                    <span style={{ fontSize: 11, opacity: 0.45 }}>{inc.category}</span>
                    <span style={{ fontSize: 11, opacity: 0.45 }}>{inc.team}</span>
                    {inc.updates > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, background: "rgb(var(--hi5-border)/0.10)", border: "1px solid rgb(var(--hi5-border)/0.15)", borderRadius: 6, padding: "1px 6px", opacity: 0.65 }}>
                        {inc.updates} update{inc.updates !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Assignee + arrow */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <AvatarInitials name={inc.assignee} size={28} />
                  {inc.assignee === "Unassigned" && (
                    <button type="button" onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 10, fontWeight: 700, color: "rgb(var(--hi5-accent))", background: "rgb(var(--hi5-accent)/0.10)", border: "1px solid rgb(var(--hi5-accent)/0.25)", borderRadius: 7, padding: "3px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, minHeight: "unset" }}>
                      <UserCheck size={10} /> Assign me
                    </button>
                  )}
                  <ChevronRight size={15} style={{ opacity: isHov ? 0.9 : 0.28, transition: "opacity 140ms, transform 140ms, color 140ms", transform: isHov ? "translateX(2px)" : "none", color: isHov ? stripe.color : undefined }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <AlertCircle size={36} style={{ margin: "0 auto 12px", display: "block", opacity: 0.2 }} />
          <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.6 }}>No incidents found</div>
          <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Try adjusting your search or filters</div>
        </div>
      )}

      <ExportPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} onConfirm={() => {
        if (exportType === "csv")  exportToCSV(filtered, exportTitle);
        if (exportType === "xlsx") exportToXLSX(filtered, exportTitle);
        if (exportType === "pdf")  exportToPDF(filtered, exportTitle);
        setPreviewOpen(false);
      }} exportTitle={exportTitle} setExportTitle={setExportTitle} exportType={exportType} recordCount={filtered.length} />
    </div>
  );
}
