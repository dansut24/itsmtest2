// src/components/ui/NotificationPanel.js
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bell, X, AlertCircle, Clock, CheckCircle2, AlertTriangle,
  Flame, Zap, ChevronRight, Check, Trash2
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1", type: "critical", read: false,
    title: "SLA Breach Imminent",
    body: "INC-0042 — VPN access failure is 15 min from SLA breach",
    time: "2 min ago", href: "/incidents/42",
  },
  {
    id: "n2", type: "incident", read: false,
    title: "Critical Incident Raised",
    body: "INC-0051 — Core switch failure affecting 3 floors reported by Sarah K.",
    time: "8 min ago", href: "/incidents/51",
  },
  {
    id: "n3", type: "approval", read: false,
    title: "Change Approval Required",
    body: "CHG-0019 — Emergency patch deployment awaiting your sign-off",
    time: "22 min ago", href: "/changes",
  },
  {
    id: "n4", type: "resolved", read: false,
    title: "Incident Resolved",
    body: "INC-0038 — Email server connectivity restored by James T.",
    time: "1 hr ago", href: "/incidents/38",
  },
  {
    id: "n5", type: "warning", read: true,
    title: "High CPU on PROD-DB-02",
    body: "Asset PROD-DB-02 has been above 90% CPU for over 20 minutes",
    time: "2 hr ago", href: "/assets",
  },
  {
    id: "n6", type: "resolved", read: true,
    title: "Service Request Completed",
    body: "REQ-0088 — New laptop provisioned for Alex M. in Finance",
    time: "3 hr ago", href: "/service-requests",
  },
];

const TYPE_CONFIG = {
  critical: {
    icon: <Flame size={14} />,
    color: "#ef4444",
    bg: "rgb(239 68 68 / 0.12)",
    border: "rgb(239 68 68 / 0.25)",
    label: "Critical",
  },
  incident: {
    icon: <AlertCircle size={14} />,
    color: "#f97316",
    bg: "rgb(249 115 22 / 0.12)",
    border: "rgb(249 115 22 / 0.25)",
    label: "Incident",
  },
  approval: {
    icon: <Zap size={14} />,
    color: "rgb(var(--hi5-accent))",
    bg: "rgb(var(--hi5-accent) / 0.12)",
    border: "rgb(var(--hi5-accent) / 0.25)",
    label: "Approval",
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    color: "#eab308",
    bg: "rgb(234 179 8 / 0.12)",
    border: "rgb(234 179 8 / 0.25)",
    label: "Warning",
  },
  resolved: {
    icon: <CheckCircle2 size={14} />,
    color: "#10b981",
    bg: "rgb(16 185 129 / 0.12)",
    border: "rgb(16 185 129 / 0.25)",
    label: "Resolved",
  },
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [pos, setPos] = useState(null);
  const [animating, setAnimating] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  function computePos() {
    if (!btnRef.current) return null;
    const rect = btnRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 10,
      right: Math.max(12, window.innerWidth - rect.right),
    };
  }

  function openPanel() {
    const p = computePos();
    if (p) setPos(p);
    setOpen(true);
    setTimeout(() => setAnimating(true), 10);
  }

  function closePanel() {
    setAnimating(false);
    setTimeout(() => setOpen(false), 220);
  }

  function toggle() {
    if (open) closePanel();
    else openPanel();
  }

  useEffect(() => {
    if (!open) return;
    function onPointer(e) {
      if (btnRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      closePanel();
    }
    function onKey(e) { if (e.key === "Escape") closePanel(); }
    document.addEventListener("pointerdown", onPointer, { capture: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer, { capture: true });
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id) {
    setNotifications((ns) => ns.filter((n) => n.id !== id));
  }

  function markRead(id) {
    setNotifications((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  const panel = open && pos ? createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        zIndex: 99998,
        top: pos.top,
        right: pos.right,
        width: 400,
        maxHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        overflow: "hidden",
        background: "rgb(255 255 255 / 0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgb(var(--hi5-border) / 0.14)",
        boxShadow: "0 32px 80px rgb(0 0 0 / 0.22), 0 0 0 1px rgb(255 255 255 / 0.06) inset",
        transition: "opacity 220ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: animating ? 1 : 0,
        transform: animating ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
        transformOrigin: "top right",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "16px 18px 12px",
        borderBottom: "1px solid rgb(var(--hi5-border) / 0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgb(var(--hi5-accent) / 0.12)",
            border: "1px solid rgb(var(--hi5-accent) / 0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgb(var(--hi5-accent))",
          }}>
            <Bell size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>Notifications</div>
            {unread > 0 && (
              <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>
                {unread} unread alert{unread !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              style={{
                fontSize: 11, fontWeight: 600,
                color: "rgb(var(--hi5-accent))",
                background: "rgb(var(--hi5-accent) / 0.10)",
                border: "1px solid rgb(var(--hi5-accent) / 0.20)",
                borderRadius: 8, padding: "4px 10px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                minHeight: "unset",
              }}
            >
              <Check size={11} /> Mark all read
            </button>
          )}
          <button
            onClick={closePanel}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgb(var(--hi5-border) / 0.08)",
              border: "1px solid rgb(var(--hi5-border) / 0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgb(var(--hi5-fg))", opacity: 0.7,
              minHeight: "unset", minWidth: "unset",
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY: "auto", flex: 1 }} className="hi5-no-scrollbar">
        {notifications.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", opacity: 0.5 }}>
            <CheckCircle2 size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>All caught up</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>No notifications to show</div>
          </div>
        ) : (
          notifications.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.incident;
            return (
              <div
                key={n.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < notifications.length - 1 ? "1px solid rgb(var(--hi5-border) / 0.07)" : "none",
                  background: n.read ? "transparent" : "rgb(var(--hi5-accent) / 0.03)",
                  transition: "background 150ms",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => markRead(n.id)}
                onMouseEnter={e => e.currentTarget.style.background = "rgb(var(--hi5-border) / 0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgb(var(--hi5-accent) / 0.03)"}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div style={{
                    position: "absolute", left: 6, top: "50%",
                    transform: "translateY(-50%)",
                    width: 5, height: 5, borderRadius: "50%",
                    background: "rgb(var(--hi5-accent))",
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: cfg.color,
                  marginLeft: 8,
                }}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                      borderRadius: 6, padding: "1px 6px",
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 11, opacity: 0.45, display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={9} /> {n.time}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, lineHeight: 1.3, marginBottom: 3 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.62, lineHeight: 1.4 }} className="hi5-line-clamp-2">
                    {n.body}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    title="Dismiss"
                    style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: "transparent",
                      border: "1px solid rgb(var(--hi5-border) / 0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", opacity: 0.4, color: "rgb(var(--hi5-fg))",
                      minHeight: "unset", minWidth: "unset",
                      transition: "opacity 120ms, background 120ms",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgb(239 68 68 / 0.10)"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.4"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgb(var(--hi5-fg))"; }}
                  >
                    <Trash2 size={11} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); /* navigate */ }}
                    title="View"
                    style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: "transparent",
                      border: "1px solid rgb(var(--hi5-border) / 0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", opacity: 0.4, color: "rgb(var(--hi5-fg))",
                      minHeight: "unset", minWidth: "unset",
                      transition: "opacity 120ms",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.4"; }}
                  >
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{
          padding: "10px 16px",
          borderTop: "1px solid rgb(var(--hi5-border) / 0.10)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setNotifications([])}
            style={{
              fontSize: 11, fontWeight: 600, opacity: 0.5,
              background: "none", border: "none", cursor: "pointer",
              color: "rgb(var(--hi5-fg))", display: "flex", alignItems: "center", gap: 4,
              minHeight: "unset",
            }}
          >
            <Trash2 size={11} /> Clear all
          </button>
          <span style={{ fontSize: 11, opacity: 0.4 }}>
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        className="hi5-btn-ghost no-min-touch"
        style={{
          height: 42, width: 42, padding: 0,
          borderRadius: 13,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          background: open ? "rgb(var(--hi5-accent) / 0.10)" : undefined,
          borderColor: open ? "rgb(var(--hi5-accent) / 0.25)" : undefined,
          color: open ? "rgb(var(--hi5-accent))" : undefined,
        }}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 5, right: 5,
            width: 16, height: 16, borderRadius: "50%",
            background: "linear-gradient(135deg, #ef4444, #f97316)",
            color: "#fff",
            fontSize: 9, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid rgb(var(--hi5-card))",
            boxShadow: "0 2px 6px rgb(239 68 68 / 0.5)",
            animation: "hi5-pulse 2s ease infinite",
            minHeight: "unset", minWidth: "unset",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {panel}
      <style>{`
        @keyframes hi5-pulse {
          0%, 100% { box-shadow: 0 2px 6px rgb(239 68 68 / 0.5); }
          50% { box-shadow: 0 2px 12px rgb(239 68 68 / 0.8); }
        }
      `}</style>
    </>
  );
}
