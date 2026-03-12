// src/components/shell/AppShell.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

// ---- Page transition wrapper ------------------------------------------------
function PageTransition({ children }) {
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(6px)",
      transition: "opacity 220ms ease, transform 220ms cubic-bezier(0.34,1.10,0.64,1)",
    }}>
      {children}
    </div>
  );
}

// ---- helpers ----------------------------------------------------------------
function normalizePath(p) {
  return (p || "").split("?")[0].split("#")[0];
}
function isActivePath(pathname, item) {
  const p    = normalizePath(pathname);
  const href = normalizePath(item.href);
  if (item.exact) return p === href;
  return p === href || p.startsWith(href + "/");
}

// ---- NavItem ----------------------------------------------------------------
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

// ---- Breadcrumbs ------------------------------------------------------------
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
    <nav aria-label="Breadcrumb" style={{ marginBottom: 14, overflow: "hidden" }}>
      <ol style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", gap: 4, fontSize: 12, opacity: 0.55, listStyle: "none", margin: 0, padding: 0, overflow: "hidden" }}>
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

// ---- ModuleNav (passed in as prop) ------------------------------------------
// Rendered as a sub-row beneath the main header row.

// ---- AppShell ---------------------------------------------------------------
export default function AppShell({
  title,
  homeHref          = "/dashboard",
  navItems          = [],
  moduleNavSlot,              // NEW: pill-nav row beneath header
  sidebarDefaultCollapsed = false,
  sidebarMode       = "visible",
  headerLeftSlot,
  headerRightSlot,
  topBarSlot,
  children,
  showBreadcrumbs   = true,
  contentClassName  = "",
}) {
  const showSidebar = sidebarMode !== "hidden";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(sidebarDefaultCollapsed);
  const [drawerOpen,       setDrawerOpen]       = useState(false);

  const SIDEBAR_WIDTH = sidebarCollapsed ? 60 : 256;

  // Measure actual header height so spacer + sidebar top are always accurate
  const headerRef    = useRef(null);
  const [headerH, setHeaderH] = useState(98); // fallback

  const measureHeader = useCallback(() => {
    if (headerRef.current) {
      setHeaderH(headerRef.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    measureHeader();
    const ro = new ResizeObserver(measureHeader);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [measureHeader]);

  // ---- SCROLL FIX -----------------------------------------------------------
  // The old layout had overflowY:"auto" on <main>, creating a nested scroll
  // container that fights with position:sticky on the header.
  //
  // New approach:
  //   - Outer wrapper: normal block flow (no flexbox height tricks)
  //   - Header: position:fixed, full width, known height via CSS var
  //   - Sidebar: position:fixed, top = header height
  //   - Main: normal block, padding-top = header height so content isn't hidden
  //
  // This means the browser's native scroll applies to the whole page, so
  // sticky/fixed elements behave correctly and iOS scroll momentum works.
  // ---------------------------------------------------------------------------

  return (
    <div style={{ minHeight: "100dvh" }}>

      {/* ===== Fixed Header ===== */}
      <header
        ref={headerRef}
        className="hi5-topbar"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 40,
        }}
      >
        {/* Main row */}
        <div style={{
          height: 60,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>

          {/* Mobile hamburger — shown via CSS class */}
          {showSidebar && (
            <button
              type="button"
              className="hi5-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              style={{ height: 36, width: 36, padding: 0, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "rgb(var(--hi5-fg))", flexShrink: 0 }}
              id="hi5-mobile-hamburger"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Desktop sidebar collapse toggle */}
          {showSidebar && (
            <button
              type="button"
              className="hi5-btn-ghost no-min-touch"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{ height: 36, width: 36, padding: 0, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              id="hi5-desktop-collapse"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}

          {/* Brand */}
          <Link
            to={homeHref}
            style={{
              fontWeight: 800, fontSize: 15,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
              textDecoration: "none",
              color: "rgb(var(--hi5-fg))",
              marginLeft: 2,
              flexShrink: 0,
            }}
          >
            {title}
          </Link>

          {/* Subtle divider */}
          <div
            id="hi5-title-divider"
            style={{ width: 1, height: 20, background: "rgb(var(--hi5-border)/0.20)", flexShrink: 0, marginLeft: 2, marginRight: 2 }}
          />

          {headerLeftSlot && (
            <div style={{ display: "flex", alignItems: "center" }}>
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

        {/* Module nav row */}
        {moduleNavSlot && (
          <div style={{ borderTop: "1px solid rgb(var(--hi5-border)/0.08)", padding: "0 12px 8px" }}>
            {moduleNavSlot}
          </div>
        )}

        {/* Tab bar row */}
        {topBarSlot && (
          <div style={{ borderTop: "1px solid rgb(var(--hi5-border)/0.08)", padding: "0 8px" }}>
            {topBarSlot}
          </div>
        )}
      </header>

      {/* Spacer — height matched to actual rendered header height */}
      <div id="hi5-header-spacer" style={{ height: headerH }} />

      {/* ===== Body ===== */}
      <div style={{ display: "flex" }}>

        {/* Desktop sidebar — also fixed */}
        {showSidebar && (
          <aside
            id="hi5-desktop-sidebar"
            style={{
              position: "fixed",
              top: headerH, left: 0,
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              borderRight: "1px solid rgb(var(--hi5-border)/0.10)",
              background: "rgb(var(--hi5-card)/0.55)",
              backdropFilter: "blur(20px)",
              transition: "width 200ms ease",
              overflow: "hidden",
              height: `calc(100dvh - ${headerH}px)`,
              overflowY: "auto",
              zIndex: 30,
            }}
            id-sidebar-width={SIDEBAR_WIDTH}
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
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              style={{ position: "absolute", inset: 0, background: "rgb(0 0 0/0.40)", backdropFilter: "blur(6px)", border: "none", cursor: "pointer" }}
            />
            <div
              className="hi5-panel"
              style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "85vw", maxWidth: 320, borderRadius: "0 20px 20px 0", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid rgb(var(--hi5-border)/0.10)" }}>
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

        {/* Main content — left margin = sidebar width on desktop */}
        <main
          className={contentClassName}
          id="hi5-main"
          style={{ flex: 1, minWidth: 0, padding: "16px 20px" }}
        >
          {showBreadcrumbs && <Breadcrumbs />}
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* ===== Responsive CSS ===== */}
      <style>{`
        /* Header spacer + sidebar positioning driven by JS measurement — no CSS vars needed */

        /* Main left margin = sidebar width on desktop */
        @media (min-width: 768px) {
          #hi5-main {
            margin-left: ${SIDEBAR_WIDTH}px;
          }
          #hi5-mobile-drawer { display: none !important; }
          .hi5-hamburger     { display: none !important; }
        }

        /* Tablet (768–1023px): sidebar collapsed by default, tighter layout */
        @media (min-width: 768px) and (max-width: 1023px) {
          #hi5-main-content {
            padding: 16px !important;
          }
          #hi5-sidebar-toggle {
            display: flex !important;
          }
        }

        /* Tablet: search label hidden to save space */
        @media (min-width: 768px) and (max-width: 900px) {
          #hi5-cmd-palette span:not(kbd) {
            display: none !important;
          }
          #hi5-theme-picker select {
            min-width: 56px !important;
          }
        }

        @media (max-width: 767px) {
          #hi5-desktop-sidebar  { display: none !important; }
          #hi5-desktop-collapse { display: none !important; }
          .hi5-hamburger        { display: flex !important; }
          #hi5-main             { margin-left: 0 !important; padding: 12px 14px; }

          /* Strip verbose items */
          #hi5-cmd-palette   { display: none !important; }
          #hi5-theme-picker  { display: none !important; }
          #hi5-title-divider { display: none !important; }

          /* Bell: bare icon, no box */
          #hi5-notif-btn {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            width: 36px !important; height: 36px !important;
            padding: 0 !important;
            border-radius: 10px !important;
          }

          /* Account: avatar only */
          #hi5-acct-name-block { display: none !important; }
          #hi5-acct-chevron    { display: none !important; }
          #hi5-acct-btn {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 3px !important;
            height: 36px !important; width: 36px !important;
            border-radius: 50% !important;
          }
        }

        @media (min-width: 640px) {
          .sm-show { display: block !important; }
        }
      `}</style>
    </div>
  );
}
