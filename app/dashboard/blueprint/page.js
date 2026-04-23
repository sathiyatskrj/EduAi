"use client";
import { useState } from "react";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { parseMarkdown } from "@/app/utils/markdown";
import { FileText, Sparkles, Plus, Trash2 } from "lucide-react";

export default function BlueprintMaker() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [totalMarks, setTotalMarks] = useState("50");
  const [duration, setDuration] = useState("2 Hours");
  const [topics, setTopics] = useState([{ name: "", weightage: "20" }]);
  const [aiBlueprint, setAiBlueprint] = useState("");
  const [loading, setLoading] = useState(false);
  const { aiProvider, ollamaModel, incrementAiUsage } = useApp();

  const addTopic = () => {
    setTopics([...topics, { name: "", weightage: "10" }]);
  };

  const removeTopic = (index) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const generateBlueprint = async () => {
    if (!subject || !grade || topics.some(t => !t.name)) return;
    
    setLoading(true);
    setAiBlueprint("");
    incrementAiUsage();
    
    const topicDetails = topics.map(t => `- ${t.name} (${t.weightage}%)`).join("\n");
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "You are an expert Curriculum Designer and Examination Setter. Create a detailed Examination Blueprint / Table of Specifications based on the provided parameters. Create a proper markdown table that maps topics to cognitive domains (Bloom's Taxonomy: Knowledge, Understanding, Application, Analysis/Evaluation). Ensure the total marks accurately reflect the topic weightages and total exam marks.",
          prompt: `Create a Question Paper Blueprint with the following details:\n\nSubject: ${subject}\nGrade/Class: ${grade}\nTotal Marks: ${totalMarks}\nDuration: ${duration}\n\nTopics & Weightage:\n${topicDetails}\n\nPlease generate:\n1. A detailed Blueprint matrix (Topics vs. Bloom's Taxonomy levels) showing mark distribution.\n2. A summary of question types (e.g., MCQ, Short Answer, Long Answer) and their mark values.\n3. Brief guidelines for the paper setter.`,
          provider: aiProvider,
          model: ollamaModel,
        }),
      });
      setLoading(false);
      await consumeStream(res, (text) => setAiBlueprint(text), null, (err) => setAiBlueprint("Error: " + err));
    } catch (err) {
      setAiBlueprint("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <div className="icon-wrap" style={{ background: "rgba(14, 165, 233, 0.15)", color: "#0ea5e9" }}>
            <FileText size={24} />
          </div>
          Exam Blueprint Maker
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          Design structured examination blueprints aligned with Bloom's Taxonomy for balanced assessments.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        {/* Input Form */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Exam Details</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Subject</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Grade/Class</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. 8th Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Total Marks</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="e.g. 50"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Duration</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. 2 Hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, borderTop: "1px solid var(--border)", paddingTop: 20 }}>Syllabus Coverage</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {topics.map((topic, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={`Topic ${i + 1} Name (e.g. Thermodynamics)`}
                    value={topic.name}
                    onChange={(e) => updateTopic(i, 'name', e.target.value)}
                  />
                </div>
                <div style={{ width: 120 }}>
                  <div style={{ position: "relative" }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="Weightage"
                      value={topic.weightage}
                      onChange={(e) => updateTopic(i, 'weightage', e.target.value)}
                      style={{ paddingRight: 30 }}
                    />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>%</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeTopic(i)}
                  disabled={topics.length === 1}
                  style={{ 
                    width: 40, height: 40, borderRadius: 8, border: "none", 
                    background: topics.length === 1 ? "rgba(255,255,255,0.05)" : "rgba(239, 68, 68, 0.1)", 
                    color: topics.length === 1 ? "var(--text-secondary)" : "var(--danger)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: topics.length === 1 ? "not-allowed" : "pointer"
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={addTopic}
            style={{ 
              display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", 
              background: "rgba(255,255,255,0.05)", border: "1px dashed var(--border)", 
              borderRadius: 8, color: "var(--text-secondary)", cursor: "pointer", fontSize: 13
            }}
          >
            <Plus size={16} /> Add Topic
          </button>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <button 
              className="btn-primary" 
              style={{ padding: "12px 24px", fontSize: 14, background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
              onClick={generateBlueprint}
              disabled={loading || !subject || !grade || topics.some(t => !t.name)}
            >
              {loading ? "Generating Blueprint..." : <><Sparkles size={16} /> Generate Exam Blueprint</>}
            </button>
          </div>
        </div>

        {/* AI Output */}
        {(aiBlueprint || loading) && (
          <div className="card animate-fade-in" style={{ borderTop: "4px solid #0ea5e9" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0ea5e9", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={20} /> Generated Blueprint Matrix
            </h2>
            
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="skeleton skeleton-text" style={{ width: "100%", height: 30 }} />
                <div className="skeleton skeleton-text" style={{ width: "100%", height: 200, borderRadius: 8 }} />
                <div className="skeleton skeleton-text" style={{ width: "80%", height: 20 }} />
              </div>
            ) : (
              <div 
                className="ai-content blueprint-table" 
                style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 14 }} 
                dangerouslySetInnerHTML={{ __html: parseMarkdown(aiBlueprint) }} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
