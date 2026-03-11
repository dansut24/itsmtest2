// src/pages/NewIncident.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, User, ChevronRight, Check, AlertCircle,
  Flame, ArrowUp, Minus, ArrowLeft, Send, Loader,
  Building2, Tag, Monitor, FileText,
} from "lucide-react";

// Mock customer search results
const MOCK_CUSTOMERS = [
  { id: 1, name: "Sarah K.",     email: "sarah.k@contoso.com",     dept: "Finance",      avatar: "SK" },
  { id: 2, name: "James T.",     email: "james.t@contoso.com",     dept: "IT",           avatar: "JT" },
  { id: 3, name: "Alex M.",      email: "alex.m@contoso.com",      dept: "Marketing",    avatar: "AM" },
  { id: 4, name: "Priya R.",     email: "priya.r@contoso.com",     dept: "Engineering",  avatar: "PR" },
  { id: 5, name: "Mohammed A.",  email: "m.ahmed@contoso.com",     dept: "Operations",   avatar: "MA" },
  { id: 6, name: "Emma W.",      email: "emma.w@contoso.com",      dept: "HR",           avatar: "EW" },
  { id: 7, name: "Daniel S.",    email: "daniel.s@contoso.com",    dept: "Sales",        avatar: "DS" },
  { id: 8, name: "Li Wei",       email: "l.wei@contoso.com",       dept: "Finance",      avatar: "LW" },
];

const CATEGORIES = ["Hardware", "Software", "Network", "Access & Identity", "Service Request", "Security"];
const PRIORITIES = [
  { value: "Critical", color: "#ef4444", bg: "rgb(239 68 68/0.10)", border: "rgb(239 68 68/0.25)", Icon: Flame,     desc: "Business-critical, immediate response required" },
  { value: "High",     color: "#f97316", bg: "rgb(249 115 22/0.10)", border: "rgb(249 115 22/0.25)", Icon: ArrowUp,  desc: "Significant impact, response within 4 hours" },
  { value: "Medium",   color: "#ca8a04", bg: "rgb(234 179 8/0.10)",  border: "rgb(234 179 8/0.25)",  Icon: Minus,    desc: "Moderate impact, response within 8 hours" },
  { value: "Low",      color: "#64748b", bg: "rgb(100 116 139/0.10)",border: "rgb(100 116 139/0.25)",Icon: AlertCircle, desc: "Minimal impact, response within 24 hours" },
];
const ASSETS = ["No specific asset", "PROD-DB-01", "PROD-DB-02", "WEB-SRV-03", "VPN-GW-01", "SW-CORE-01", "SW-FLOOR2-01", "LAPTOP-1042", "LAPTOP-0891"];
const TEAMS  = ["Infrastructure", "Desktop Support", "Network Ops", "Security", "Service Desk"];

const AVATAR_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f97316","#06b6d4","#10b981"];
function avatarColor(name) { return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length]; }

// Steps config
const STEPS = [
  { id: "customer",  label: "Reporter",  Icon: User },
  { id: "details",   label: "Details",   Icon: FileText },
  { id: "classify",  label: "Classify",  Icon: Tag },
  { id: "confirm",   label: "Confirm",   Icon: Check },
];

function StepBar({ currentStep }) {
  const idx = STEPS.findIndex((s) => s.id === currentStep);
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {STEPS.map((step, i) => {
        const done    = i < idx;
        const current = i === idx;
        return (
          <React.Fragment key={step.id}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? "rgb(0 193 255)" : current ? "rgb(0 193 255/0.15)" : "rgb(12 14 18/0.07)",
                border: `2px solid ${done ? "rgb(0 193 255)" : current ? "rgb(0 193 255/0.50)" : "rgb(12 14 18/0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: done ? "#fff" : current ? "rgb(0 193 255)" : "rgb(12 14 18/0.35)",
                boxShadow: current ? "0 0 0 4px rgb(0 193 255/0.15)" : "none",
                transition: "all 300ms",
                flexShrink: 0,
              }}>
                {done ? <Check size={15} /> : <step.Icon size={14} />}
              </div>
              <span style={{ fontSize: 11, fontWeight: current ? 700 : 500, opacity: current ? 1 : done ? 0.7 : 0.4, whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 8px", marginBottom: 20,
                background: done ? "rgb(0 193 255)" : "rgb(12 14 18/0.10)",
                transition: "background 300ms",
                borderRadius: 1,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, display: "block", marginBottom: 7 }}>
      {children}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function HiInput({ value, onChange, placeholder, type = "text", disabled, autoFocus, onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className="hi5-input"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ height: 44, fontSize: 14, borderColor: focused ? "rgb(0 193 255/0.45)" : undefined }}
    />
  );
}

function HiTextarea({ value, onChange, placeholder, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", resize: "vertical",
        borderRadius: 14, padding: "10px 12px",
        background: "rgb(255 255 255/0.88)",
        border: "1px solid " + (focused ? "rgb(0 193 255/0.45)" : "rgb(12 14 18/0.14)"),
        outline: "none", fontSize: 14, color: "rgb(var(--hi5-fg))",
        fontFamily: "inherit", lineHeight: 1.6,
        boxShadow: focused ? "0 0 0 3px rgb(0 193 255/0.15)" : "0 1px 0 rgb(255 255 255/0.55) inset",
        transition: "border-color 160ms, box-shadow 160ms",
        minHeight: 100,
      }}
    />
  );
}

function HiSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%", height: 44, borderRadius: 14, padding: "0 12px",
        background: "rgb(255 255 255/0.88)",
        border: "1px solid rgb(12 14 18/0.14)",
        outline: "none", fontSize: 14, color: "rgb(var(--hi5-fg))",
        cursor: "pointer",
        boxShadow: "0 1px 0 rgb(255 255 255/0.55) inset",
      }}
    >
      {children}
    </select>
  );
}

// STEP 1: Customer search
function StepCustomer({ value, onSelect }) {
  const [query,   setQuery]   = useState(value?.name ? value.name : "");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  function doSearch(q) {
    const qlow = q.trim().toLowerCase();
    if (!qlow) { setResults([]); setSearched(false); return; }
    const found = MOCK_CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(qlow) || c.email.toLowerCase().includes(qlow) || c.dept.toLowerCase().includes(qlow)
    );
    setResults(found);
    setSearched(true);
  }

  function onChange(e) {
    setQuery(e.target.value);
    doSearch(e.target.value);
    if (value) onSelect(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <FieldLabel required>Search for reporter</FieldLabel>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>
            <Search size={15} />
          </div>
          <input
            value={query}
            onChange={onChange}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(query); }}
            placeholder="Name, email or department..."
            autoFocus
            className="hi5-input"
            style={{ height: 44, fontSize: 14, paddingLeft: 38 }}
          />
        </div>
      </div>

      {/* Selected */}
      {value && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          borderRadius: 14, background: "rgb(0 193 255/0.08)",
          border: "1px solid rgb(0 193 255/0.25)",
        }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor(value.name) + "22", border: "1.5px solid " + avatarColor(value.name) + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: avatarColor(value.name), flexShrink: 0 }}>
            {value.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{value.name}</div>
            <div style={{ fontSize: 12, opacity: 0.55 }}>{value.email} &bull; {value.dept}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgb(0 193 255)", fontSize: 12, fontWeight: 600 }}>
            <Check size={14} /> Selected
          </div>
        </div>
      )}

      {/* Results */}
      {searched && !value && (
        <div className="hi5-card" style={{ padding: 6, overflow: "hidden" }}>
          {results.length === 0 ? (
            <div style={{ padding: "20px 16px", textAlign: "center", opacity: 0.4, fontSize: 13 }}>
              No users found for "{query}"
            </div>
          ) : (
            results.map((c) => (
              <button key={c.id} type="button" onClick={() => { onSelect(c); setResults([]); setQuery(c.name); }}
                style={{
                  display: "flex", width: "100%", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 11, border: "none",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                  transition: "background 120ms", minHeight: "unset",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgb(0 193 255/0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarColor(c.name) + "22", border: "1.5px solid " + avatarColor(c.name) + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: avatarColor(c.name), flexShrink: 0 }}>
                  {c.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{c.email} &bull; {c.dept}</div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.3 }} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// STEP 2: Incident details
function StepDetails({ form, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <FieldLabel required>Incident title</FieldLabel>
        <HiInput value={form.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Brief summary of the issue..." autoFocus />
      </div>
      <div>
        <FieldLabel required>Description</FieldLabel>
        <HiTextarea value={form.description} onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the issue in detail. Include what happened, when it started, and how many users are affected..." rows={5} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <FieldLabel>Affected asset</FieldLabel>
          <HiSelect value={form.asset} onChange={(e) => onChange("asset", e.target.value)}>
            {ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
          </HiSelect>
        </div>
        <div>
          <FieldLabel>Assign to team</FieldLabel>
          <HiSelect value={form.team} onChange={(e) => onChange("team", e.target.value)}>
            {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </HiSelect>
        </div>
      </div>
    </div>
  );
}

// STEP 3: Classify
function StepClassify({ form, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Priority */}
      <div>
        <FieldLabel required>Priority</FieldLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PRIORITIES.map((p) => {
            const selected = form.priority === p.value;
            return (
              <button key={p.value} type="button" onClick={() => onChange("priority", p.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                  borderRadius: 14, cursor: "pointer", textAlign: "left",
                  background: selected ? p.bg : "transparent",
                  border: "1px solid " + (selected ? p.border : "rgb(12 14 18/0.12)"),
                  transition: "all 140ms", minHeight: "unset",
                }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgb(12 14 18/0.04)"; }}
                onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: selected ? p.bg : "rgb(12 14 18/0.06)", border: "1px solid " + (selected ? p.border : "rgb(12 14 18/0.10)"), display: "flex", alignItems: "center", justifyContent: "center", color: selected ? p.color : "rgb(12 14 18/0.40)", flexShrink: 0, transition: "all 140ms" }}>
                  <p.Icon size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selected ? p.color : "rgb(var(--hi5-fg))", transition: "color 140ms" }}>{p.value}</div>
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 1 }}>{p.desc}</div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2px solid " + (selected ? p.color : "rgb(12 14 18/0.20)"),
                  background: selected ? p.color : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 140ms",
                }}>
                  {selected && <Check size={10} color="#fff" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <FieldLabel required>Category</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIES.map((c) => {
            const selected = form.category === c;
            return (
              <button key={c} type="button" onClick={() => onChange("category", c)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 10,
                  cursor: "pointer", transition: "all 120ms", minHeight: "unset",
                  background: selected ? "rgb(0 193 255/0.12)" : "transparent",
                  border: "1px solid " + (selected ? "rgb(0 193 255/0.35)" : "rgb(12 14 18/0.15)"),
                  color: selected ? "rgb(0 193 255)" : "rgb(var(--hi5-fg))",
                }}>
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// STEP 4: Confirm
function StepConfirm({ customer, form }) {
  const priorityCfg = PRIORITIES.find((p) => p.value === form.priority) || PRIORITIES[1];
  const rows = [
    { Icon: User,      label: "Reporter",    value: customer ? customer.name + " (" + customer.dept + ")" : "--" },
    { Icon: FileText,  label: "Title",       value: form.title || "--" },
    { Icon: Tag,       label: "Category",    value: form.category || "--" },
    { Icon: Building2, label: "Team",        value: form.team },
    { Icon: Monitor,   label: "Asset",       value: form.asset },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Priority highlight */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
        borderRadius: 14, background: priorityCfg.bg, border: "1px solid " + priorityCfg.border,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: priorityCfg.color + "22", border: "1px solid " + priorityCfg.color + "33", display: "flex", alignItems: "center", justifyContent: "center", color: priorityCfg.color, flexShrink: 0 }}>
          <priorityCfg.Icon size={16} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Priority</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: priorityCfg.color }}>{form.priority}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, opacity: 0.55 }}>{priorityCfg.desc}</div>
      </div>

      {/* Details grid */}
      <div className="hi5-card" style={{ padding: "4px 0" }}>
        {rows.map(({ Icon, label, value }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < rows.length - 1 ? "1px solid rgb(12 14 18/0.06)" : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgb(12 14 18/0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={13} style={{ opacity: 0.5 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.45, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Description preview */}
      {form.description && (
        <div className="hi5-card" style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.45, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Description</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.75 }}>{form.description}</div>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const DEFAULT_FORM = {
  title: "", description: "",
  priority: "High", category: "Software",
  asset: "No specific asset", team: "Service Desk",
};

export default function NewIncident() {
  const navigate   = useNavigate();
  const [step,     setStep]     = useState("customer");
  const [customer, setCustomer] = useState(null);
  const [form,     setForm]     = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [newRef,     setNewRef]     = useState("");

  const stepIdx  = STEPS.findIndex((s) => s.id === step);
  const isFirst  = stepIdx === 0;
  const isLast   = step === "confirm";

  function updateForm(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function canAdvance() {
    if (step === "customer")  return !!customer;
    if (step === "details")   return !!form.title.trim() && !!form.description.trim();
    if (step === "classify")  return !!form.priority && !!form.category;
    return true;
  }

  function advance() {
    const order = STEPS.map((s) => s.id);
    const next  = order[stepIdx + 1];
    if (next) setStep(next);
  }

  function back() {
    const order = STEPS.map((s) => s.id);
    const prev  = order[stepIdx - 1];
    if (prev) setStep(prev);
  }

  function submit() {
    setSubmitting(true);
    setTimeout(() => {
      const ref = "INC-" + String(Math.floor(Math.random() * 900) + 100).padStart(4, "0");
      setNewRef(ref);
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  }

  // Success screen
  if (submitted) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 0", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
          background: "rgb(16 185 129/0.12)",
          border: "2px solid rgb(16 185 129/0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#10b981",
          animation: "successPop 400ms cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          <Check size={32} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px" }}>Incident raised</h2>
        <div style={{ fontSize: 14, opacity: 0.55, marginBottom: 6 }}>Your incident has been logged and assigned.</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "rgb(0 193 255)", background: "rgb(0 193 255/0.10)", border: "1px solid rgb(0 193 255/0.25)", borderRadius: 12, padding: "6px 16px", marginBottom: 28 }}>
          {newRef}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button type="button" className="hi5-btn-ghost" onClick={() => navigate("/incidents")} style={{ height: 42, padding: "0 20px", borderRadius: 12, fontSize: 13 }}>
            View all incidents
          </button>
          <button type="button" className="hi5-btn-primary" onClick={() => navigate("/incidents/1")} style={{ height: 42, padding: "0 20px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
            Open {newRef} <ChevronRight size={14} />
          </button>
        </div>
        <style>{`@keyframes successPop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>

      {/* Page heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button type="button" onClick={() => navigate(-1)} className="hi5-btn-ghost no-min-touch"
          style={{ height: 36, width: 36, padding: 0, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Raise Incident</h1>
          <div style={{ fontSize: 12, opacity: 0.45, marginTop: 2 }}>Complete all steps to log a new incident</div>
        </div>
      </div>

      {/* Step bar */}
      <StepBar currentStep={step} />

      {/* Card */}
      <div className="hi5-card" style={{ padding: "24px 26px", marginBottom: 16 }}>
        {/* Step heading */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em" }}>
            {step === "customer"  && "Who is reporting this incident?"}
            {step === "details"   && "What is the issue?"}
            {step === "classify"  && "How severe is it?"}
            {step === "confirm"   && "Review and submit"}
          </div>
          <div style={{ fontSize: 12, opacity: 0.45, marginTop: 4 }}>
            {step === "customer"  && "Search for the user affected by this incident"}
            {step === "details"   && "Provide a clear title and full description"}
            {step === "classify"  && "Set the priority and category for routing"}
            {step === "confirm"   && "Check everything looks correct before submitting"}
          </div>
        </div>

        {/* Step content */}
        {step === "customer"  && <StepCustomer value={customer} onSelect={setCustomer} />}
        {step === "details"   && <StepDetails form={form} onChange={updateForm} />}
        {step === "classify"  && <StepClassify form={form} onChange={updateForm} />}
        {step === "confirm"   && <StepConfirm customer={customer} form={form} />}
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button type="button" onClick={back} disabled={isFirst} className="hi5-btn-ghost no-min-touch"
          style={{ height: 44, padding: "0 18px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", gap: 7, opacity: isFirst ? 0.35 : 1 }}>
          <ArrowLeft size={14} /> Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, opacity: 0.4 }}>Step {stepIdx + 1} of {STEPS.length}</span>
          {isLast ? (
            <button type="button" onClick={submit} disabled={submitting} className="hi5-btn-primary no-min-touch"
              style={{ height: 44, padding: "0 22px", borderRadius: 12, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              {submitting ? <><Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : <><Send size={14} /> Submit Incident</>}
            </button>
          ) : (
            <button type="button" onClick={advance} disabled={!canAdvance()} className="hi5-btn-primary no-min-touch"
              style={{ height: 44, padding: "0 22px", borderRadius: 12, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, opacity: canAdvance() ? 1 : 0.45 }}>
              Continue <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
