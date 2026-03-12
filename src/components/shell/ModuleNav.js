// src/components/shell/ModuleNav.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Layers, Wrench, HeadphonesIcon, ShieldCheck,
} from "lucide-react";

const MODULES = [
  {
    key:   "itsm",
    label: "ITSM",
    href:  "/dashboard",
    Icon:  Layers,
    desc:  "Incidents, Changes, Problems",
    match: ["/dashboard", "/incidents", "/changes", "/problems", "/assets", "/knowledge-base", "/reports", "/approvals", "/service-requests", "/new-incident"],
  },
  {
    key:   "selfservice",
    label: "Self Service",
    href:  "/self-service",
    Icon:  HeadphonesIcon,
    desc:  "Submit and track requests",
    match: ["/self-service"],
  },
  {
    key:   "control",
    label: "Control",
    href:  "/control",
    Icon:  ShieldCheck,
    desc:  "Monitoring & automation",
    match: ["/control"],
    comingSoon: true,
  },
  {
    key:   "admin",
    label: "Admin",
    href:  "/settings",
    Icon:  Wrench,
    desc:  "Configuration & users",
    match: ["/settings", "/profile"],
  },
];

export default function ModuleNav() {
  const { pathname } = useLocation();

  function isActive(mod) {
    return mod.match.some((m) => pathname === m || pathname.startsWith(m + "/"));
  }

  return (
    <div
      id="hi5-module-nav"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        paddingTop: 6,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      <style>{`#hi5-module-nav::-webkit-scrollbar { display: none; }`}</style>
      {MODULES.map((mod) => {
        const active = isActive(mod);
        return (
          <Link
            key={mod.key}
            to={mod.comingSoon ? "#" : mod.href}
            onClick={mod.comingSoon ? (e) => e.preventDefault() : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              whiteSpace: "nowrap",
              textDecoration: "none",
              flexShrink: 0,
              transition: "all 150ms ease",
              cursor: mod.comingSoon ? "default" : "pointer",
              // active: filled accent pill
              background: active
                ? "rgb(0 193 255 / 0.12)"
                : "transparent",
              border: active
                ? "1px solid rgb(0 193 255 / 0.35)"
                : "1px solid rgb(var(--hi5-border) / 0.15)",
              color: active
                ? "rgb(0 193 255)"
                : mod.comingSoon
                  ? "rgb(var(--hi5-fg) / 0.35)"
                  : "rgb(var(--hi5-fg) / 0.70)",
              opacity: mod.comingSoon ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!active && !mod.comingSoon) {
                e.currentTarget.style.background = "rgb(var(--hi5-border) / 0.07)";
                e.currentTarget.style.borderColor = "rgb(var(--hi5-border) / 0.25)";
                e.currentTarget.style.color = "rgb(var(--hi5-fg))";
              }
            }}
            onMouseLeave={(e) => {
              if (!active && !mod.comingSoon) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgb(var(--hi5-border) / 0.15)";
                e.currentTarget.style.color = "rgb(var(--hi5-fg) / 0.70)";
              }
            }}
          >
            <mod.Icon size={12} style={{ flexShrink: 0 }} />
            {mod.label}
            {mod.comingSoon && (
              <span style={{
                fontSize: 9, fontWeight: 700,
                background: "rgb(var(--hi5-border) / 0.12)",
                border: "1px solid rgb(var(--hi5-border) / 0.18)",
                borderRadius: 4, padding: "1px 5px",
                letterSpacing: "0.04em", textTransform: "uppercase",
                opacity: 0.7,
              }}>
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
