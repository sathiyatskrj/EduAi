"use client";
import { useState } from "react";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { Copy, Sparkles } from "lucide-react";

export default function TeachingAids() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("ppt");
  const [tabContent, setTabContent] = useState({});
  const [tabLoading, setTabLoading] = useState(false);
  const { aiProvider, ollamaModel, incrementAiUsage, showToast } = useApp();

  const TABS = [
    { id: "ppt", label: "PPT Slides", icon: "📊", prompt: "Generate a detailed 8-slide PowerPoint presentation outline" },
    { id: "activities", label: "Activities", icon: "🎲", prompt: "Generate 3 no-tech classroom activities with materials, steps, and duration" },
    { id: "examples", label: "Real-life Examples", icon: "🌍", prompt: "Generate 5 real-life examples and analogies students can relate to" },
    { id: "flashcards", label: "Flashcards", icon: "🗂️", prompt: "Generate 6 Q&A flashcard pairs for quick revision" },
    { id: "story", label: "Story / Hook", icon: "📖", prompt: "Generate an engaging 2-paragraph story hook to start the lesson" },
    { id: "blackboard", label: "Blackboard", icon: "🖍️", prompt: "Generate a 3-panel blackboard layout plan (Left: Previous Knowledge, Center: Core Concept, Right: Evaluation)" },
  ];

  const generateForTab = async (tabId) => {
    const tab = TABS.find(t => t.id === tabId);
    if (!tab || tabContent[tabId]) return;
    setTabLoading(true);
    incrementAiUsage();
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: `You are EduAI Teaching Aid Generator. Generate clear, practical, classroom-ready teaching resources. Use markdown formatting.`,
          prompt: `${tab.prompt} for the topic: "${topic}". Make it practical for an Indian classroom setting.`,
          provider: aiProvider,
          model: ollamaModel,
        }),
      });
      setTabLoading(false);
      await consumeStream(
        res,
        (text) => setTabContent(prev => ({ ...prev, [tabId]: text })),
        null,
        (err) => setTabContent(prev => ({ ...prev, [tabId]: "Error: " + err }))
      );
    } catch (err) {
      setTabContent(prev => ({ ...prev, [tabId]: "Error: " + err.message }));
      setTabLoading(false);
    }
  };

  const startGeneration = async () => {
    if (!topic) return;
    setLoading(true);
    setTabContent({});
    incrementAiUsage();
    // Generate the first tab (PPT) to start
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: `You are EduAI Teaching Aid Generator. Generate clear, practical, classroom-ready resources. Use markdown formatting.`,
          prompt: `Generate a detailed 8-slide PowerPoint presentation outline for the topic: "${topic}". Include slide titles, bullet points, and visual suggestions. Make it practical for an Indian classroom.`,
          provider: aiProvider,
          model: ollamaModel,
        }),
      });
      setLoading(false);
      setGenerated(true);
      setActiveTab("ppt");
      await consumeStream(
        res,
        (text) => setTabContent(prev => ({ ...prev, ppt: text })),
        null,
        (err) => setTabContent(prev => ({ ...prev, ppt: "Error: " + err }))
      );
    } catch (err) {
      setTabContent(prev => ({ ...prev, ppt: "Error: " + err.message }));
      setLoading(false);
      setGenerated(true);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (!tabContent[tabId]) {
      generateForTab(tabId);
    }
  };

  const renderAI = (text) => text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\n/g, "<br/>");

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="icon-wrap" style={{ fontSize: 20 }}>🎨</span> Teaching Aid Generator
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Generate complete resource packs from a single topic using AI.</p>
      </div>

      {/* Input */}
      {!generated && !loading && (
        <div className="card animate-scale-in" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>What are we teaching today?</h2>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Topic Name</label>
            <input
              type="text" className="input-field"
              placeholder="e.g., Photosynthesis, Laws of Motion, Fractions..."
              value={topic} onChange={(e) => setTopic(e.target.value)}
              style={{ fontSize: 15, padding: "14px 18px" }}
            />
          </div>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }} onClick={startGeneration} disabled={!topic}>
            <Sparkles size={16} /> Generate Complete Resource Pack
          </button>
        </div>
      )}

      {loading && (
        <div className="card animate-fade-in" style={{ maxWidth: 600, textAlign: "center", padding: "50px 36px" }}>
          <div className="animate-float" style={{ fontSize: 56, marginBottom: 20 }}>🧠</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Crafting Resources for &quot;{topic}&quot;</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Generating PPT, activities, flashcards...</p>
          <div className="skeleton" style={{ height: 5, width: "100%", borderRadius: 6 }} />
        </div>
      )}

      {generated && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: 6, display: "inline-block" }}>AI Generated</span>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Resource Pack: {topic}</h2>
            </div>
            <button className="btn-secondary no-print" onClick={() => { setGenerated(false); setTopic(""); setTabContent({}); }}>← New Topic</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 14, marginBottom: 20 }}>
            {TABS.map(tab => (
              <button
                key={tab.id} onClick={() => handleTabClick(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                  background: activeTab === tab.id ? "var(--primary)" : "rgba(255,255,255,0.04)",
                  color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                  border: activeTab === tab.id ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span> {tab.label}
                {tabContent[tab.id] && <span style={{ fontSize: 9, marginLeft: 2 }}>✓</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="card animate-fade-in" style={{ minHeight: 300 }}>
            {tabLoading && !tabContent[activeTab] ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div className="animate-float" style={{ fontSize: 40, marginBottom: 12 }}>{TABS.find(t => t.id === activeTab)?.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Generating {TABS.find(t => t.id === activeTab)?.label}...</div>
                <div className="skeleton" style={{ width: "50%", height: 5, margin: "0 auto" }} />
              </div>
            ) : tabContent[activeTab] ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>{TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}</h3>
                  <button className="btn-secondary no-print" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => { navigator.clipboard.writeText(tabContent[activeTab]); showToast("Copied!"); }}>
                    <Copy size={11} /> Copy
                  </button>
                </div>
                <div className="ai-content" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderAI(tabContent[activeTab]) }} />
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{TABS.find(t => t.id === activeTab)?.icon}</div>
                <p>Click to generate {TABS.find(t => t.id === activeTab)?.label} content</p>
                <button className="btn-primary" style={{ marginTop: 12, padding: "10px 20px", fontSize: 13 }} onClick={() => generateForTab(activeTab)}>
                  <Sparkles size={13} /> Generate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
