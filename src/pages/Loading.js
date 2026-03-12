// src/pages/Loading.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/865F7924-3016-4B89-8DF4-F881C33D72E6.png";

const STEPS = [
  "Authenticating session...",
  "Loading your workspace...",
  "Fetching live incidents...",
  "Almost there...",
];

export default function Loading() {
  const navigate  = useNavigate();
  const [step,    setStep]    = useState(0);
  const [progress, setProgress] = useState(0);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    // Step through loading messages
    const stepInterval = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) { clearInterval(stepInterval); return s; }
        return s + 1;
      });
    }, 500);

    // Smooth progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        // Ease: fast at start, slow at end
        const remaining = 100 - p;
        return p + Math.max(0.5, remaining * 0.07);
      });
    }, 30);

    // Navigate after 2.2s
    const timer = setTimeout(() => {
      setDone(true);
      setTimeout(() => navigate("/apps"), 350);
    }, 2200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      transition: "opacity 350ms ease",
      opacity: done ? 0 : 1,
    }}>

      {/* Logo with pulse ring */}
      <div style={{ position: "relative", marginBottom: 32 }}>
        {/* Outer pulse ring */}
        <div style={{
          position: "absolute",
          inset: -16,
          borderRadius: "50%",
          border: "2px solid rgb(0 193 255 / 0.20)",
          animation: "hi5-ring-pulse 1.8s ease infinite",
        }} />
        {/* Inner ring */}
        <div style={{
          position: "absolute",
          inset: -8,
          borderRadius: "50%",
          border: "1.5px solid rgb(0 193 255 / 0.35)",
          animation: "hi5-ring-pulse 1.8s ease 0.3s infinite",
        }} />

        {/* Logo container */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: "rgb(255 255 255 / 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgb(0 193 255 / 0.30)",
          boxShadow: "0 12px 40px rgb(0 193 255 / 0.25), 0 4px 12px rgb(0 0 0 / 0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          animation: "hi5-logo-breathe 2s ease infinite",
        }}>
          <img src={logo} alt="Hi5Tech" style={{ width: 56, height: 56, objectFit: "contain" }} />
        </div>
      </div>

      {/* Brand name */}
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
        Hi5Tech
      </div>
      <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 40, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        ITSM Platform
      </div>

      {/* Progress bar */}
      <div style={{ width: 260, marginBottom: 16 }}>
        <div style={{
          height: 3, borderRadius: 2,
          background: "rgb(12 14 18 / 0.10)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: progress + "%",
            borderRadius: 2,
            background: "linear-gradient(90deg, rgb(0 193 255), rgb(255 79 225))",
            transition: "width 30ms linear",
            boxShadow: "0 0 8px rgb(0 193 255 / 0.60)",
          }} />
        </div>
      </div>

      {/* Step message */}
      <div style={{
        fontSize: 12, fontWeight: 500, opacity: 0.45,
        height: 18, overflow: "hidden",
        transition: "opacity 200ms ease",
        minWidth: 220, textAlign: "center",
      }}>
        {STEPS[step]}
      </div>

      <style>{`
        @keyframes hi5-ring-pulse {
          0%   { transform: scale(1);   opacity: 1; }
          70%  { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes hi5-logo-breathe {
          0%, 100% { box-shadow: 0 12px 40px rgb(0 193 255 / 0.25), 0 4px 12px rgb(0 0 0 / 0.10); }
          50%       { box-shadow: 0 16px 56px rgb(0 193 255 / 0.40), 0 4px 12px rgb(0 0 0 / 0.10); }
        }
      `}</style>
    </div>
  );
}
