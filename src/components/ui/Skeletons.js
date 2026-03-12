// src/components/ui/Skeletons.js — skeleton loaders for all page types
import React, { useEffect, useState } from "react";

// Base shimmer skeleton block
export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: "rgb(var(--hi5-border)/0.12)",
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgb(var(--hi5-fg)/0.05) 50%, transparent 100%)",
        animation: "hi5-shimmer 1.6s ease-in-out infinite",
      }} />
    </div>
  );
}

// Stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="hi5-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={38} height={38} borderRadius={11} />
        <Skeleton width={52} height={20} borderRadius={6} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width={60} height={28} borderRadius={6} />
        <Skeleton width={100} height={14} borderRadius={4} />
        <Skeleton width={70} height={11} borderRadius={4} />
      </div>
    </div>
  );
}

// Table row skeleton
function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} style={{ padding: "12px 12px", borderBottom: "1px solid rgb(var(--hi5-border)/0.07)" }}>
          <Skeleton width={i === 0 ? 70 : i === 1 ? "80%" : i === 2 ? 80 : 60} height={13} />
        </td>
      ))}
    </tr>
  );
}

// Full page list skeleton (stats + filters + table)
export function PageSkeleton({ cols = 6, rows = 8, stats = 5 }) {
  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Skeleton width={180} height={24} borderRadius={6} />
          <Skeleton width={260} height={14} borderRadius={4} />
        </div>
        <Skeleton width={110} height={36} borderRadius={10} />
      </div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats}, minmax(0,1fr))`, gap: 12, marginBottom: 20 }}>
        {Array.from({ length: stats }, (_, i) => <StatCardSkeleton key={i} />)}
      </div>
      {/* Filter bar */}
      <div className="hi5-card" style={{ padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Skeleton width={240} height={36} borderRadius={10} />
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} width={80 + i * 10} height={32} borderRadius={9999} />)}
        </div>
      </div>
      {/* Table */}
      <div className="hi5-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgb(var(--hi5-border)/0.10)" }}>
                  <Skeleton width={50 + i * 8} height={10} borderRadius={4} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, i) => <TableRowSkeleton key={i} cols={cols} />)}
          </tbody>
        </table>
      </div>
      <style>{`
        @keyframes hi5-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Skeleton width={200} height={26} borderRadius={6} style={{ marginBottom: 8 }} />
        <Skeleton width={300} height={14} borderRadius={4} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
        {Array.from({ length: 5 }, (_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="hi5-card" style={{ padding: 20, height: 240, display: "flex", flexDirection: "column", gap: 12 }}>
            <Skeleton width={140} height={16} borderRadius={5} />
            <Skeleton width="100%" height={180} borderRadius={10} />
          </div>
        ))}
      </div>
      <style>{`@keyframes hi5-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

// Detail page skeleton (incident, asset etc.)
export function DetailSkeleton() {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Skeleton width={36} height={36} borderRadius={11} />
        <div style={{ flex: 1 }}>
          <Skeleton width={120} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="70%" height={22} borderRadius={6} style={{ marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Skeleton width={80} height={24} borderRadius={6} />
            <Skeleton width={90} height={24} borderRadius={6} />
            <Skeleton width={70} height={24} borderRadius={6} />
          </div>
        </div>
        <Skeleton width={110} height={36} borderRadius={10} />
      </div>
      {/* Status stepper */}
      <div className="hi5-card" style={{ padding: 20, marginBottom: 16, display: "flex", gap: 8 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Skeleton width={28} height={28} borderRadius="50%" />
            <Skeleton width={60} height={10} borderRadius={4} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <Skeleton width={32} height={32} borderRadius="50%" style={{ flexShrink: 0 }} />
              <div className="hi5-card" style={{ flex: 1, padding: 14 }}>
                <Skeleton width={100} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
                <Skeleton width="90%" height={13} borderRadius={4} style={{ marginBottom: 4 }} />
                <Skeleton width="70%" height={13} borderRadius={4} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="hi5-card" style={{ padding: 16 }}>
              <Skeleton width={80} height={11} borderRadius={4} style={{ marginBottom: 12 }} />
              {Array.from({ length: 4 }, (_, j) => (
                <div key={j} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <Skeleton width={28} height={28} borderRadius={8} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton width={60} height={9} borderRadius={3} style={{ marginBottom: 4 }} />
                    <Skeleton width="80%" height={12} borderRadius={4} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes hi5-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

// Hook for simulated loading
export function usePageLoad(ms = 600) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
