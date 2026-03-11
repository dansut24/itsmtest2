// src/components/shell/TabBar.js
// Tab strip with pinning, context menu, scroll-into-view — ported from TS ItsmShell
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Pin, X, MoreHorizontal } from "lucide-react";
import { useItsmStore } from "../../store/itsmStore";

export default function TabBar({ newTabHref = "/dashboard" }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { tabs, closeTab, setTabs, closeOthers, togglePin, upsertTab } = useItsmStore();

  const stripRef = useRef(null);
  const tabEls = useRef(new Map());
  const prevSigRef = useRef("");
  const longPressRef = useRef(null);

  // Context menu state
  const [menu, setMenu] = useState({ open: false });

  function closeMenu() { setMenu({ open: false }); }
  function openMenu(tabId, x, y) { setMenu({ open: true, tabId, x, y }); }

  function onContextMenu(e, tabId) {
    e.preventDefault();
    e.stopPropagation();
    openMenu(tabId, e.clientX, e.clientY);
  }

  function startLongPress(tabId, x, y) {
    longPressRef.current = window.setTimeout(() => openMenu(tabId, x, y), 450);
  }
  function cancelLongPress() {
    if (longPressRef.current) { window.clearTimeout(longPressRef.current); longPressRef.current = null; }
  }

  // Scroll active tab into view
  useEffect(() => {
    const sig = (tabs ?? []).map((t) => t.id).join("|");
    const prevSig = prevSigRef.current;
    prevSigRef.current = sig;

    const activeTab = tabs?.find((t) => t.href === pathname);
    const el = activeTab ? tabEls.current.get(activeTab.id) : tabEls.current.get(tabs?.at(-1)?.id);
    if (!el) return;

    if (sig !== prevSig || pathname) {
      try { el.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" }); }
      catch { /* noop */ }
    }
  }, [tabs, pathname]);

  // Close menu on navigation
  useEffect(() => { closeMenu(); }, [pathname]);

  // Close menu on global click
  useEffect(() => {
    if (!menu.open) return;
    function onGlobal() { closeMenu(); }
    window.addEventListener("click", onGlobal, { capture: true });
    return () => window.removeEventListener("click", onGlobal, { capture: true });
  }, [menu.open]);

  return (
    <div style={{ borderTop: "1px solid rgb(var(--hi5-border) / 0.10)", padding: "0 8px", position: "relative" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8 }}>

        {/* Scrollable tab strip */}
        <div
          ref={stripRef}
          className="hi5-no-scrollbar"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
            overflowX: "auto",
            overflowY: "hidden",
            flexWrap: "nowrap",
            WebkitOverflowScrolling: "touch",
            position: "relative",
          }}
        >
          {(tabs ?? []).map((t) => {
            const isActive = pathname === t.href;
            const canClose = !t.pinned && t.id !== "dashboard";

            return (
              <div
                key={t.id}
                ref={(el) => { if (el) tabEls.current.set(t.id, el); else tabEls.current.delete(t.id); }}
                onContextMenu={(e) => onContextMenu(e, t.id)}
                onTouchStart={(e) => {
                  const touch = e.touches?.[0];
                  if (touch) startLongPress(t.id, touch.clientX, touch.clientY);
                }}
                onTouchEnd={cancelLongPress}
                onTouchCancel={cancelLongPress}
                onTouchMove={cancelLongPress}
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  height: 32,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: `1px solid ${isActive ? "rgb(var(--hi5-accent) / 0.30)" : "rgb(var(--hi5-border) / 0.12)"}`,
                  background: isActive ? "rgb(var(--hi5-accent) / 0.12)" : "transparent",
                  minWidth: 90,
                  maxWidth: "52vw",
                  cursor: "pointer",
                  opacity: isActive ? 1 : 0.8,
                  transition: "background 140ms, border-color 140ms, opacity 140ms",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, width: "100%", height: "100%" }}>
                  {t.pinned && <Pin size={10} style={{ opacity: 0.5, flexShrink: 0 }} />}
                  <Link
                    to={t.href}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textDecoration: "none",
                      color: "rgb(var(--hi5-fg))",
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {t.title}
                  </Link>
                  {canClose && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeTab(t.id); }}
                      aria-label="Close tab"
                      style={{
                        flexShrink: 0,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0.5,
                        padding: "0 0 0 4px",
                        display: "flex",
                        alignItems: "center",
                        color: "rgb(var(--hi5-fg))",
                        minHeight: "unset",
                        minWidth: "unset",
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* New tab button */}
        <Link
          to={newTabHref}
          aria-label="New tab"
          title="New tab"
          style={{
            height: 32, width: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 10,
            border: "1px solid rgb(var(--hi5-border) / 0.12)",
            flexShrink: 0,
            opacity: 0.7,
            color: "rgb(var(--hi5-fg))",
            textDecoration: "none",
            transition: "opacity 140ms, background 140ms",
            minHeight: "unset", minWidth: "unset",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgb(var(--hi5-border) / 0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.background = "transparent"; }}
        >
          <Plus size={12} />
        </Link>
      </div>

      {/* Context menu */}
      {menu.open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 60 }}
          onClick={closeMenu}
        >
          <div
            className="hi5-panel"
            style={{
              position: "absolute",
              left: Math.min(menu.x, window.innerWidth - 220),
              top: Math.min(menu.y, window.innerHeight - 140),
              minWidth: 200,
              padding: 8,
              zIndex: 61,
              borderRadius: 14,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "4px 8px 8px", fontSize: 11, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Tab options</span>
              <MoreHorizontal size={14} style={{ opacity: 0.6 }} />
            </div>
            {[
              { label: "Close others", icon: <X size={14} />, action: () => { closeOthers(menu.tabId); closeMenu(); } },
              { label: "Pin / Unpin",  icon: <Pin size={14} />, action: () => { togglePin(menu.tabId); closeMenu(); } },
            ].map(({ label, icon, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px", borderRadius: 10,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: "rgb(var(--hi5-fg))",
                  textAlign: "left",
                  transition: "background 120ms",
                  minHeight: "unset",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgb(var(--hi5-border) / 0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <span style={{ opacity: 0.7 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
