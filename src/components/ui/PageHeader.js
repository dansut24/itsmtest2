// src/components/ui/PageHeader.js — shared page header + filter bar used across all ITSM pages
import React from "react";
import { Search } from "lucide-react";

export function PageHeader({ title, subtitle, actions, stat }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      gap: 16, marginBottom: 20, flexWrap: "wrap",
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, opacity: 0.45, margin: "4px 0 0", fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {stat && (
          <div style={{
            fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 10,
            background: "rgb(var(--hi5-accent)/0.10)",
            border: "1px solid rgb(var(--hi5-accent)/0.20)",
            color: "rgb(var(--hi5-accent))",
          }}>
            {stat}
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search…", style }) {
  return (
    <div style={{ position: "relative", ...style }}>
      <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.35, pointerEvents: "none" }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", height: 36, paddingLeft: 32, paddingRight: 12,
          fontSize: 13, borderRadius: 10,
          background: "rgb(var(--hi5-card)/0.80)",
          border: "1px solid rgb(var(--hi5-border)/0.18)",
          color: "rgb(var(--hi5-fg))",
          outline: "none",
          backdropFilter: "blur(8px)",
          transition: "border-color 150ms",
        }}
        onFocus={e => e.target.style.borderColor = "rgb(var(--hi5-accent)/0.45)"}
        onBlur={e => e.target.style.borderColor = "rgb(var(--hi5-border)/0.18)"}
      />
    </div>
  );
}

export function FilterPills({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? options[0] : opt)}
            style={{
              fontSize: 12, fontWeight: active ? 700 : 500,
              padding: "5px 12px", borderRadius: 9999,
              border: active ? "1px solid rgb(var(--hi5-accent)/0.40)" : "1px solid rgb(var(--hi5-border)/0.15)",
              background: active ? "rgb(var(--hi5-accent)/0.10)" : "transparent",
              color: active ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-fg)/0.60)",
              cursor: "pointer", transition: "all 130ms", whiteSpace: "nowrap",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function StatusBadge({ status, config }) {
  const cfg = config?.[status] || { bg: "rgb(var(--hi5-border)/0.10)", color: "rgb(var(--hi5-fg)/0.60)", label: status };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 8px",
      borderRadius: 6, whiteSpace: "nowrap",
      background: cfg.bg, color: cfg.color,
      border: cfg.border || "none",
    }}>
      {cfg.label || status}
    </span>
  );
}

export function PriorityDot({ priority }) {
  const colors = { Critical: "#ef4444", High: "#f97316", Medium: "#eab308", Low: "#22c55e" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: colors[priority] || "#94a3b8", flexShrink: 0,
      boxShadow: `0 0 0 2px ${(colors[priority] || "#94a3b8")}33`,
    }} />
  );
}

export function Avatar({ name, size = 28 }) {
  const parts = (name || "").split(" ");
  const init = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f97316","#06b6d4","#10b981","#f59e0b","#3b82f6"];
  const bg = name && name !== "Unassigned" ? colors[(name || "").charCodeAt(0) % colors.length] : "#94a3b8";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      letterSpacing: "-0.02em",
    }}>
      {init}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "60px 24px", textAlign: "center", gap: 12,
    }}>
      <div style={{ fontSize: 40, opacity: 0.15 }}>{icon}</div>
      <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</p>
      {body && <p style={{ fontSize: 13, opacity: 0.45, margin: 0, maxWidth: 280 }}>{body}</p>}
      {action}
    </div>
  );
}

export function SortableHeader({ label, field, sort, onSort, style }) {
  const active = sort?.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: "10px 12px", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.05em", textTransform: "uppercase",
        opacity: active ? 1 : 0.45, cursor: "pointer",
        userSelect: "none", whiteSpace: "nowrap",
        borderBottom: "1px solid rgb(var(--hi5-border)/0.10)",
        ...style,
      }}
    >
      {label} {active ? (sort.dir === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}

export function TableRow({ children, onClick, style }) {
  const [hov, setHov] = React.useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor: onClick ? "pointer" : "default",
        background: hov ? "rgb(var(--hi5-accent)/0.04)" : "transparent",
        transition: "background 100ms",
        ...style,
      }}
    >
      {children}
    </tr>
  );
}

export const TD = ({ children, style }) => (
  <td style={{
    padding: "10px 12px", fontSize: 13,
    borderBottom: "1px solid rgb(var(--hi5-border)/0.07)",
    verticalAlign: "middle",
    ...style,
  }}>
    {children}
  </td>
);

export function Card({ children, style }) {
  return (
    <div className="hi5-card" style={{ borderRadius: 16, padding: 20, ...style }}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, icon, color = "#00c1ff", trend }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: color + "18", border: "1px solid " + color + "30",
          display: "flex", alignItems: "center", justifyContent: "center",
          color, flexShrink: 0,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
            background: trend.up ? "rgb(34 197 94/0.12)" : "rgb(239 68 68/0.12)",
            color: trend.up ? "#22c55e" : "#ef4444",
          }}>
            {trend.up ? "↗" : "↘"} {trend.label}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, opacity: 0.45, marginTop: 2 }}>{sub}</div>}
      </div>
    </Card>
  );
}
