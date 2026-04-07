"use client";

export default function Diagnosis() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🔍 Class Diagnostic Engine</h1>
        <p style={{ color: "var(--text-secondary)" }}>AI-powered insights identifying learning gaps and weak concepts.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ borderTop: "4px solid var(--danger)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--danger)", marginBottom: 8 }}>CRITICAL GAPS</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Fractions (Multiplication)</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>72% of students failed Q4 related to this concept. Primarily calculation errors rather than conceptual.</p>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--warning)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--warning)", marginBottom: 8 }}>MODERATE GAPS</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Algebraic Identities</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>45% of students failed Q7. Signs of conceptual misunderstanding regarding the (a+b)² formula.</p>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--success)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--success)", marginBottom: 8 }}>STRONG CONCEPTS</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Linear Equations</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>92% success rate on Q1, Q2, and Q5. The class has mastered this baseline concept.</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Question-wise Failure Rate Analysis</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(15,23,42,0.5)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)" }}>Q#</th>
                <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)" }}>Topic Tested</th>
                <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)" }}>Bloom&apos;s Level</th>
                <th style={{ textAlign: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)" }}>Failure Rate</th>
                <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)" }}>Primary Error Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { q: "Q4", topic: "Multiplying Fractions", level: "Application", fail: "72%", err: "Calculation Error", color: "var(--danger)" },
                { q: "Q7", topic: "Algebraic Identities", level: "Understanding", fail: "45%", err: "Conceptual Gap", color: "var(--warning)" },
                { q: "Q9", topic: "Word Problems", level: "Analysis", fail: "38%", err: "Comprehension", color: "var(--warning)" },
                { q: "Q2", topic: "Linear Equations", level: "Knowledge", fail: "8%", err: "Careless", color: "var(--success)" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.4)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>{row.q}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14 }}>{row.topic}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, color: "var(--text-secondary)" }}>{row.level}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{row.fail}</span>
                      <div style={{ width: 60, height: 6, background: "rgba(15,23,42,0.8)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: row.fail, height: "100%", background: row.color }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="badge" style={{ background: "rgba(15,23,42,0.5)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>{row.err}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="btn-primary">Generate Remedial Content →</button>
        </div>
      </div>
    </div>
  );
}
