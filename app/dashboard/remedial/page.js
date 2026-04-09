"use client";
import { useState } from "react";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { parseMarkdown } from "@/app/utils/markdown";
import { Copy, Printer, Sparkles, Plus } from "lucide-react";

export default function Remedial() {
  const [topics, setTopics] = useState(["Multiplying Fractions"]);
  const [newTopic, setNewTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { aiProvider, ollamaModel, incrementAiUsage, showToast } = useApp();

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics(prev => [...prev, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (t) => setTopics(prev => prev.filter(x => x !== t));

  const generate = async () => {
    setLoading(true);
    setResult("");
    incrementAiUsage();
    try {
      const systemPrompt = `You are EduAI Remedial Engine. Generate remedial content for students who failed to grasp specific concepts. For each topic provide: 1) A simplified real-world analogy 2) Step-by-step breakdown 3) 3 very simple practice questions with answers 4) Blackboard visual description. Use markdown formatting.`;
      const prompt = `Generate remedial teaching content for weak students on these topics:\n${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nFocus on breaking each concept into the simplest form. Target students scoring below 40%.`;
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, systemPrompt, provider: aiProvider, model: ollamaModel }) });
      setLoading(false);
      await consumeStream(res, (text) => setResult(text), null, (err) => setResult("Error: " + err));
    } catch (err) { setResult("Error: " + err.message); setLoading(false); }
  };

  const renderAI = (text) => parseMarkdown(text);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="icon-wrap" style={{ fontSize: 20 }}>💊</span> Remedial Action Plan
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>AI-generated simplified content for students needing extra help.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result || loading ? "360px 1fr" : "1fr", gap: 22 }}>
        <div className="card" style={{ alignSelf: "start" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Configure Remedial</h2>

          {/* AI suggestion */}
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", padding: 14, borderRadius: 12, marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--danger)", marginBottom: 3 }}>AI SUGGESTION</div>
            <div style={{ fontSize: 13 }}>Based on recent test, <strong>Multiplying Fractions</strong> is the weakest topic in VII-A.</div>
          </div>

          {/* Topic list */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Topics to Cover</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {topics.map(t => (
                <span key={t} className="badge badge-warning" style={{ fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }} onClick={() => removeTopic(t)}>
                  {t} <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="input-field"
                style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}
                placeholder="Add topic..."
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTopic()}
              />
              <button className="btn-secondary" style={{ padding: "8px 12px", fontSize: 12 }} onClick={addTopic} disabled={!newTopic.trim()}>
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Suggested topics from diagnosis */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Quick Add from Diagnosis</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Algebraic Identities", "Word Problems", "Decimals", "Geometry Basics"].filter(t => !topics.includes(t)).map(t => (
                <button key={t} style={{
                  padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 500,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s"
                }} onClick={() => setTopics(prev => [...prev, t])}>
                  + {t}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={generate} disabled={loading || topics.length === 0} style={{ width: "100%", justifyContent: "center" }}>
            <Sparkles size={14} /> {loading ? "Generating..." : "Generate Remedial Plan"}
          </button>
        </div>

        {(result || loading) && (
          <div className="card animate-fade-in" style={{ minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 50 }}>
                <div className="animate-float" style={{ fontSize: 44, marginBottom: 14 }}>🧠</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Generating remedial content...</div>
                <div className="skeleton" style={{ width: "60%", height: 6, margin: "0 auto" }} />
              </div>
            ) : result ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700 }}>Remedial Material</h2>
                  <div className="no-print" style={{ display: "flex", gap: 6 }}>
                    <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => { navigator.clipboard.writeText(result); showToast("Copied!"); }}>
                      <Copy size={11} /> Copy
                    </button>
                    <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => window.print()}>
                      <Printer size={11} /> Print
                    </button>
                  </div>
                </div>
                <div className="ai-content" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderAI(result) }} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
