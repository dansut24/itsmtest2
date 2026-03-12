// src/components/Layout.js
import React, { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, AlertCircle, ClipboardList, GitBranch,
  AlertTriangle, Monitor, BookOpen, BarChart2, ThumbsUp,
  User, Settings,
} from "lucide-react";

import AppShell from "./shell/AppShell";
import TabBar from "./shell/TabBar";
import AccountDropdown from "./ui/AccountDropdown";
import NotificationPanel from "./ui/NotificationPanel";
import CommandPalette from "./ui/CommandPalette";
import { useItsmStore, useThemeStore } from "../store/itsmStore";

const NAV_ITEMS = [
  { href: "/dashboard",        label: "Dashboard",        icon: <LayoutDashboard size={16} />, exact: true },
  { href: "/incidents",        label: "Incidents",        icon: <AlertCircle size={16} /> },
  { href: "/service-requests", label: "Service Requests", icon: <ClipboardList size={16} /> },
  { href: "/changes",          label: "Changes",          icon: <GitBranch size={16} /> },
  { href: "/problems",         label: "Problems",         icon: <AlertTriangle size={16} /> },
  { href: "/assets",           label: "Assets",           icon: <Monitor size={16} /> },
  { href: "/knowledge-base",   label: "Knowledge Base",   icon: <BookOpen size={16} /> },
  { href: "/reports",          label: "Reports",          icon: <BarChart2 size={16} /> },
  { href: "/approvals",        label: "Approvals",        icon: <ThumbsUp size={16} /> },
  { href: "/profile",          label: "Profile",          icon: <User size={16} /> },
  { href: "/settings",         label: "Settings",         icon: <Settings size={16} /> },
];

const ROUTE_TITLES = {
  "/dashboard":        "Dashboard",
  "/incidents":        "Incidents",
  "/service-requests": "Service Requests",
  "/changes":          "Changes",
  "/problems":         "Problems",
  "/assets":           "Assets",
  "/knowledge-base":   "Knowledge Base",
  "/reports":          "Reports",
  "/approvals":        "Approvals",
  "/profile":          "Profile",
  "/settings":         "Settings",
  "/new-incident":     "New Incident",
};

function titleFromPath(pathname) {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.startsWith("/incidents/")) return "Incident";
  return (
    pathname.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Page"
  );
}

function idFromPath(pathname) {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname.startsWith("/incidents/")) return "incident:" + pathname;
  return pathname;
}

export default function Layout() {
  const { pathname } = useLocation();
  const { upsertTab } = useItsmStore();
  const { mode, setMode } = useThemeStore();

  useEffect(() => {
    const id = idFromPath(pathname);
    const title = titleFromPath(pathname);
    upsertTab({ id, href: pathname, title, pinned: pathname === "/dashboard" });
  }, [pathname, upsertTab]);

  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const THEMES = [
    { value: "light",  label: "Light"  },
    { value: "dark",   label: "Dark"   },
    { value: "ocean",  label: "Ocean"  },
    { value: "forest", label: "Forest" },
    { value: "sunset", label: "Sunset" },
  ];

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <CommandPalette />

      <NotificationPanel />

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: "rgb(var(--hi5-border)/0.18)", flexShrink: 0 }} />

      {/* Theme picker -- styled select chip */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
            background: "rgb(var(--hi5-card)/0.85)",
            border: "1px solid rgb(var(--hi5-border)/0.18)",
            borderRadius: 11,
            padding: "0 28px 0 11px",
            height: 34,
            color: "rgb(var(--hi5-fg))",
            cursor: "pointer",
            outline: "none",
            backdropFilter: "blur(8px)",
            minWidth: 74,
          }}
        >
          {THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {/* Chevron overlay */}
        <svg style={{ position: "absolute", right: 8, pointerEvents: "none", opacity: 0.45 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <AccountDropdown
        name={storedUser.username}
        email={storedUser.email}
        role={storedUser.roles && storedUser.roles[0]}
      />
    </div>
  );

  return (
    <AppShell
      title="Hi5Tech ITSM"
      homeHref="/dashboard"
      navItems={NAV_ITEMS}
      topBarSlot={<TabBar newTabHref="/dashboard" />}
      showBreadcrumbs={true}
      headerRightSlot={headerRight}
    >
      <Outlet />
    </AppShell>
  );
}
