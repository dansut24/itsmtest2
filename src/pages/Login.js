// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader } from "lucide-react";
import logo from "../assets/865F7924-3016-4B89-8DF4-F881C33D72E6.png";

// SSO provider icons as inline SVG to avoid MUI dependency
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="1"  y="1"  width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1"  width="10" height="10" fill="#7FBA00"/>
      <rect x="1"  y="13" width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form,       setForm]       = useState({ username: "", password: "" });
  const [showPass,   setShowPass]   = useState(false);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  }

  // ---- Test users -----------------------------------------------------------
  const TEST_USERS = {
    "admin":       { id: 1, name: "Admin User",       role: "Administrator",   roles: ["admin", "itsm", "selfservice", "control"] },
    "itsm.agent":  { id: 2, name: "ITSM Agent",       role: "ITSM Agent",      roles: ["itsm"] },
    "service.desk":{ id: 3, name: "Service Desk",     role: "Service Desk",    roles: ["itsm", "selfservice"] },
    "end.user":    { id: 4, name: "End User",          role: "End User",        roles: ["selfservice"] },
    "control.eng": { id: 5, name: "Control Engineer", role: "Control Engineer",roles: ["control", "itsm"] },
  };
  // Any password works for demo. Username must match a test user.
  // ---------------------------------------------------------------------------

  function handleLogin(e) {
    e && e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const match = TEST_USERS[form.username.toLowerCase().trim()];
      if (!match) {
        setLoading(false);
        setError("Username not found. Try: admin, itsm.agent, service.desk, end.user, control.eng");
        return;
      }
      const user = { ...match, username: form.username.trim(), avatar_url: "" };
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", "mock-token-" + match.id);
      navigate("/loading");
    }, 900);
  }

  const ssoProviders = [
    { label: "Continue with Google",    Icon: GoogleIcon,    color: "#4285F4" },
    { label: "Continue with Microsoft", Icon: MicrosoftIcon, color: "#00A4EF" },
    { label: "Continue with GitHub",    Icon: GithubIcon,    color: "#333" },
  ];

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative" }}>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420, position: "relative", zIndex: 1,
        transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      }}>

        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 16px",
            background: "rgb(255 255 255 / 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgb(0 193 255 / 0.25)",
            boxShadow: "0 8px 32px rgb(0 193 255 / 0.20), 0 2px 8px rgb(0 0 0 / 0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img src={logo} alt="Hi5Tech" style={{ width: 52, height: 52, objectFit: "contain" }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, opacity: 0.5, margin: 0 }}>
            Sign in to your Hi5Tech workspace
          </p>
        </div>

        {/* Panel */}
        <div className="hi5-panel" style={{ padding: "28px 28px 24px" }}>

          {/* SSO buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {ssoProviders.map(({ label, Icon, color }) => (
              <button
                key={label}
                type="button"
                className="hi5-btn-ghost"
                style={{
                  width: "100%", height: 44, justifyContent: "center", gap: 10,
                  fontSize: 13, fontWeight: 600,
                  transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color + "55"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgb(12 14 18 / 0.10)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.4, letterSpacing: "0.06em", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgb(12 14 18 / 0.10)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Username */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, display: "block", marginBottom: 6 }}>
                Username
              </label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="your.name"
                autoComplete="username"
                disabled={loading}
                className="hi5-input"
                style={{ height: 44, fontSize: 14 }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, display: "block", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="********"
                  autoComplete="current-password"
                  disabled={loading}
                  className="hi5-input"
                  style={{ height: 44, fontSize: 14, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    opacity: 0.4, color: "rgb(12 14 18)", display: "flex",
                    minHeight: "unset", minWidth: "unset", padding: 4,
                    transition: "opacity 130ms",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: "right", marginTop: -4 }}>
              <button
                type="button"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "rgb(0 193 255)",
                  opacity: 0.85, minHeight: "unset", padding: 0,
                  transition: "opacity 130ms",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0.85"}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: 12,
                background: "rgb(239 68 68 / 0.10)",
                border: "1px solid rgb(239 68 68 / 0.25)",
                color: "#ef4444", fontSize: 13, fontWeight: 500,
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="hi5-btn-primary"
              style={{
                height: 46, width: "100%", fontSize: 14, fontWeight: 700,
                borderRadius: 14, marginTop: 4, gap: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {loading ? (
                <>
                  <Loader size={15} style={{ animation: "spin 1s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Test credentials panel */}
        <div style={{
          marginTop: 20, borderRadius: 14,
          border: "1px solid rgb(0 193 255/0.20)",
          background: "rgb(0 193 255/0.04)",
          padding: "14px 16px",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.50, margin: "0 0 10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Demo accounts (any password)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { u: "admin",        r: "All modules",            c: "#00c1ff" },
              { u: "itsm.agent",   r: "ITSM only",              c: "#a78bfa" },
              { u: "service.desk", r: "ITSM + Self Service",     c: "#34d399" },
              { u: "end.user",     r: "Self Service only",       c: "#ff4fe1" },
              { u: "control.eng",  r: "Control + ITSM",          c: "#ffc42d" },
            ].map(({ u, r, c }) => (
              <button
                key={u}
                type="button"
                onClick={() => { setForm({ username: u, password: "demo" }); setError(""); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 8, padding: "7px 10px", borderRadius: 9,
                  background: "transparent",
                  border: "1px solid rgb(var(--hi5-border)/0.12)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "border-color 130ms, background 130ms",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c + "10"; e.currentTarget.style.borderColor = c + "40"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgb(var(--hi5-border)/0.12)"; }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: c }}>{u}</span>
                <span style={{ fontSize: 11, opacity: 0.45 }}>{r}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 11, opacity: 0.35, marginTop: 16 }}>
          Powered by Hi5Tech -- ITSM Platform
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
