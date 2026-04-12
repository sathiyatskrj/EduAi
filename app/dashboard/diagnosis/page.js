"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { parseMarkdown } from "@/app/utils/markdown";
import { Sparkles, ChevronRight } from "lucide-react";

const QUESTIONS = [
  { q: "Q4", topic: "Multiplying Fractions", level: "Application", fail: 72, err: "Calculation Error", color: "var(--danger)" },
  { q: "Q7", topic: "Algebraic Identities", level: "Understanding", fail: 45, err: "Conceptual Gap", color: "var(--warning)" },
  { q: "Q9", topic: "Word Problems", level: "Analysis", fail: 38, err: "Comprehension", color: "var(--warning)" },
  { q: "Q2", topic: "Linear Equations", level: "Knowledge", fail: 8, err: "Careless", color: "var(--success)" },
];

const HEATMAP_STUDENTS = ["Aarav", "Avni", "Dhruv", "Diya", "Ishaan", "Kavya", "Lakshmi", "Mohan", "Neha", "Om", "Priya"];
const HEATMAP_QS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"];
// Generate deterministic mock scores
function mockScore(si, qi) {
  const v = ((si * 7 + qi * 13 + 3) % 11);
  return v; // 0-10 marks per question
}

function heatColor(score, max) {
  const pct = score / max;
  if (pct >= 0.7) return "rgba(16,185,129,0.25)";
  if (pct >= 0.4) return "rgba(245,158,11,0.2)";
  return "rgba(239,68,68,0.2)";
}

export default function Diagnosis() {
  const [aiInsight, setAiInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const { aiProvider, ollamaModel, incrementAiUsage } = useApp();

  const generateInsights = async () => {
    setInsightLoading(true);
    setAiInsight("");
    incrementAiUsage();
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "You are EduAI Diagnostic Engine. Analyze the question-wise failure data and generate actionable insights for the teacher. Be specific about what went wrong and what to do next. Keep it to 3-4 paragraphs. IMPORTANT: Do NOT use LaTeX or dollar-sign math notation. Write all math in plain text with Unicode symbols (×, ÷, ², √, π, etc.).",
          prompt: `Analyze this class diagnostic data for VII-A Mathematics Unit Test 1:\n\nQuestion-wise failures:\n- Q4 (Multiplying Fractions, Application level): 72% failure — primarily calculation errors\n- Q7 (Algebraic Identities, Understanding): 45% failure — conceptual misunderstanding of (a+b)²\n- Q9 (Word Problems, Analysis): 38% failure — reading comprehension issues\n- Q2 (Linear Equations, Knowledge): 8% failure — careless errors\n\nAt-risk students: Diya Reddy (38%), Kavya Gupta (42%), Om Prakash (33%)\n\nProvide: 1) Root cause analysis 2) Priority action items 3) Recommended teaching strategy changes`,
          provider: aiProvider,
          model: ollamaModel,
        }),
      });
      setInsightLoading(false);
      await consumeStream(res, (text) => setAiInsight(text), null, (err) => setAiInsight("Error: " + err));
    } catch (err) {
      setAiInsight("Error: " + err.message);
      setInsightLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <span className="icon-wrap" style={{ fontSize: 20 }}>🔍</span> Class Diagnostic Engine
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>AI-powered insights identifying learning gaps and weak concepts.</p>
        </div>
        <button className="btn-primary no-print" style={{ padding: "10px 20px", fontSize: 13 }} onClick={generateInsights} disabled={insightLoading}>
          <Sparkles size={14} /> {insightLoading ? "Analyzing..." : "Generate AI Insights"}
        </button>
      </div>

      {/* Gap Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 28 }}>
        {[
          { severity: "CRITICAL GAPS", color: "var(--danger)", topic: "Fractions (Multiplication)", desc: "72% class failure on Q4. Primarily calculation errors rather than conceptual." },
          { severity: "MODERATE GAPS", color: "var(--warning)", topic: "Algebraic Identities", desc: "45% failed Q7. Conceptual misunderstanding of (a+b)² formula." },
          { severity: "STRONG CONCEPTS", color: "var(--success)", topic: "Linear Equations", desc: "92% success across Q1, Q2, Q5. Baseline concept mastered." },
        ].map((gap, i) => (
          <div key={i} className={`card animate-fade-in stagger-${i + 1}`} style={{ borderTop: `3px solid ${gap.color}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: gap.color, marginBottom: 6 }}>{gap.severity}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{gap.topic}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{gap.desc}</p>
          </div>
        ))}
      </div>

      {/* Q-wise Failure Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Question-wise Failure Rate</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Q#", "Topic Tested", "Bloom's Level", "Failure Rate", "Error Type"].map(h => (
                  <th key={h} style={{ textAlign: h === "Failure Rate" ? "center" : "left", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUESTIONS.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>{row.q}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13 }}>{row.topic}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-secondary)" }}>{row.level}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: row.color, minWidth: 32 }}>{row.fail}%</span>
                      <div style={{ width: 70, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div className="progress-bar-fill" style={{ width: `${row.fail}%`, background: row.color }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11 }}>{row.err}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Student × Question Heatmap</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-secondary)", fontSize: 11, borderBottom: "1px solid var(--border)" }}>Student</th>
                {HEATMAP_QS.map(q => (
                  <th key={q} style={{ padding: "8px 6px", textAlign: "center", color: "var(--text-secondary)", fontSize: 11, borderBottom: "1px solid var(--border)" }}>{q}</th>
                ))}
                <th style={{ padding: "8px 12px", textAlign: "right", color: "var(--text-secondary)", fontSize: 11, borderBottom: "1px solid var(--border)" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {HEATMAP_STUDENTS.map((name, si) => {
                const total = HEATMAP_QS.reduce((s, _, qi) => s + mockScore(si, qi), 0);
                return (
                  <tr key={si}>
                    <td style={{ padding: "6px 12px", fontWeight: 500, whiteSpace: "nowrap" }}>{name}</td>
                    {HEATMAP_QS.map((_, qi) => {
                      const score = mockScore(si, qi);
                      return (
                        <td key={qi} style={{
                          padding: "6px", textAlign: "center", fontWeight: 600,
                          background: heatColor(score, 10), borderRadius: 4, fontSize: 11,
                          color: score / 10 >= 0.7 ? "var(--success)" : score / 10 >= 0.4 ? "var(--warning)" : "var(--danger)"
                        }}>{score}</td>
                      );
                    })}
                    <td style={{ padding: "6px 12px", textAlign: "right", fontWeight: 700, color: "var(--primary)" }}>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 10, color: "var(--text-secondary)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "rgba(16,185,129,0.25)", borderRadius: 3 }} /> ≥70%</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "rgba(245,158,11,0.2)", borderRadius: 3 }} /> 40-69%</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "rgba(239,68,68,0.2)", borderRadius: 3 }} /> &lt;40%</span>
        </div>
      </div>

      {/* AI Insights */}
      {(aiInsight || insightLoading) && (
        <div className="card animate-fade-in" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "var(--primary)" }}>🤖 AI Diagnostic Insights</h2>
          {insightLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="skeleton skeleton-text" style={{ width: "90%" }} />
              <div className="skeleton skeleton-text" style={{ width: "80%" }} />
              <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            </div>
          ) : (
            <div className="ai-content" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: parseMarkdown(aiInsight) }} />
          )}
        </div>
      )}

      <div style={{ textAlign: "right" }}>
        <Link href="/dashboard/remedial">
          <button className="btn-primary" style={{ padding: "12px 24px", fontSize: 14 }}>
            Generate Remedial Content <ChevronRight size={15} style={{ display: "inline" }} />
          </button>
        </Link>
      </div>
    </div>
  );
}
