// src/pages/SelfService/KnowledgeBase.js
import React, { useState, useMemo } from "react";
import { Search, BookOpen, Eye, ThumbsUp, Tag, ArrowRight } from "lucide-react";
import { KB_ARTICLES } from "../../data/mockData";

const CATS = ["All", ...new Set(KB_ARTICLES.map((a) => a.category))];

export default function SelfServiceKB() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const published = useMemo(
    () => KB_ARTICLES.filter((a) => a.status === "Published"),
    []
  );

  const filtered = useMemo(() => {
    let rows = published;

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (cat !== "All") {
      rows = rows.filter((a) => a.category === cat);
    }

    return rows;
  }, [published, search, cat]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
          Knowledge Base
        </h2>
        <p style={{ fontSize: 14, opacity: 0.5, margin: 0 }}>
          {published.length} articles to help you get things done
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          style={{
            width: "100%",
            height: 42,
            paddingLeft: 36,
            paddingRight: 12,
            borderRadius: 12,
            fontSize: 13,
            background: "rgb(var(--hi5-card)/0.90)",
            border: "1px solid rgb(var(--hi5-border)/0.18)",
            color: "rgb(var(--hi5-fg))",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgb(var(--hi5-accent)/0.40)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgb(var(--hi5-border)/0.18)";
          }}
        />
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

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 16px", opacity: 0.4 }}>
          <BookOpen size={28} style={{ marginBottom: 8 }} />
          <div>No articles match your search</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 12,
          }}
        >
          {filtered.map((art) => (
            <div
              key={art.id}
              className="hi5-card"
              style={{ padding: 16, cursor: "pointer", transition: "all 150ms" }}
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
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, flex: 1 }}>
                  {art.title}
                </div>
                <ArrowRight size={14} style={{ opacity: 0.3, flexShrink: 0, marginTop: 2 }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, opacity: 0.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Tag size={10} />
                  {art.category}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Eye size={10} />
                  {art.views.toLocaleString()}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <ThumbsUp size={10} />
                  {art.helpful}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
