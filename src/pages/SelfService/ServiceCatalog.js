// src/pages/SelfService/ServiceCatalog.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Laptop,
  Wifi,
  Mail,
  Shield,
  Monitor,
  Package,
  User,
  Plus,
} from "lucide-react";

const CATALOGUE = [
  {
    id: "c1",
    cat: "Hardware",
    icon: <Laptop size={20} />,
    title: "New Laptop",
    sub: "Standard issue Dell/Apple laptop",
    time: "3-5 days",
    color: "#6366f1",
  },
  {
    id: "c2",
    cat: "Hardware",
    icon: <Monitor size={20} />,
    title: "External Monitor",
    sub: "24 inch or 27 inch display",
    time: "2-3 days",
    color: "#6366f1",
  },
  {
    id: "c3",
    cat: "Software",
    icon: <Package size={20} />,
    title: "Software Licence",
    sub: "Adobe, Office, or other approved apps",
    time: "1 day",
    color: "#3b82f6",
  },
  {
    id: "c4",
    cat: "Access",
    icon: <Shield size={20} />,
    title: "VPN Access",
    sub: "Corporate VPN credentials",
    time: "Same day",
    color: "#22c55e",
  },
  {
    id: "c5",
    cat: "Access",
    icon: <User size={20} />,
    title: "Admin Rights",
    sub: "Local or domain admin access",
    time: "2-3 days",
    color: "#22c55e",
  },
  {
    id: "c6",
    cat: "Network",
    icon: <Wifi size={20} />,
    title: "Guest Wi-Fi Access",
    sub: "Temporary access for visitors",
    time: "Same day",
    color: "#f97316",
  },
  {
    id: "c7",
    cat: "Account",
    icon: <Mail size={20} />,
    title: "Email Account",
    sub: "New mailbox setup and configuration",
    time: "1 day",
    color: "#ec4899",
  },
  {
    id: "c8",
    cat: "Account",
    icon: <User size={20} />,
    title: "New User Onboarding",
    sub: "Full IT setup for a new starter",
    time: "3-5 days",
    color: "#ec4899",
  },
];

const CATS = ["All", ...new Set(CATALOGUE.map((c) => c.cat))];

export default function ServiceCatalog() {
  const navigate = useNavigate();
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? CATALOGUE : CATALOGUE.filter((c) => c.cat === cat);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
          Service Catalogue
        </h2>
        <p style={{ fontSize: 14, opacity: 0.5, margin: 0 }}>
          Browse and request IT services
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {CATS.map((c) => {
          const active = cat === c;

          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              style={{
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                padding: "5px 12px",
                borderRadius: 9999,
                border: active
                  ? "1px solid rgb(var(--hi5-accent)/0.40)"
                  : "1px solid rgb(var(--hi5-border)/0.15)",
                background: active ? "rgb(var(--hi5-accent)/0.10)" : "transparent",
                color: active
                  ? "rgb(var(--hi5-accent))"
                  : "rgb(var(--hi5-fg)/0.60)",
                cursor: "pointer",
                transition: "all 130ms",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: 12,
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="hi5-card"
            style={{ padding: 18, cursor: "pointer", transition: "all 150ms" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgb(0 0 0/0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: item.color + "15",
                  border: "1px solid " + item.color + "25",
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 5,
                  background: "rgb(var(--hi5-border)/0.10)",
                  opacity: 0.6,
                }}
              >
                {item.cat}
              </span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 12, lineHeight: 1.4 }}>
              {item.sub}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, opacity: 0.45 }}>Est. {item.time}</span>
              <button
                type="button"
                onClick={() => navigate("/self-service/raise-request")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.color,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Plus size={13} />
                Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
