"use client";
import { useState } from "react";

export default function TeachingAids() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("ppt");

  const generateAids = () => {
    if (!topic) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2500); // Simulate API latency
  };

  const TABS = [
    { id: "ppt", label: "PPT Slides", icon: "📊" },
    { id: "activities", label: "Activities", icon: "🎲" },
    { id: "examples", label: "Real-life Examples", icon: "🌍" },
    { id: "flashcards", label: "Flashcards", icon: "🗂️" },
    { id: "story", label: "Story / Hook", icon: "📖" },
    { id: "blackboard", label: "Blackboard Work", icon: "🖍️" },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🎨 Teaching Aid Generator</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Generate complete resource packs from a single topic in 30 seconds.</p>
      </div>

      {!generated && !loading && (
        <div className="card" style={{ maxWidth: 640 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>What are we teaching today?</h2>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Topic Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., Photosynthesis, Laws of Motion, Fractions..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ fontSize: 16, padding: "16px 20px" }}
            />
          </div>
          <button 
            className="btn-primary w-full" 
            style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16 }}
            onClick={generateAids}
            disabled={!topic}
          >
            ✨ Generate Complete Resource Pack
          </button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ maxWidth: 640, textAlign: "center", padding: "60px 40px" }}>
          <div className="animate-float" style={{ fontSize: 64, marginBottom: 24 }}>🧠</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Crafting Resources for "{topic}"</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Compiling PPTs, stories, and activities...</p>
          <div className="loading-shimmer" style={{ height: 6, width: "100%", borderRadius: 6 }}></div>
        </div>
      )}

      {generated && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: 8 }}>Ready</span>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Resource Pack: {topic}</h2>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-secondary" onClick={() => { setGenerated(false); setTopic(""); }}>← New Topic</button>
              <button className="btn-primary">⬇ Download ZIP</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16, marginBottom: 24 }}>
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
                  background: activeTab === tab.id ? "var(--primary)" : "var(--bg-card)",
                  color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                  border: activeTab === tab.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Renderers using mock data arrays */}
          <div className="card animate-fade-in" style={{ minHeight: 400 }}>
            {activeTab === "ppt" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Presentation Outline (8 Slides)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {["Title: Introduction to " + topic, "Objective: What we will learn", "Concept Explanation", "Key Examples", "Interactive Activity", "Practice Questions", "Summary & Recap", "Homework Assignment"].map((slide, index) => (
                    <div key={index} style={{ padding: 20, background: "rgba(15,23,42,0.4)", borderRadius: 12, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700, marginBottom: 8 }}>SLIDE {index + 1}</div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{slide}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>• Bullet point content regarding {topic}...<br/>• Supporting visual suggestion: diagram of process.</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Classroom Activities (No Tech Required)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ padding: 24, background: "rgba(15,23,42,0.4)", borderRadius: 12, border: "1px left solid var(--primary)", borderLeftWidth: 4 }}>
                      <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Activity {i}: The {topic} Challenge</h4>
                      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}><strong>Materials:</strong> Paper, pencils, stopwatch</p>
                      <ul style={{ color: "var(--text-secondary)", fontSize: 14, paddingLeft: 20 }}>
                        <li style={{ marginBottom: 4 }}>Divide class into groups of 4.</li>
                        <li style={{ marginBottom: 4 }}>Give them a problem related to {topic}.</li>
                        <li>First group to correctly identify the core principle wins.</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "examples" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Real-life Connections</h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <li key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px", background: "rgba(15,23,42,0.4)", borderRadius: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,150,136,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{i}</div>
                      <div style={{ color: "var(--text-primary)", fontSize: 15 }}>How {topic} is used when a chef measures ingredients in a kitchen.</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "flashcards" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                   <h3 style={{ fontSize: 18, fontWeight: 700 }}>Printable Flashcards</h3>
                   <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}>⎙ Print Layout</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "var(--border)", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: 24, background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 120 }}>
                        <strong>Q: What is the main definition of {topic}?</strong>
                      </div>
                      <div style={{ padding: 24, background: "rgba(0,150,136,0.05)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 120 }}>
                        <span style={{ color: "var(--primary)" }}>A: It is the fundamental concept of...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "story" && (
              <div style={{ maxWidth: 800 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Lesson Hook: The Narrative</h3>
                <div style={{ padding: 32, background: "rgba(15,23,42,0.6)", borderRadius: 16, fontStyle: "italic", fontSize: 16, lineHeight: 1.8, color: "var(--text-primary)", position: "relative" }}>
                  <span style={{ position: "absolute", top: 10, left: 10, fontSize: 40, color: "var(--border)" }}>"</span>
                  Imagine you are walking down a busy street in ancient Rome. You need to divide the remaining food among the citizens, but how do you measure it accurately? This was the exact problem that led to the discovery of <strong>{topic}</strong>. <br/><br/>
                  By understanding how the universe naturally seeks balance, we can apply {topic} not just in equations, but in understanding how the world around us functions every single day!
                  <span style={{ position: "absolute", bottom: -10, right: 20, fontSize: 40, color: "var(--border)" }}>"</span>
                </div>
                <button className="btn-secondary" style={{ marginTop: 20 }}>Copy Story</button>
              </div>
            )}

            {activeTab === "blackboard" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Blackboard Architecture</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: 24, background: "#1a362a", borderRadius: 16, minHeight: 300, border: "8px solid #3e2723" }}>
                   <div style={{ color: "#e0f2f1", fontFamily: "monospace", borderRight: "1px dashed #4db6ac", paddingRight: 16 }}>
                     <strong>[Left Panel: Previous Knowledge]</strong><br/><br/>
                     - Definition A<br/>
                     - Recall Quiz (3 mins)
                   </div>
                   <div style={{ color: "#e0f2f1", fontFamily: "monospace", borderRight: "1px dashed #4db6ac", padding: "0 16px" }}>
                     <strong>[Center Panel: Core Idea]</strong><br/><br/>
                     <div style={{ textAlign: "center", fontSize: 24, marginBottom: 16 }}>{topic.toUpperCase()}</div>
                     (Draw large flow chart mapping Concept -{">"} Formula)
                   </div>
                   <div style={{ color: "#e0f2f1", fontFamily: "monospace", paddingLeft: 16 }}>
                     <strong>[Right Panel: Evaluation]</strong><br/><br/>
                     1. Solve x = y + 2<br/>
                     2. define terms.<br/>
                     <br/>
                     *Homework:* Pg 42, Q1-5
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
