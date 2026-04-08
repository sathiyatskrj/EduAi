"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-dark)" }}>
      {/* Hero */}
      <nav className="glass" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white" }}>E</div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>EduAI</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/onboarding" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Get Started Free →</Link>
        </div>
      </nav>

      <section style={{ paddingTop: 160, paddingBottom: 100, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,150,136,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <div className="animate-fade-in" style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="badge badge-info" style={{ marginBottom: 20, padding: "6px 16px", fontSize: 13 }}>🚀 AI-Powered Teacher Platform</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            <span style={{ background: "var(--gradient-1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Transform</span> Your Teaching with AI Intelligence
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Automate lesson planning, test creation, statistical analysis & remedial teaching. What takes 3 weeks manually — done in 3 hours on EduAI.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/onboarding" className="btn-primary" style={{ padding: "16px 36px", fontSize: 17 }}>Start Free — No Login Needed</Link>
            <button className="btn-secondary" style={{ padding: "16px 36px", fontSize: 17 }}>Watch Demo</button>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 16 }}>The Problem We Solve</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 48, fontSize: 16 }}>Teachers spend 60+ hours on manual work that AI can do in minutes.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { task: "Writing 1 Lesson Plan", manual: "3–4 hours", ai: "60 seconds", icon: "📝" },
            { task: "Statistical Analysis", manual: "5–6 hours", ai: "2 minutes", icon: "📊" },
            { task: "B.Ed Internship Notebook", manual: "3 weeks, 100+ pages", ai: "3 hours", icon: "📓" },
            { task: "Test Paper with Blueprint", manual: "2–3 hours", ai: "90 seconds", icon: "🧪" },
            { task: "Diagnosis of Weak Students", manual: "Guesswork", ai: "Automated, per-question", icon: "🔍" },
            { task: "Remedial Content", manual: "2–3 hours per student", ai: "Instant AI generation", icon: "💊" },
          ].map((item, i) => (
            <div key={i} className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 40 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.task}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                  <span className="badge badge-danger">Manual: {item.manual}</span>
                  <span className="badge badge-success">EduAI: {item.ai}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 40px", background: "rgba(0,150,136,0.03)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 48 }}>Everything a Teacher Needs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { icon: "📚", title: "AI Lesson Plans", desc: "NCERT-aligned plans with SIOs, teaching steps, blackboard work & evaluation." },
              { icon: "🧪", title: "Test Generator", desc: "Blueprint-based papers with Bloom's taxonomy, answer keys & marking schemes." },
              { icon: "📊", title: "Statistics Engine", desc: "Mean, Median, Mode, SD, Histograms, Ogives — all auto-calculated." },
              { icon: "🔍", title: "Diagnostic Engine", desc: "Per-question failure analysis, concept heatmaps & learning gap detection." },
              { icon: "💊", title: "Remedial Engine", desc: "Auto-generated exercises, analogies & practice sets for weak students." },
              { icon: "📄", title: "PDF Export", desc: "B.Ed notebook format — ready for college submission with step-by-step working." },
            ].map((f, i) => (
              <div key={i} className="card" style={{ textAlign: "center" }}>
                <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>{f.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>For Teachers. By Teachers.</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, marginBottom: 40 }}>Join 10 lakh+ B.Ed interns transforming education with AI.</p>
        <Link href="/onboarding" className="btn-primary animate-pulse-glow" style={{ padding: "18px 48px", fontSize: 18 }}>Launch EduAI Dashboard →</Link>
      </section>

      <footer style={{ padding: "40px", textAlign: "center", borderTop: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 14 }}>
        © 2026 EduAI — AI-Powered Teacher Training Platform | Confidential
      </footer>
    </div>
  );
}
