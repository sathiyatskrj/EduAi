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

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 20px" }}><span className="icon-wrap" style={{display: "inline-flex", width: 28, height: 28, fontSize: 14, marginRight: 8}}>🌍</span> Localization & Format</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Platform Language</label>
            <select className="input-field"><option>English (IN)</option><option>Hindi (हिन्दी)</option><option>Tamil (தமிழ்)</option></select>
          </div>
          <div>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Board Format standard</label>
            <select className="input-field"><option>CBSE (NCERT)</option><option>State Board</option><option>ICSE</option></select>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 20px" }}><span className="icon-wrap" style={{display: "inline-flex", width: 28, height: 28, fontSize: 14, marginRight: 8}}>🎨</span> Appearance</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <div style={{ padding: 16, border: "2px solid var(--primary)", borderRadius: 12, background: "rgba(0,150,136,0.1)", textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🌙</div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--primary)" }}>Dark Theme</div>
          </div>
          <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-card)", textAlign: "center", cursor: "pointer", opacity: 0.5 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>☀️</div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Light Theme</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginTop: 4 }}>(Coming soon)</div>
          </div>
          <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-card)", textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💻</div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>System Sync</div>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 20px" }}><span className="icon-wrap" style={{display: "inline-flex", width: 28, height: 28, fontSize: 14, marginRight: 8}}>💾</span> Data Management</h2>
        <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid var(--border)", padding: 20, borderRadius: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Export Classroom Data</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Download all student records, test scores, and saved lesson plans.</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "var(--text-sm)" }}>Export CSV</button>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "var(--text-sm)" }}>Export JSON</button>
            </div>
          </div>
        </div>
    </div>
  );
}
