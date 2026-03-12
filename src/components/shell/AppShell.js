// src/components/shell/AppShell.js
// Core shell — ported from hi5tech TypeScript platform to React JS + React Router
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

function normalizePath(p) {
  return (p || "").split("?")[0].split("#")[0];
}

function isActivePath(pathname, item) {
  const p = normalizePath(pathname);
  const href = normalizePath(item.href);
  if (item.exact) return p === href;
  return p === href || p.startsWith(href + "/");
}

function NavItem({ item, collapsed, onClick }) {
  const { pathname } = useLocation();
  const active = isActivePath(pathname, item);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={["hi5-nav-item", active ? "active" : "", collapsed ? "collapsed" : ""].join(" ")}
    >
      {item.icon && <span style={{ flexShrink: 0, display: "flex" }}>{item.icon}</span>}
      {!collapsed && (
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.label}
        </span>
      )}
      {!collapsed && item.badge && <span style={{ flexShrink: 0 }}>{item.badge}</span>}
    </Link>
  );
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  let current = "";
  const crumbs = segments.map((seg) => {
    current += `/${seg}`;
    const label = seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { label, href: current };
  });

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 12, overflow: "hidden" }}>
      <ol style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", gap: 4, fontSize: 12, opacity: 0.6, listStyle: "none", margin: 0, padding: 0, overflow: "hidden" }}>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={c.href}>
              {i > 0 && (
                <li aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                  <ChevronRight size={11} style={{ opacity: 0.5 }} />
                </li>
              )}
              <li style={{ display: "inline-flex", alignItems: "center", minWidth: 0, flexShrink: 1, overflow: "hidden" }}>
                {isLast ? (
                  <span style={{ fontWeight: 600, opacity: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                    {c.label}
                  </span>
                ) : (
                  <Link
                    to={c.href}
                    style={{ color: "inherit", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default function AppShell({
  title,
  homeHref = "/dashboard",
  navItems = [],
  sidebarDefaultCollapsed = false,
  sidebarMode = "visible",            // "visible" | "hidden"
  headerLeftSlot,
  headerRightSlot,
  topBarSlot,
  children,
  showBreadcrumbs = true,
  contentClassName = "",
}) {
  const showSidebar = sidebarMode !== "hidden";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(sidebarDefaultCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const SIDEBAR_WIDTH = sidebarCollapsed ? 60 : 256;
  const HEADER_HEIGHT = 64;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ===== Sticky Header ===== */}
      <header
        className="hi5-topbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          flexShrink: 0,
        }}
      >
        {/* Main header row */}
        <div style={{ height: HEADER_HEIGHT, padding: "0 16px", display: "flex", alignItems: "center", gap: 10 }}>

          {/* Mobile hamburger */}
          {showSidebar && (
            <button
              type="button"
              className="hi5-btn-ghost no-min-touch hi5-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              style={{
                height: 42, width: 42,
                padding: 0,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              id="hi5-mobile-hamburger"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Desktop collapse toggle */}
          {showSidebar && (
            <button
              type="button"
              className="hi5-btn-ghost no-min-touch"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{ height: 42, width: 42, padding: 0, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              id="hi5-desktop-collapse"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}

          {/* Title / Logo */}
          <Link
            to={homeHref}
            style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em", whiteSpace: "nowrap", textDecoration: "none", color: "rgb(var(--hi5-fg))", marginLeft: 2 }}
          >
            {title}
          </Link>

          {headerLeftSlot && (
            <div style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>
              {headerLeftSlot}
            </div>
          )}

          <div style={{ flex: 1 }} />

          {headerRightSlot && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {headerRightSlot}
            </div>
          )}
        </div>

        {/* Optional top bar slot (tabs, filters) */}
        {topBarSlot && (
          <div style={{ borderTop: "1px solid rgb(var(--hi5-border) / 0.10)", padding: "0 8px" }}>
            {topBarSlot}
          </div>
        )}
      </header>

      {/* ===== Body ===== */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* Desktop sidebar */}
        {showSidebar && (
          <aside
            id="hi5-desktop-sidebar"
            style={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              borderRight: "1px solid rgb(var(--hi5-border) / 0.10)",
              background: "rgb(var(--hi5-card) / 0.50)",
              backdropFilter: "blur(16px)",
              transition: "width 200ms ease",
              overflow: "hidden",
              position: "sticky",
              top: HEADER_HEIGHT,
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              overflowY: "auto",
            }}
          >
            <div style={{ padding: 8 }}>
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          </aside>
        )}

        {/* Mobile drawer overlay */}
        {showSidebar && drawerOpen && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
            id="hi5-mobile-drawer"
          >
            {/* Backdrop */}
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              style={{
                position: "absolute", inset: 0,
                background: "rgb(0 0 0 / 0.40)",
                backdropFilter: "blur(6px)",
                border: "none", cursor: "pointer",
              }}
            />
            {/* Drawer panel */}
            <div
              className="hi5-panel"
              style={{
                position: "absolute",
                top: 0, left: 0,
                height: "100%",
                width: "85vw",
                maxWidth: 320,
                borderRadius: "0 20px 20px 0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px", borderBottom: "1px solid rgb(var(--hi5-border) / 0.10)",
              }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Navigation</span>
                <button
                  type="button"
                  className="hi5-btn-ghost no-min-touch"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close"
                  style={{ height: 36, width: 36, padding: 0, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: 8, overflowY: "auto", flex: 1 }}>
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    collapsed={false}
                    onClick={() => setDrawerOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main
          className={contentClassName}
          style={{ flex: 1, minWidth: 0, padding: "16px 20px", overflowY: "auto" }}
        >
          {showBreadcrumbs && <Breadcrumbs />}
          {children}
        </main>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 767px) {
          #hi5-desktop-sidebar  { display: none !important; }
          #hi5-desktop-collapse { display: none !important; }
          .hi5-hamburger { display: flex !important; }

          /* Hide non-essential header items on mobile */
          #hi5-cmd-palette   { display: none !important; }
          #hi5-theme-picker  { display: none !important; }
          #hi5-title-divider { display: none !important; }

          /* Strip all mobile header icon buttons back to bare icons — no box */
          .hi5-hamburger,
          #hi5-notif-btn {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
            border-radius: 10px !important;
          }

          /* Account button: avatar circle only, no name/role/chevron */
          #hi5-acct-name-block { display: none !important; }
          #hi5-acct-chevron    { display: none !important; }
          #hi5-acct-btn {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 3px !important;
            height: 36px !important;
            width: 36px !important;
            border-radius: 50% !important;
          }
        }
        @media (min-width: 768px) {
          #hi5-mobile-drawer    { display: none !important; }
          .hi5-hamburger { display: none !important; }
        }
        @media (min-width: 640px) {
          .sm-show { display: block !important; }
        }
      `}</style>
    </div>
  );
}
