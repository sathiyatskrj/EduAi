"use client";
import { useState } from "react";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { parseMarkdown } from "@/app/utils/markdown";
import { Brain, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

const BEHAVIORAL_SIGNS = [
  { id: "reading", label: "Struggles with reading fluency or comprehension", category: "Academic" },
  { id: "math", label: "Difficulty understanding numbers or math facts", category: "Academic" },
  { id: "writing", label: "Poor handwriting or difficulty organizing thoughts on paper", category: "Academic" },
  { id: "focus", label: "Easily distracted, frequent daydreaming", category: "Attention" },
  { id: "hyperactive", label: "Restless, fidgety, cannot stay seated", category: "Attention" },
  { id: "instructions", label: "Difficulty following multi-step instructions", category: "Cognitive" },
  { id: "eye_contact", label: "Avoids eye contact during conversations", category: "Social" },
  { id: "routines", label: "Distressed by changes in routine", category: "Behavioral" },
  { id: "sensory", label: "Sensitive to loud noises, bright lights, or certain textures", category: "Behavioral" },
  { id: "social", label: "Struggles to interpret social cues or make friends", category: "Social" },
];

export default function Psychoanalysis() {
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSigns, setSelectedSigns] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const { aiProvider, ollamaModel, incrementAiUsage } = useApp();

  const toggleSign = (id) => {
    setSelectedSigns(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (!studentName || selectedSigns.length === 0) return;
    
    setLoading(true);
    setAiAnalysis("");
    incrementAiUsage();
    
    const selectedLabels = BEHAVIORAL_SIGNS.filter(s => selectedSigns.includes(s.id)).map(s => s.label);
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "You are an expert Educational Psychologist and Special Education Assistant. Based on the teacher's behavioral observations, analyze the possibility of learning disabilities (e.g., Dyslexia, Dyscalculia, Dysgraphia), neurodevelopmental disorders (e.g., ADHD, Autism Spectrum Disorder), or other cognitive/social challenges. Provide a compassionate, professional analysis. Give specific classroom accommodation strategies. ALWAYS include a prominent disclaimer that this is an AI screening tool, not a clinical diagnosis, and recommend evaluation by a qualified medical professional.",
          prompt: `Analyze the following student profile:\n\nStudent Name: ${studentName}\nAge: ${age || "Not specified"}\n\nObserved Behaviors:\n- ${selectedLabels.join("\n- ")}\n\nAdditional Teacher Notes:\n${notes || "None"}\n\nPlease provide: 1) Potential indications (what these signs might point to), 2) Suggested classroom accommodations, 3) Recommended next steps for the school and parents.`,
          provider: aiProvider,
          model: ollamaModel,
        }),
      });
      setLoading(false);
      await consumeStream(res, (text) => setAiAnalysis(text), null, (err) => setAiAnalysis("Error: " + err));
    } catch (err) {
      setAiAnalysis("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <div className="icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            <Brain size={24} />
          </div>
          Psychoanalysis & Disability Screening
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          AI-assisted tool to identify potential learning disabilities, neurodivergence, and behavioral patterns to provide better classroom support.
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
        {/* Input Form */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Student Profile</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Student Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. John Doe"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Age / Grade</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. 10 yrs, 5th Grade"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, borderTop: "1px solid var(--border)", paddingTop: 16 }}>Behavioral Observations</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Select all behaviors consistently observed in the classroom setting:</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {BEHAVIORAL_SIGNS.map(sign => {
              const isSelected = selectedSigns.includes(sign.id);
              return (
                <div 
                  key={sign.id}
                  onClick={() => toggleSign(sign.id)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                    background: isSelected ? "rgba(0,150,136,0.05)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {isSelected ? <CheckCircle2 size={16} color="var(--primary)" /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid var(--text-secondary)" }} />}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{sign.label}</div>
                </div>
              )
            })}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Additional Notes / Specific Incidents</label>
            <textarea 
              className="input-field" 
              placeholder="Describe any other specific challenges or patterns you've noticed..."
              style={{ minHeight: 100, resize: "vertical" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button 
              className="btn-primary" 
              style={{ padding: "12px 24px", fontSize: 14, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}
              onClick={handleAnalyze}
              disabled={loading || !studentName || selectedSigns.length === 0}
            >
              {loading ? "Analyzing..." : <><Sparkles size={16} /> Analyze Behavioral Profile</>}
            </button>
          </div>
        </div>

        {/* AI Output */}
        {(aiAnalysis || loading) && (
          <div className="card animate-fade-in" style={{ borderTop: "4px solid #8b5cf6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Brain size={20} color="#8b5cf6" />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#8b5cf6" }}>Psychological Analysis</h2>
            </div>
            
            <div style={{ 
              background: "rgba(245, 158, 11, 0.1)", 
              border: "1px solid rgba(245, 158, 11, 0.3)", 
              padding: "12px 16px", 
              borderRadius: 8, 
              display: "flex", 
              gap: 12,
              marginBottom: 20
            }}>
              <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
                <strong style={{ color: "#f59e0b" }}>Disclaimer:</strong> This is an AI-generated preliminary screening tool based on observational data. It does <strong>not</strong> provide a medical or clinical diagnosis. Always consult a qualified child psychologist or medical professional for accurate diagnosis and intervention planning.
              </div>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="skeleton skeleton-text" style={{ width: "100%", height: 20 }} />
                <div className="skeleton skeleton-text" style={{ width: "90%", height: 20 }} />
                <div className="skeleton skeleton-text" style={{ width: "95%", height: 20 }} />
                <div className="skeleton skeleton-text" style={{ width: "70%", height: 20 }} />
              </div>
            ) : (
              <div 
                className="ai-content" 
                style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 15 }} 
                dangerouslySetInnerHTML={{ __html: parseMarkdown(aiAnalysis) }} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
