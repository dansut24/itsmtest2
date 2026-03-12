// src/pages/NotFound.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const loggedIn = !!sessionStorage.getItem("token");
  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", position:"relative", overflow:"hidden" }}>
      {/* Background blobs */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgb(0 193 255/0.12), transparent 70%)", top:"-20%", left:"-10%", filter:"blur(60px)" }}/>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgb(255 79 225/0.10), transparent 70%)", bottom:"-15%", right:"-10%", filter:"blur(60px)" }}/>
      </div>

      <div style={{
        position:"relative", zIndex:1, textAlign:"center", maxWidth:480,
        transition:"opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.20,0.64,1)",
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)",
      }}>
        {/* 404 display */}
        <div style={{ position:"relative", marginBottom:24, display:"inline-block" }}>
          <div style={{
            fontSize:"clamp(96px,20vw,140px)", fontWeight:900, lineHeight:1,
            letterSpacing:"-0.06em",
            background:"linear-gradient(135deg, rgb(0 193 255), rgb(255 79 225) 60%, rgb(255 196 45))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            filter:"drop-shadow(0 4px 24px rgb(0 193 255/0.25))",
          }}>404</div>
          <div style={{
            position:"absolute", inset:0, fontSize:"clamp(96px,20vw,140px)", fontWeight:900, lineHeight:1,
            letterSpacing:"-0.06em", opacity:0.06, filter:"blur(16px)",
            background:"linear-gradient(135deg, #00c1ff, #ff4fe1)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>404</div>
        </div>

        <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.03em", margin:"0 0 10px" }}>
          Page not found
        </h1>
        <p style={{ fontSize:14, opacity:0.50, margin:"0 0 32px", lineHeight:1.6 }}>
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>

        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button type="button" onClick={() => navigate(-1)}
            className="hi5-btn-ghost no-min-touch"
            style={{ height:40, padding:"0 20px", borderRadius:12, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:7 }}>
            <ArrowLeft size={15}/> Go back
          </button>
          <button type="button" onClick={() => navigate(loggedIn ? "/dashboard" : "/login")}
            className="hi5-btn-primary no-min-touch"
            style={{ height:40, padding:"0 20px", borderRadius:12, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:7 }}>
            <Home size={15}/> {loggedIn ? "Dashboard" : "Sign in"}
          </button>
        </div>

        {loggedIn && (
          <button type="button" onClick={() => navigate("/incidents")}
            style={{ marginTop:16, background:"none", border:"none", cursor:"pointer", fontSize:13, opacity:0.45, display:"flex", alignItems:"center", gap:5, margin:"16px auto 0" }}>
            <Search size={13}/> Search incidents
          </button>
        )}
      </div>
    </div>
  );
}
