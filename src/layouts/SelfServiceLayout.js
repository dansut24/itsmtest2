// src/layouts/SelfServiceLayout.js
import React, { useEffect } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  AlertCircle,
  ClipboardList,
  ShoppingBag,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import logo from "../assets/865F7924-3016-4B89-8DF4-F881C33D72E6.png";
import { useThemeStore } from "../store/itsmStore";

const NAV = [
  { href: "/self-service", label: "Home", icon: <Home size={15} /> },
  { href: "/self-service/catalog", label: "Service Catalogue", icon: <ShoppingBag size={15} /> },
  { href: "/self-service/knowledge-base", label: "Knowledge Base", icon: <BookOpen size={15} /> },
  { href: "/self-service/raise-incident", label: "Report Issue", icon: <AlertCircle size={15} /> },
  { href: "/self-service/raise-request", label: "Raise Request", icon: <ClipboardList size={15} /> },
];

export default function SelfServiceLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mode } = useThemeStore();

  useEffect(() => {
    document.documentElement.className = mode || "";
  }, [mode]);

  return (
    <div style={{ minHeight: "100dvh", background: "rgb(var(--hi5-bg))" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 60,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          background: "rgb(var(--hi5-card)/0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgb(var(--hi5-border)/0.12)",
          boxShadow: "0 1px 20px rgb(0 0 0/0.06)",
        }}
      >
        <Link
          to="/self-service"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}
        >
          <img src={logo} alt="Hi5Tech" style={{ height: 28, width: "auto" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>
              Self Service
            </div>
            <div style={{ fontSize: 10, opacity: 0.45, fontWeight: 500 }}>Portal</div>
          </div>
        </Link>

        <nav style={{ display: "flex", gap: 4, marginLeft: 20, flex: 1, overflow: "hidden" }}>
          {NAV.map((n) => {
            const active =
              n.href === "/self-service"
                ? pathname === "/self-service"
                : pathname.startsWith(n.href);

            return (
              <Link
                key={n.href}
                to={n.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "rgb(var(--hi5-accent))" : "rgb(var(--hi5-fg)/0.65)",
                  background: active ? "rgb(var(--hi5-accent)/0.08)" : "transparent",
                  transition: "all 130ms",
                  whiteSpace: "nowrap",
                }}
              >
                {n.icon}
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="hi5-btn-ghost no-min-touch"
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <LogIn size={13} />
            Staff Login
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hi5-btn-ghost no-min-touch"
            style={{
              height: 34,
              width: 34,
              padding: 0,
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={15} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>
        <Outlet />
      </main>
    </div>
  );
}
