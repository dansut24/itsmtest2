// src/components/ui/CommandPalette.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search, AlertCircle, LayoutDashboard, ClipboardList,
  GitBranch, AlertTriangle, Monitor, BookOpen, BarChart2,
  ThumbsUp, Settings, User, Plus, ArrowRight, Hash,
  Zap, Clock, Command,
} from "lucide-react";

const ALL_ITEMS = [
  // Navigation
  { id: "nav-dashboard",    group: "Navigation", label: "Dashboard",        icon: <LayoutDashboard size={15} />,  href: "/dashboard",        keywords: "home main" },
  { id: "nav-incidents",    group: "Navigation", label: "Incidents",         icon: <AlertCircle size={15} />,      href: "/incidents",        keywords: "tickets issues" },
  { id: "nav-requests",     group: "Navigation", label: "Service Requests",  icon: <ClipboardList size={15} />,   href: "/service-requests", keywords: "requests sr" },
  { id: "nav-changes",      group: "Navigation", label: "Changes",           icon: <GitBranch size={15} />,        href: "/changes",           keywords: "change mgmt" },
  { id: "nav-problems",     group: "Navigation", label: "Problems",          icon: <AlertTriangle size={15} />,    href: "/problems",          keywords: "root cause" },
  { id: "nav-assets",       group: "Navigation", label: "Assets",            icon: <Monitor size={15} />,          href: "/assets",            keywords: "hardware cmdb" },
  { id: "nav-kb",           group: "Navigation", label: "Knowledge Base",    icon: <BookOpen size={15} />,         href: "/knowledge-base",   keywords: "docs articles" },
  { id: "nav-reports",      group: "Navigation", label: "Reports",           icon: <BarChart2 size={15} />,        href: "/reports",           keywords: "analytics" },
  { id: "nav-approvals",    group: "Navigation", label: "Approvals",         icon: <ThumbsUp size={15} />,         href: "/approvals",         keywords: "pending sign off" },
  { id: "nav-settings",     group: "Navigation", label: "Settings",          icon: <Settings size={15} />,         href: "/settings",          keywords: "config admin" },
  { id: "nav-profile",      group: "Navigation", label: "Profile",           icon: <User size={15} />,             href: "/profile",           keywords: "account me" },
  // Quick actions
  { id: "act-new-inc",      group: "Quick Actions", label: "New Incident",         icon: <Plus size={15} />,       href: "/new-incident",     keywords: "create raise" },
  { id: "act-self-service", group: "Quick Actions", label: "Self-Service Portal",  icon: <Zap size={15} />,        href: "/self-service",     keywords: "portal end user" },
  // Recent (static demo)
  { id: "rec-1", group: "Recent", label: "INC-0051 — Core switch failure",   icon: <Hash size={15} />, href: "/incidents/51", keywords: "" },
  { id: "rec-2", group: "Recent", label: "INC-0042 — VPN access failure",    icon: <Hash size={15} />, href: "/incidents/42", keywords: "" },
  { id: "rec-3", group: "Recent", label: "CHG-0019 — Emergency patch deploy", icon: <Hash size={15} />, href: "/changes",      keywords: "" },
];

function score(item, query) {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  const kw = (item.keywords || "").toLowerCase();
  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (kw.includes(q)) return 40;
  return 0;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? ALL_ITEMS
        .map((item) => ({ item, s: score(item, query) }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s)
        .map(({ item }) => item)
    : ALL_ITEMS.filter((i) => i.group === "Recent" || i.group === "Quick Actions");

  // Group results
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const flat = Object.values(grouped).flat();

  function openPalette() {
    setOpen(true);
    setQuery("");
    setSelectedIdx(0);
    setTimeout(() => {
      setAnimating(true);
      inputRef.current?.focus();
    }, 10);
  }

  function closePalette() {
    setAnimating(false);
    setTimeout(() => { setOpen(false); setQuery(""); }, 200);
  }

  function select(item) {
    closePalette();
    setTimeout(() => navigate(item.href), 200);
  }

  // Keyboard shortcut
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Arrow nav + enter
  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[selectedIdx]) select(flat[selectedIdx]);
    } else if (e.key === "Escape") {
      closePalette();
    }
  }, [flat, selectedIdx]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector("[data-selected='true']");
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  // Reset index when results change
  useEffect(() => { setSelectedIdx(0); }, [query]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPalette}
        className="hi5-btn-ghost no-min-touch"
        aria-label="Command palette"
        title="Command palette (⌘K)"
        style={{
          height: 38, borderRadius: 12, padding: "0 12px",
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12, opacity: 0.7,
        }}
      >
        <Search size={14} />
        <span style={{ display: "none" }} className="sm-show">Search…</span>
        <span style={{
          display: "flex", alignItems: "center", gap: 2,
          fontSize: 10, fontWeight: 700,
          background: "rgb(var(--hi5-border) / 0.10)",
          border: "1px solid rgb(var(--hi5-border) / 0.15)",
          borderRadius: 6, padding: "2px 5px",
          opacity: 0.7,
        }} className="sm-show">
          <Command size={9} />K
        </span>
      </button>
    );
  }

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closePalette}
        style={{
          position: "absolute", inset: 0,
          background: "rgb(0 0 0 / 0.50)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "opacity 200ms",
          opacity: animating ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 580,
          margin: "0 16px",
          borderRadius: 20,
          overflow: "hidden",
          background: "rgb(255 255 255 / 0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgb(var(--hi5-border) / 0.16)",
          boxShadow: "0 40px 100px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(255 255 255 / 0.08) inset",
          transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0) scale(1)" : "translateY(-16px) scale(0.96)",
        }}
      >
        {/* Search input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 18px",
          borderBottom: "1px solid rgb(var(--hi5-border) / 0.10)",
        }}>
          <Search size={18} style={{ flexShrink: 0, color: "rgb(var(--hi5-accent))" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, incidents, actions…"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "rgb(var(--hi5-fg))",
              caretColor: "rgb(var(--hi5-accent))",
            }}
          />
          <kbd style={{
            fontSize: 11, fontWeight: 700,
            background: "rgb(var(--hi5-border) / 0.10)",
            border: "1px solid rgb(var(--hi5-border) / 0.15)",
            borderRadius: 6, padding: "3px 7px",
            opacity: 0.6, flexShrink: 0,
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{ maxHeight: 400, overflowY: "auto", padding: "8px 0" }}
          className="hi5-no-scrollbar"
        >
          {flat.length === 0 ? (
            <div style={{ padding: "32px 24px", textAlign: "center", opacity: 0.5 }}>
              <Search size={24} style={{ margin: "0 auto 10px", display: "block", opacity: 0.4 }} />
              <div style={{ fontSize: 14 }}>No results for "{query}"</div>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => {
              const groupIcon = group === "Recent" ? <Clock size={11} /> : group === "Quick Actions" ? <Zap size={11} /> : <ArrowRight size={11} />;
              return (
                <div key={group}>
                  <div style={{
                    padding: "6px 16px 4px",
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.45,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {groupIcon} {group}
                  </div>
                  {items.map((item) => {
                    const idx = flat.indexOf(item);
                    const isSelected = idx === selectedIdx;
                    return (
                      <div
                        key={item.id}
                        data-selected={isSelected}
                        onClick={() => select(item)}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "9px 16px",
                          margin: "1px 8px",
                          borderRadius: 12,
                          cursor: "pointer",
                          background: isSelected ? "rgb(var(--hi5-accent) / 0.10)" : "transparent",
                          border: `1px solid ${isSelected ? "rgb(var(--hi5-accent) / 0.25)" : "transparent"}`,
                          transition: "background 80ms, border-color 80ms",
                        }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                          background: isSelected ? "rgb(var(--hi5-accent) / 0.15)" : "rgb(var(--hi5-border) / 0.08)",
                          border: `1px solid ${isSelected ? "rgb(var(--hi5-accent) / 0.30)" : "rgb(var(--hi5-border) / 0.12)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: isSelected ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-fg))",
                          opacity: isSelected ? 1 : 0.65,
                          transition: "all 80ms",
                        }}>
                          {item.icon}
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: isSelected ? 600 : 500,
                          flex: 1,
                          color: isSelected ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-fg))",
                        }}>
                          {item.label}
                        </span>
                        {isSelected && (
                          <kbd style={{
                            fontSize: 10, fontWeight: 700,
                            background: "rgb(var(--hi5-accent) / 0.12)",
                            border: "1px solid rgb(var(--hi5-accent) / 0.25)",
                            color: "rgb(var(--hi5-accent))",
                            borderRadius: 6, padding: "2px 7px",
                            minHeight: "unset", minWidth: "unset",
                          }}>↵</kbd>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "8px 16px",
          borderTop: "1px solid rgb(var(--hi5-border) / 0.08)",
          display: "flex", gap: 16, alignItems: "center",
        }}>
          {[
            { keys: ["↑", "↓"], label: "Navigate" },
            { keys: ["↵"], label: "Select" },
            { keys: ["Esc"], label: "Close" },
          ].map(({ keys, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {keys.map((k) => (
                  <kbd key={k} style={{
                    fontSize: 10, fontWeight: 700,
                    background: "rgb(var(--hi5-border) / 0.08)",
                    border: "1px solid rgb(var(--hi5-border) / 0.15)",
                    borderRadius: 5, padding: "1px 5px",
                    minHeight: "unset", minWidth: "unset",
                  }}>{k}</kbd>
                ))}
              </div>
              <span style={{ fontSize: 11, opacity: 0.45 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
