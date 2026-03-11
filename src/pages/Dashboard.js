// src/pages/Dashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area,
  ResponsiveContainer,
} from "recharts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  AlertCircle, RotateCcw, CheckCircle2, Clock,
  Flame, TrendingUp, TrendingDown, GripVertical,
  X, LayoutDashboard, Plus, RotateCcw as Reset,
  ChevronRight, ArrowUpRight, Zap,
} from "lucide-react";

// ── Palette aligned to hi5 CSS vars ─────────────────────────────────────────
const ACCENT   = "#00c1ff";
const ACCENT2  = "#ff4fe1";
const ACCENT3  = "#ffc42d";
const C_BLUE   = "#3b82f6";
const C_PURPLE = "#8b5cf6";
const C_GREEN  = "#10b981";
const C_ORANGE = "#f97316";
const C_RED    = "#ef4444";
const C_SLATE  = "#64748b";

const PIE_COLORS  = [C_BLUE, C_PURPLE, C_GREEN, C_ORANGE];
const BAR_COLORS  = [ACCENT, ACCENT2, ACCENT3, C_GREEN];

// ── Sample data ──────────────────────────────────────────────────────────────
const pieData = [
  { name: "Open",        value: 14 },
  { name: "In Progress", value: 9  },
  { name: "Resolved",    value: 23 },
  { name: "Closed",      value: 8  },
];

const barData = [
  { month: "Jan", Incidents: 18, Requests: 32 },
  { month: "Feb", Incidents: 24, Requests: 28 },
  { month: "Mar", Incidents: 15, Requests: 41 },
  { month: "Apr", Incidents: 31, Requests: 36 },
  { month: "May", Incidents: 22, Requests: 45 },
  { month: "Jun", Incidents: 19, Requests: 38 },
];

const lineData = [
  { week: "W1", Changes: 4,  Problems: 2 },
  { week: "W2", Changes: 7,  Problems: 3 },
  { week: "W3", Changes: 5,  Problems: 1 },
  { week: "W4", Changes: 11, Problems: 4 },
  { week: "W5", Changes: 8,  Problems: 2 },
  { week: "W6", Changes: 14, Problems: 5 },
];

const areaData = [
  { day: "Mon", SLA: 94 },
  { day: "Tue", SLA: 97 },
  { day: "Wed", SLA: 89 },
  { day: "Thu", SLA: 92 },
  { day: "Fri", SLA: 96 },
  { day: "Sat", SLA: 99 },
  { day: "Sun", SLA: 98 },
];

const LATEST_INCIDENTS = [
  { id: 51, ref: "INC-0051", title: "Core switch failure — floors 2-4",  priority: "Critical", status: "Open",        ago: "8m"  },
  { id: 42, ref: "INC-0042", title: "VPN access failure for remote users", priority: "Critical", status: "In Progress", ago: "1h"  },
  { id: 38, ref: "INC-0038", title: "Email server intermittent issues",    priority: "High",     status: "In Progress", ago: "2h"  },
  { id: 35, ref: "INC-0035", title: "MFA not working for new starters",    priority: "High",     status: "Open",        ago: "3h"  },
  { id: 29, ref: "INC-0029", title: "Printer offline in Finance dept",     priority: "Medium",   status: "Resolved",    ago: "5h"  },
];

const PRIORITY_DOT = {
  Critical: C_RED,
  High:     C_ORANGE,
  Medium:   ACCENT3,
  Low:      C_SLATE,
};

const STATUS_COLOR = {
  "Open":        C_BLUE,
  "In Progress": C_PURPLE,
  "Resolved":    C_GREEN,
  "Closed":      C_SLATE,
};

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, Icon, trend, trendUp }) {
  return (
    <div className="hi5-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: color + "18", border: "1px solid " + color + "30",
          display: "flex", alignItems: "center", justifyContent: "center", color,
        }}>
          <Icon size={18} />
        </div>
        {trend != null && (
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            fontSize: 11, fontWeight: 700,
            color: trendUp ? C_GREEN : C_RED,
            background: (trendUp ? C_GREEN : C_RED) + "12",
            border: "1px solid " + (trendUp ? C_GREEN : C_RED) + "25",
            borderRadius: 8, padding: "3px 7px",
          }}>
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
function HiTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgb(255 255 255 / 0.96)", backdropFilter: "blur(12px)",
      border: "1px solid rgb(12 14 18 / 0.12)", borderRadius: 12,
      padding: "10px 14px", boxShadow: "0 12px 32px rgb(0 0 0 / 0.15)",
      fontSize: 12,
    }}>
      {label && <div style={{ fontWeight: 700, marginBottom: 6, opacity: 0.7 }}>{label}</div>}
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ opacity: 0.7 }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Widget definitions ───────────────────────────────────────────────────────
const WIDGET_REGISTRY = {
  pie:      { label: "Incidents by Status",   defaultTitle: "Incidents by Status"   },
  bar:      { label: "Monthly Volume",        defaultTitle: "Monthly Volume"        },
  line:     { label: "Changes & Problems",    defaultTitle: "Changes & Problems"    },
  sla:      { label: "SLA Compliance",        defaultTitle: "SLA Compliance"        },
  table:    { label: "Latest Incidents",      defaultTitle: "Latest Incidents"      },
  activity: { label: "Activity Summary",      defaultTitle: "Activity Summary"      },
};

const INITIAL_WIDGETS = [
  { id: "w-pie",      type: "pie"   },
  { id: "w-bar",      type: "bar"   },
  { id: "w-line",     type: "line"  },
  { id: "w-sla",      type: "sla"   },
  { id: "w-table",    type: "table" },
  { id: "w-activity", type: "activity" },
];

// ── Widget renders ───────────────────────────────────────────────────────────
function WidgetPie() {
  const total = pieData.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", height: "100%" }}>
      <ResponsiveContainer width={160} height={160} style={{ flexShrink: 0 }}>
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" paddingAngle={3} strokeWidth={0}>
            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <ReTooltip content={<HiTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {pieData.map((d, i) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
            <span style={{ fontSize: 12, flex: 1, opacity: 0.7 }}>{d.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{d.value}</span>
            <span style={{ fontSize: 11, opacity: 0.4, minWidth: 32, textAlign: "right" }}>{Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
        <div style={{ marginTop: 4, paddingTop: 8, borderTop: "1px solid rgb(12 14 18 / 0.08)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, opacity: 0.5 }}>Total</span>
          <span style={{ fontSize: 12, fontWeight: 800 }}>{total}</span>
        </div>
      </div>
    </div>
  );
}

function WidgetBar() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={barData} barSize={10} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(12 14 18 / 0.06)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgb(90 98 110)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "rgb(90 98 110)" }} axisLine={false} tickLine={false} width={28} />
        <ReTooltip content={<HiTooltip />} cursor={{ fill: "rgb(0 193 255 / 0.06)" }} />
        <Bar dataKey="Incidents" fill={ACCENT}   radius={[4, 4, 0, 0]} />
        <Bar dataKey="Requests"  fill={ACCENT2}  radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function WidgetLine() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(12 14 18 / 0.06)" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "rgb(90 98 110)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "rgb(90 98 110)" }} axisLine={false} tickLine={false} width={24} />
        <ReTooltip content={<HiTooltip />} />
        <Line type="monotone" dataKey="Changes"  stroke={ACCENT}  strokeWidth={2.5} dot={{ r: 3, fill: ACCENT,  strokeWidth: 0 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="Problems" stroke={ACCENT2} strokeWidth={2.5} dot={{ r: 3, fill: ACCENT2, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function WidgetSla() {
  const slaValue = 94;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (slaValue / 100) * circumference;
  const color = slaValue >= 95 ? C_GREEN : slaValue >= 85 ? ACCENT3 : C_RED;
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center", height: "100%" }}>
      {/* Radial gauge */}
      <div style={{ position: "relative", flexShrink: 0, width: 140, height: 140 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="52" fill="none" stroke="rgb(12 14 18 / 0.08)" strokeWidth="10" />
          <circle cx="70" cy="70" r="52" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 800ms ease, stroke 400ms ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color }}>{slaValue}%</div>
          <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>SLA</div>
        </div>
      </div>
      {/* Breakdown */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Met",      value: 47, color: C_GREEN  },
          { label: "At risk",  value: 4,  color: ACCENT3  },
          { label: "Breached", value: 3,  color: C_RED    },
        ].map(({ label, value, color: c }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, opacity: 0.65 }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{value}</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "rgb(12 14 18 / 0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: (value / 54 * 100) + "%", background: c, borderRadius: 3, transition: "width 600ms ease" }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 4 }}>
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="slaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C_GREEN} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C_GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="SLA" stroke={C_GREEN} strokeWidth={1.5} fill="url(#slaGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function WidgetTable({ navigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {LATEST_INCIDENTS.map((inc) => (
        <div key={inc.id}
          onClick={() => navigate("/incidents/" + inc.id)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 12, cursor: "pointer",
            border: "1px solid rgb(12 14 18 / 0.07)",
            background: "rgb(255 255 255 / 0.40)",
            transition: "background 130ms, border-color 130ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgb(0 193 255 / 0.06)"; e.currentTarget.style.borderColor = "rgb(0 193 255 / 0.20)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgb(255 255 255 / 0.40)"; e.currentTarget.style.borderColor = "rgb(12 14 18 / 0.07)"; }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PRIORITY_DOT[inc.priority], flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inc.title}</div>
            <div style={{ fontSize: 10, opacity: 0.45, fontFamily: "monospace", marginTop: 1 }}>{inc.ref}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: STATUS_COLOR[inc.status], background: STATUS_COLOR[inc.status] + "15", border: "1px solid " + STATUS_COLOR[inc.status] + "25", borderRadius: 6, padding: "2px 6px" }}>
              {inc.status}
            </span>
            <span style={{ fontSize: 10, opacity: 0.35 }}>{inc.ago}</span>
            <ChevronRight size={12} style={{ opacity: 0.25 }} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => navigate("/incidents")}
        style={{
          marginTop: 4, width: "100%", padding: "9px", borderRadius: 11,
          border: "1px dashed rgb(0 193 255 / 0.25)",
          background: "rgb(0 193 255 / 0.04)",
          color: "rgb(0 193 255)", fontSize: 12, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "background 130ms", minHeight: "unset",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgb(0 193 255 / 0.10)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgb(0 193 255 / 0.04)"}
      >
        View all incidents <ArrowUpRight size={12} />
      </button>
    </div>
  );
}

function WidgetActivity() {
  const items = [
    { icon: <CheckCircle2 size={14} />, color: C_GREEN,  text: "INC-0038 resolved by James T.",              time: "8m ago"  },
    { icon: <AlertCircle  size={14} />, color: C_RED,    text: "INC-0051 raised — Critical priority",        time: "12m ago" },
    { icon: <RotateCcw    size={14} />, color: C_PURPLE, text: "INC-0042 assigned to Priya R.",              time: "22m ago" },
    { icon: <Zap          size={14} />, color: ACCENT,   text: "CHG-0019 approved by Mohammed A.",           time: "1h ago"  },
    { icon: <Clock        size={14} />, color: C_ORANGE, text: "INC-0039 SLA warning — 30min remaining",     time: "1h ago"  },
    { icon: <CheckCircle2 size={14} />, color: C_GREEN,  text: "REQ-0088 completed — laptop provisioned",    time: "2h ago"  },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: i < items.length - 1 ? "1px solid rgb(12 14 18 / 0.06)" : "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: item.color + "15", border: "1px solid " + item.color + "25", display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>
            {item.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{item.text}</div>
            <div style={{ fontSize: 10, opacity: 0.4, marginTop: 2 }}>{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Add widget drawer ────────────────────────────────────────────────────────
function AddWidgetDrawer({ existingTypes, onAdd, onClose }) {
  const available = Object.entries(WIDGET_REGISTRY).filter(([type]) => !existingTypes.includes(type));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgb(0 0 0 / 0.40)", backdropFilter: "blur(6px)" }} />
      <div className="hi5-panel" style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width: 320, borderRadius: "20px 0 0 20px", padding: "24px 20px",
        display: "flex", flexDirection: "column", gap: 16,
        animation: "slideInRight 200ms ease",
      }}>
        <style>{`@keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Add Widget</div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5, minHeight: "unset" }}><X size={16} /></button>
        </div>
        {available.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.4, padding: "32px 0", fontSize: 13 }}>All widgets are already on your dashboard</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {available.map(([type, cfg]) => (
              <button key={type} type="button" onClick={() => { onAdd(type); onClose(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 14, border: "1px solid rgb(12 14 18 / 0.12)",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                  transition: "background 130ms, border-color 130ms", minHeight: "unset",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgb(0 193 255 / 0.08)"; e.currentTarget.style.borderColor = "rgb(0 193 255 / 0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgb(12 14 18 / 0.12)"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgb(0 193 255 / 0.10)", border: "1px solid rgb(0 193 255 / 0.20)", display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, flexShrink: 0 }}>
                  <LayoutDashboard size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{cfg.defaultTitle}</div>
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, textTransform: "capitalize" }}>{type} chart</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Widget card wrapper ──────────────────────────────────────────────────────
function WidgetCard({ widget, editMode, onDelete, navigate }) {
  const title = WIDGET_REGISTRY[widget.type]?.defaultTitle || widget.type;

  const renderContent = () => {
    switch (widget.type) {
      case "pie":      return <WidgetPie />;
      case "bar":      return <WidgetBar />;
      case "line":     return <WidgetLine />;
      case "sla":      return <WidgetSla />;
      case "table":    return <WidgetTable navigate={navigate} />;
      case "activity": return <WidgetActivity />;
      default:         return null;
    }
  };

  return (
    <div className="hi5-card" style={{ padding: "18px 20px", height: "100%", display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden" }}>
      {/* Edit mode overlay */}
      {editMode && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "rgb(0 0 0 / 0.04)",
          border: "2px dashed rgb(0 193 255 / 0.35)",
          borderRadius: 20, pointerEvents: "none",
        }} />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.75 }}>{title}</div>
        {editMode && (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ cursor: "grab", opacity: 0.4, display: "flex", alignItems: "center", padding: 4 }}>
              <GripVertical size={14} />
            </div>
            <button type="button" onClick={() => onDelete(widget.id)}
              style={{
                width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgb(239 68 68 / 0.10)", border: "1px solid rgb(239 68 68 / 0.25)",
                color: C_RED, cursor: "pointer", minHeight: "unset", minWidth: "unset",
                transition: "background 130ms",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgb(239 68 68 / 0.20)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgb(239 68 68 / 0.10)"}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {renderContent()}
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [widgets,     setWidgets]     = useState(INITIAL_WIDGETS);
  const [editMode,    setEditMode]    = useState(false);
  const [addDrawer,   setAddDrawer]   = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const next = [...widgets];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setWidgets(next);
  };

  const deleteWidget = (id) => setWidgets((ws) => ws.filter((w) => w.id !== id));

  const addWidget = (type) => {
    setWidgets((ws) => [...ws, { id: "w-" + type + "-" + Date.now(), type }]);
  };

  const resetLayout = () => setWidgets(INITIAL_WIDGETS);

  const existingTypes = widgets.map((w) => w.type);

  return (
    <div>
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Dashboard</h1>
          <div style={{ fontSize: 12, opacity: 0.45, marginTop: 3 }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {editMode ? (
            <>
              <button type="button" onClick={() => setAddDrawer(true)} className="hi5-btn-ghost no-min-touch"
                style={{ height: 36, padding: "0 14px", borderRadius: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={13} /> Add Widget
              </button>
              <button type="button" onClick={resetLayout} className="hi5-btn-ghost no-min-touch"
                style={{ height: 36, padding: "0 14px", borderRadius: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 6, color: C_ORANGE }}>
                <Reset size={13} /> Reset
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="hi5-btn-primary no-min-touch"
                style={{ height: 36, padding: "0 16px", borderRadius: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={13} /> Done
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setEditMode(true)} className="hi5-btn-ghost no-min-touch"
              style={{ height: 36, padding: "0 14px", borderRadius: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <LayoutDashboard size={13} /> Edit Dashboard
            </button>
          )}
        </div>
      </div>

      {/* ── KPI stat row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Open Incidents"   value={14} color={C_BLUE}   Icon={AlertCircle}  trend="+3"  trendUp={false} sub="vs last week" />
        <StatCard label="In Progress"      value={9}  color={C_PURPLE} Icon={RotateCcw}    trend="-2"  trendUp={true}  sub="being worked" />
        <StatCard label="Resolved Today"   value={7}  color={C_GREEN}  Icon={CheckCircle2} trend="+4"  trendUp={true}  sub="closed out" />
        <StatCard label="SLA Breached"     value={3}  color={C_RED}    Icon={Flame}        trend="+1"  trendUp={false} sub="needs attention" />
        <StatCard label="Avg Resolution"   value="4h" color={ACCENT}   Icon={Clock}        trend="-30m" trendUp={true} sub="this week" />
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div style={{
          padding: "10px 16px", borderRadius: 14, marginBottom: 16,
          background: "rgb(0 193 255 / 0.08)", border: "1px solid rgb(0 193 255 / 0.25)",
          display: "flex", alignItems: "center", gap: 10, fontSize: 13,
          color: "rgb(0 193 255)",
        }}>
          <GripVertical size={15} />
          Drag widgets to rearrange. Click <X size={13} style={{ display: "inline", margin: "0 2px" }} /> to remove. Press <strong style={{ marginLeft: 4 }}>Done</strong> when finished.
        </div>
      )}

      {/* ── Widget grid ── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!editMode}>
                  {(prov, snapshot) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                      style={{
                        ...prov.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.85 : 1,
                        transform: snapshot.isDragging ? (prov.draggableProps.style?.transform || "") + " scale(1.02)" : prov.draggableProps.style?.transform,
                      }}
                    >
                      <WidgetCard widget={widget} editMode={editMode} onDelete={deleteWidget} navigate={navigate} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty state */}
      {widgets.length === 0 && (
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <LayoutDashboard size={40} style={{ margin: "0 auto 14px", display: "block", opacity: 0.2 }} />
          <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.5 }}>No widgets on your dashboard</div>
          <button type="button" className="hi5-btn-primary" onClick={() => { setEditMode(true); setAddDrawer(true); }}
            style={{ marginTop: 16, padding: "10px 20px", borderRadius: 12, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Plus size={14} /> Add your first widget
          </button>
        </div>
      )}

      {/* Add widget drawer */}
      {addDrawer && (
        <AddWidgetDrawer existingTypes={existingTypes} onAdd={addWidget} onClose={() => setAddDrawer(false)} />
      )}
    </div>
  );
