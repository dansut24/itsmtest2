// src/components/ui/AccountDropdown.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function initials(name, email) {
  const base = name || email?.split("@")[0] || "?";
  const parts = base.trim().split(/[\s._-]+/).filter(Boolean);
  const a = (parts[0]?.[0] || base[0] || "?").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return (a + b).slice(0, 2);
}

export default function AccountDropdown({ name, email, role, tenantLabel }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const userInitials = useMemo(() => initials(name, email), [name, email]);
  const displayName = name || email?.split("@")[0] || "Account";

  function computePos() {
    if (!btnRef.current) return null;
    const rect = btnRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    };
  }

  useEffect(() => {
    if (!open) return;
    const p = computePos();
    if (p) setPos(p);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (btnRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    function onScroll() { setOpen(false); }
    function onResize() { const p = computePos(); if (p) setPos(p); }

    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    sessionStorage.clear();
    navigate("/login");
  };

  const avatarStyle = {
    height: 28,
    width: 28,
    borderRadius: 8,
    background: "rgb(var(--hi5-accent) / 0.18)",
    border: "1px solid rgb(var(--hi5-accent) / 0.30)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "rgb(var(--hi5-accent))",
    flexShrink: 0,
  };

  const menu = open && pos ? (
    <div
      ref={menuRef}
      role="menu"
      style={{
        position: "fixed",
        zIndex: 99999,
        top: pos.top,
        right: pos.right,
        width: 256,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgb(0 0 0 / 0.22)",
        background: "rgb(255 255 255 / 0.96)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgb(var(--hi5-border) / 0.12)",
      }}
      className="dark:!bg-[rgb(12_14_18/0.92)]"
    >
      {/* User info header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgb(var(--hi5-border) / 0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ ...avatarStyle, height: 40, width: 40, borderRadius: 12, fontSize: 14 }}>
            {userInitials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
            {email && <div style={{ fontSize: 12, opacity: 0.6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>}
            {role && <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, textTransform: "capitalize" }}>{role}</div>}
          </div>
        </div>
        {tenantLabel && (
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Workspace: {tenantLabel}
          </div>
        )}
      </div>

      {/* Menu items */}
      <div style={{ padding: "4px 0" }}>
        {[
          { icon: <User size={15} />, label: "Profile & Preferences", to: "/profile" },
          { icon: <Settings size={15} />, label: "Settings", to: "/settings" },
        ].map(({ icon, label, to }) => (
          <button
            key={to}
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); navigate(to); }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 16px", width: "100%",
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, color: "rgb(var(--hi5-fg))",
              transition: "background 120ms",
              textAlign: "left",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgb(0 0 0 / 0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <span style={{ opacity: 0.6 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "4px 0", borderTop: "1px solid rgb(var(--hi5-border) / 0.10)" }}>
        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px", width: "100%",
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: "#ef4444",
            transition: "background 120ms",
            textAlign: "left",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgb(239 68 68 / 0.06)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        id="hi5-acct-btn"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        style={{
          display: "flex", alignItems: "center", gap: 8,
          borderRadius: 13, padding: "5px 10px 5px 6px",
          height: 42,
          border: "1px solid rgb(var(--hi5-border) / 0.15)",
          background: open ? "rgb(var(--hi5-card) / 0.90)" : "rgb(var(--hi5-card) / 0.60)",
          cursor: "pointer",
          transition: "background 140ms, border-color 140ms",
          color: "rgb(var(--hi5-fg))",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = "rgb(var(--hi5-card) / 0.90)"; e.currentTarget.style.borderColor = "rgb(var(--hi5-border) / 0.28)"; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = "rgb(var(--hi5-card) / 0.60)"; e.currentTarget.style.borderColor = "rgb(var(--hi5-border) / 0.15)"; }}}
      >
        <div style={{ ...avatarStyle, borderRadius: 9, flexShrink: 0 }}>{userInitials}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }} id="hi5-acct-name-block">
          <span style={{ fontSize: 12, fontWeight: 700, maxWidth: 96, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>
            {displayName}
          </span>
          {role && (
            <span style={{ fontSize: 10, opacity: 0.45, textTransform: "capitalize", lineHeight: 1.2 }}>
              {role}
            </span>
          )}
        </div>
        <ChevronDown
          size={13}
          style={{
            opacity: 0.45,
            transition: "transform 200ms",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
            marginLeft: 2,
          }}
        />
      </button>
      {menu ? createPortal(menu, document.body) : null}
    </>
  );
}
