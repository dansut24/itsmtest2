// src/components/ui/SLATimer.js — live SLA countdown timer
import React, { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";

function pad(n) { return String(Math.abs(n)).padStart(2, "0"); }

function formatRemaining(totalSeconds) {
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (h > 0) return `${h}h ${pad(m)}m`;
  if (m > 0) return `${m}m ${pad(s)}s`;
  return `${s}s`;
}

/**
 * SLATimer
 * remainingSeconds: positive = time left, negative = already breached
 * compact: true for table/card view, false for detail view
 */
export default function SLATimer({ remainingSeconds = 3600, compact = false }) {
  const [remaining, setRemaining] = useState(remainingSeconds);

  useEffect(() => {
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, []);

  const breached    = remaining < 0;
  const critical    = remaining >= 0 && remaining < 900;  // < 15 min
  const warning     = remaining >= 900 && remaining < 1800; // < 30 min
  const color       = breached ? "#ef4444" : critical ? "#ef4444" : warning ? "#f97316" : "#22c55e";
  const bgColor     = breached ? "rgb(239 68 68/0.10)" : critical ? "rgb(239 68 68/0.10)" : warning ? "rgb(249 115 22/0.10)" : "rgb(34 197 94/0.08)";
  const borderColor = breached ? "rgb(239 68 68/0.30)" : critical ? "rgb(239 68 68/0.25)" : warning ? "rgb(249 115 22/0.25)" : "rgb(34 197 94/0.20)";
  const Icon        = breached || critical ? Zap : Clock;
  const label       = breached ? `Breached ${formatRemaining(remaining)} ago` : `${formatRemaining(remaining)} remaining`;

  if (compact) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 8px", borderRadius: 6,
        background: bgColor, border: "1px solid " + borderColor,
        animation: breached || critical ? "hi5-sla-blink 1.8s ease-in-out infinite" : "none",
      }}>
        <Icon size={11} style={{ color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          {label}
        </span>
        <style>{`@keyframes hi5-sla-blink { 0%,100%{opacity:1} 50%{opacity:.55} }`}</style>
      </div>
    );
  }

  // Full / detail view
  const pct = breached ? 100 : Math.max(0, Math.min(100, (1 - remaining / Math.max(remainingSeconds, 1)) * 100));

  return (
    <div style={{
      padding: "14px 16px", borderRadius: 14,
      background: bgColor, border: "1px solid " + borderColor,
      animation: breached || critical ? "hi5-sla-blink 1.8s ease-in-out infinite" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={15} style={{ color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "-0.01em" }}>
          SLA {breached ? "BREACHED" : critical ? "CRITICAL" : warning ? "AT RISK" : "ON TRACK"}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", color, fontVariantNumeric: "tabular-nums", marginBottom: 8, lineHeight: 1 }}>
        {breached ? "-" : ""}{formatRemaining(remaining)}
      </div>
      {/* Progress bar */}
      <div style={{ height: 5, borderRadius: 3, background: "rgb(0 0 0/0.08)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: pct + "%",
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          transition: "width 1s linear",
        }} />
      </div>
      <div style={{ fontSize: 11, opacity: 0.50, marginTop: 6 }}>
        {breached ? `SLA breached — escalate immediately` : `Time remaining until SLA breach`}
      </div>
      <style>{`@keyframes hi5-sla-blink { 0%,100%{opacity:1} 50%{opacity:.65} }`}</style>
    </div>
  );
}
