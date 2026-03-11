// src/components/ui/Toast.js
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

function ToastItem({ t, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const dur = t.duration ?? (t.type === "error" ? 6000 : 4000);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(t.id), 300);
    }, dur);
    return () => {
      clearTimeout(enter);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [t, onDismiss]);

  const icons = {
    success: <CheckCircle size={16} style={{ color: "#10b981", flexShrink: 0 }} />,
    error:   <AlertCircle size={16} style={{ color: "#ef4444", flexShrink: 0 }} />,
    warning: <AlertTriangle size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />,
    info:    <Info size={16} style={{ color: "rgb(var(--hi5-accent))", flexShrink: 0 }} />,
  };

  const accents = {
    success: "#10b981",
    error:   "#ef4444",
    warning: "#f59e0b",
    info:    "rgb(var(--hi5-accent))",
  };

  return (
    <div
      role="alert"
      className="hi5-panel"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px",
        borderLeft: `4px solid ${accents[t.type]}`,
        borderRadius: 16,
        minWidth: 280,
        maxWidth: 360,
        width: "100%",
        transition: "opacity 300ms ease, transform 300ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div style={{ marginTop: 1 }}>{icons[t.type]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{t.title}</div>
        {t.message && (
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{t.message}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => { setVisible(false); setTimeout(() => onDismiss(t.id), 300); }}
        style={{ flexShrink: 0, opacity: 0.6, background: "none", border: "none", cursor: "pointer", padding: 2 }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...opts, id }]);
  }, []);

  const ctx = {
    toast: addToast,
    success: (title, message) => addToast({ type: "success", title, message }),
    error:   (title, message) => addToast({ type: "error",   title, message }),
    info:    (title, message) => addToast({ type: "info",    title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          right: 0,
          left: 0,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto", width: "100%", maxWidth: 360 }}>
            <ToastItem t={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
