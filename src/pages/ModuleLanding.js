// src/pages/ModuleLanding.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/865F7924-3016-4B89-8DF4-F881C33D72E6.png";

// ---- Module definitions -----------------------------------------------------
const MODULES = [
  {
    key:   "itsm",
    title: "ITSM",
    description: "Incidents, service requests, changes, problems and the full service desk workflow.",
    href:  "/dashboard",
    gradient: "radial-gradient(600px 200px at 10% 0%, rgb(0 193 255/0.35), transparent 60%), radial-gradient(600px 200px at 90% 100%, rgb(255 79 225/0.28), transparent 60%)",
    color: "#00c1ff",
    quickLinks: [
      { label: "Dashboard",    href: "/dashboard"    },
      { label: "Incidents",    href: "/incidents"    },
      { label: "New Incident", href: "/new-incident" },
    ],
    Icon: () => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h10V4H7zm2 3h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z"/>
      </svg>
    ),
  },
  {
    key:   "control",
    title: "Control",
    description: "Remote monitoring, device management, live actions and automated remediation.",
    href:  "/control",
    gradient: "radial-gradient(600px 200px at 10% 10%, rgb(255 196 45/0.35), transparent 60%), radial-gradient(600px 200px at 90% 90%, rgb(0 193 255/0.28), transparent 60%)",
    color: "#ffc42d",
    quickLinks: [],
    comingSoon: true,
    Icon: () => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l2 3v1H8v-1l2-3H6a2 2 0 0 1-2-2V6zm2 0v7h12V6H6z"/>
      </svg>
    ),
  },
  {
    key:   "selfservice",
    title: "Self Service",
    description: "End-user portal for raising requests, tracking tickets and browsing the knowledge base.",
    href:  "/self-service",
    gradient: "radial-gradient(600px 200px at 20% 0%, rgb(255 79 225/0.32), transparent 60%), radial-gradient(600px 200px at 80% 100%, rgb(255 196 45/0.28), transparent 60%)",
    color: "#ff4fe1",
    quickLinks: [
      { label: "Portal Home",    href: "/self-service"                },
      { label: "Raise Request",  href: "/self-service/raise-request"  },
    ],
    Icon: () => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-4 7.5A6.97 6.97 0 0 1 12 15a6.97 6.97 0 0 1 4 1.5V17a5 5 0 0 0-8 0v-.5z"/>
      </svg>
    ),
  },
  {
    key:   "admin",
    title: "Admin",
    description: "User management, tenant configuration, module settings and system preferences.",
    href:  "/settings",
    gradient: "radial-gradient(600px 200px at 5% 5%, rgb(0 193 255/0.22), transparent 60%), radial-gradient(600px 200px at 95% 95%, rgb(255 196 45/0.22), transparent 60%)",
    color: "#94a3b8",
    quickLinks: [
      { label: "Settings", href: "/settings" },
      { label: "Profile",  href: "/profile"  },
    ],
    Icon: () => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.94s-.03-.63-.07-1l2.12-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.37-.07.67-.07 1s.03.63.07 1l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
      </svg>
    ),
  },
];

// Role -> which module keys are accessible
const ROLE_MODULES = {
  admin:       ["itsm", "control", "selfservice", "admin"],
  itsm:        ["itsm"],
  agent:       ["itsm"],
  selfservice: ["selfservice"],
  control:     ["control", "itsm"],
};

function getAccessibleModules(roles) {
  const keys = new Set();
  (roles || []).forEach((r) => {
    (ROLE_MODULES[r] || []).forEach((k) => keys.add(k));
  });
  return MODULES.filter((m) => keys.has(m.key));
}

// ---- Component --------------------------------------------------------------
export default function ModuleLanding() {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (!u?.username) { navigate("/login"); return; }
      setUser(u);

      // If only one accessible module, redirect straight there
      const accessible = getAccessibleModules(u.roles || []);
      if (accessible.length === 1) {
        navigate(accessible[0].href, { replace: true });
        return;
      }
    } catch {
      navigate("/login");
    }
    setTimeout(() => setMounted(true), 40);
  }, [navigate]);

  if (!user) return null;

  const accessible = getAccessibleModules(user.roles || []);
  const displayName = user.username || "there";

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
        background: "rgb(var(--hi5-card)/0.78)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgb(var(--hi5-border)/0.12)",
        boxShadow: "0 4px 24px rgb(0 0 0/0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "rgb(255 255 255/0.85)",
            border: "1px solid rgb(0 193 255/0.20)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img src={logo} alt="Hi5Tech" style={{ width: 24, height: 24, objectFit: "contain" }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.03em" }}>Hi5Tech</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.55 }}>
            Hi, <strong style={{ opacity: 1 }}>{displayName}</strong>
          </span>
          <button
            type="button"
            onClick={() => { sessionStorage.clear(); navigate("/login"); }}
            style={{
              fontSize: 12, fontWeight: 600, padding: "6px 12px",
              borderRadius: 10, border: "1px solid rgb(var(--hi5-border)/0.18)",
              background: "transparent", cursor: "pointer",
              color: "rgb(var(--hi5-fg))", opacity: 0.65,
              transition: "opacity 130ms",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.65"}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{
        flex: 1, paddingTop: 60, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 24px 40px",
      }}>
        <div style={{
          width: "100%", maxWidth: 860,
          transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.34,1.20,0.64,1)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
        }}>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 8px" }}>
              Where would you like to go?
            </h1>
            <p style={{ fontSize: 14, opacity: 0.50, margin: 0 }}>
              Select a module below to get started.
            </p>
          </div>

          {/* Module cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: accessible.length <= 2
              ? `repeat(${accessible.length}, minmax(0, 1fr))`
              : "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 16,
          }}>
            {accessible.map((mod, i) => (
              <ModuleCard
                key={mod.key}
                mod={mod}
                navigate={navigate}
                delay={i * 60}
                mounted={mounted}
              />
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: 11, opacity: 0.30, marginTop: 36 }}>
            Hi5Tech Platform -- your modules are determined by your account role
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- ModuleCard -------------------------------------------------------------
function ModuleCard({ mod, navigate, delay, mounted }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 20,
        background: "rgb(var(--hi5-card)/0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid " + (hovered ? mod.color + "40" : "rgb(var(--hi5-border)/0.18)"),
        overflow: "hidden",
        position: "relative",
        display: "flex", flexDirection: "column",
        cursor: mod.comingSoon ? "default" : "pointer",
        transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
        transform: mounted ? (hovered && !mod.comingSoon ? "translateY(-3px)" : "translateY(0)") : "translateY(12px)",
        boxShadow: hovered && !mod.comingSoon
          ? "0 16px 48px " + mod.color + "20, 0 4px 16px rgb(0 0 0/0.10)"
          : "0 2px 12px rgb(0 0 0/0.06)",
        transitionDelay: delay + "ms",
        opacity: mounted ? 1 : 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !mod.comingSoon && navigate(mod.href)}
    >
      {/* Gradient glow background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: mod.gradient,
        opacity: hovered ? 1 : 0.6,
        transition: "opacity 300ms",
      }} />

      <div style={{ position: "relative", padding: "24px 24px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Icon + title row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: "rgb(255 255 255/0.70)",
            border: "1px solid " + mod.color + "30",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: mod.color,
            boxShadow: "0 4px 16px " + mod.color + "25",
            transition: "box-shadow 200ms",
          }}>
            <mod.Icon />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
                {mod.title}
              </h3>
              {mod.comingSoon && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", padding: "2px 7px", borderRadius: 6,
                  background: "rgb(var(--hi5-border)/0.12)",
                  border: "1px solid rgb(var(--hi5-border)/0.20)",
                  opacity: 0.65,
                }}>
                  Coming Soon
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, opacity: 0.60, margin: 0, lineHeight: 1.55 }}>
              {mod.description}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer row */}
        {!mod.comingSoon ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            {/* Quick links */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {mod.quickLinks.map((ql) => (
                <button
                  key={ql.href}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(ql.href); }}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px",
                    borderRadius: 8, border: "1px solid rgb(var(--hi5-border)/0.18)",
                    background: "rgb(var(--hi5-card)/0.60)",
                    cursor: "pointer", transition: "all 130ms", minHeight: "unset",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.borderColor = mod.color + "50"; e.currentTarget.style.color = mod.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgb(var(--hi5-border)/0.18)"; e.currentTarget.style.color = ""; }}
                >
                  {ql.label}
                </button>
              ))}
            </div>

            {/* Open button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate(mod.href); }}
              className="hi5-btn-primary no-min-touch"
              style={{
                height: 36, padding: "0 18px", borderRadius: 11,
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                background: "linear-gradient(90deg," + mod.color + "," + mod.color + "cc)",
                boxShadow: "0 4px 16px " + mod.color + "40",
              }}
            >
              Open
            </button>
          </div>
        ) : (
          <p style={{ fontSize: 12, opacity: 0.45, margin: 0 }}>
            This module is coming soon. Check back later.
          </p>
        )}
      </div>
    </div>
  );
}
