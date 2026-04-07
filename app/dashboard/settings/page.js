"use client";

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>⚙️ Settings</h1>
        <p style={{ color: "var(--text-secondary)" }}>Configure your EduAI experience.</p>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>API Configuration</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
          EduAI supports multiple free AI models. Set your API keys below (requires server restart in local dev, but you can configure in .env.local).
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid var(--border)", padding: 20, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Groq (Llama 3.3 70B)</div>
              <span className="badge badge-success">Recommended (Fast & Free)</span>
            </div>
            <input type="password" placeholder="gsk_..." className="input-field" style={{ marginBottom: 12 }} disabled value="Loaded from .env.local" />
            <a href="https://console.groq.com/" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none" }}>Get Groq API Key ↗</a>
          </div>

          <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid var(--border)", padding: 20, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Google Gemini 2.0 Flash</div>
              <span className="badge badge-info">Free Tier</span>
            </div>
            <input type="password" placeholder="AIza..." className="input-field" style={{ marginBottom: 12 }} disabled value="Loaded from .env.local" />
            <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none" }}>Get Gemini API Key ↗</a>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 20px" }}>Preferences</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Default Board Format</label>
            <select className="input-field"><option>CBSE (NCERT)</option><option>State Board</option></select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Export Format</label>
            <select className="input-field"><option>PDF (B.Ed Notebook Standard)</option><option>Word Document (.docx)</option></select>
          </div>
        </div>
      </div>
    </div>
  );
}
