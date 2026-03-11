// src/components/Layout.js
import React, { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, AlertCircle, ClipboardList, GitBranch,
  AlertTriangle, Monitor, BookOpen, BarChart2, ThumbsUp,
  User, Settings, Bell, Search,
} from "lucide-react";

import AppShell from "./shell/AppShell";
import TabBar from "./shell/TabBar";
import AccountDropdown from "./ui/AccountDropdown";
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

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        className="hi5-btn-ghost no-min-touch"
        aria-label="Search"
        style={{
          height: 38, width: 38, padding: 0,
          borderRadius: 12, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Search size={17} />
      </button>

      <button
        type="button"
        className="hi5-btn-ghost no-min-touch"
        aria-label="Notifications"
        style={{
          height: 38, width: 38, padding: 0,
          borderRadius: 12, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Bell size={17} />
      </button>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{
          fontSize: 12,
          background: "transparent",
          border: "1px solid rgb(var(--hi5-border) / 0.12)",
          borderRadius: 10,
          padding: "4px 8px",
          color: "rgb(var(--hi5-fg))",
          cursor: "pointer",
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="ocean">Ocean</option>
        <option value="forest">Forest</option>
        <option value="sunset">Sunset</option>
      </select>

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
