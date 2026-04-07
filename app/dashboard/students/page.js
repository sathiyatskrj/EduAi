"use client";

export default function Students() {
  const students = [
    { name: "Aarav Sharma", id: "S001", cls: "VII-A", perf: 85, trend: "up", status: "Good" },
    { name: "Avni Patel", id: "S002", cls: "VII-A", perf: 92, trend: "up", status: "Excellent" },
    { name: "Dhruv Singh", id: "S003", cls: "VII-A", perf: 64, trend: "down", status: "Average" },
    { name: "Diya Reddy", id: "S004", cls: "VII-A", perf: 38, trend: "down", status: "Needs Help" },
    { name: "Ishaan Kumar", id: "S005", cls: "VII-A", perf: 78, trend: "flat", status: "Good" },
    { name: "Kavya Gupta", id: "S006", cls: "VII-A", perf: 42, trend: "down", status: "Needs Help" },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>👤 Student Profiles</h1>
          <p style={{ color: "var(--text-secondary)" }}>Individual performance tracking and diagnostic cards.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <input type="text" placeholder="Search student..." className="input-field" style={{ width: 250, padding: "10px 16px" }} />
          <button className="btn-primary" style={{ padding: "10px 20px" }}>+ Add Student</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {students.map((s, i) => (
          <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,150,136,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.id} • {s.cls}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.perf < 50 ? "var(--danger)" : s.perf > 80 ? "var(--success)" : "var(--primary)" }}>{s.perf}%</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Avg Score</div>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.5)", padding: "10px 14px", borderRadius: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Status</span>
              <span className={`badge badge-${s.perf < 50 ? "danger" : s.perf > 80 ? "success" : "info"}`}>{s.status}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-secondary" style={{ flex: 1, padding: "8px", fontSize: 13 }}>View Card</button>
              {s.perf < 50 && <button className="btn-primary" style={{ flex: 1, padding: "8px", fontSize: 13, background: "var(--danger)", boxShadow: "none" }}>Remedial</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
