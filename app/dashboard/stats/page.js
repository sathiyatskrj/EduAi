"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Statistics() {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance) chartInstance.destroy();
      const ctx = chartRef.current.getContext("2d");
      
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["0-10", "11-20", "21-30", "31-40", "41-50"],
          datasets: [{
            label: "Number of Students",
            data: [2, 5, 12, 18, 8],
            backgroundColor: "rgba(0, 150, 136, 0.6)",
            borderColor: "rgba(0, 150, 136, 1)",
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.1)" } },
            x: { grid: { display: false } }
          }
        }
      });
    }
    return () => { if (chartInstance) chartInstance.destroy(); };
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>📊 Automated Statistics</h1>
          <p style={{ color: "var(--text-secondary)" }}>Viewing analysis for: VII-A Mathematics — Unit Test 1</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 20px" }}>📄 Export B.Ed Report (PDF)</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Mean (x̄)", value: "34.2", formula: "Σx/N" },
          { label: "Median", value: "35.5", formula: "(N+1)/2 th item" },
          { label: "Mode", value: "38.0", formula: "Most frequent" },
          { label: "Standard Deviation (σ)", value: "8.4", formula: "√(Σ(x-x̄)²/N)" },
          { label: "Quartile Deviation", value: "6.2", formula: "(Q3-Q1)/2" },
          { label: "Coeff. of Variation", value: "24.5%", formula: "(σ/x̄)×100" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.5)", marginTop: 8, fontStyle: "italic" }}>{s.formula}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Score Distribution (Histogram)</h2>
          <div style={{ height: 300 }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Grade Breakdown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { grade: "A+ (90-100%)", count: 4, pct: "8.9%" },
                { grade: "A (80-89%)", count: 8, pct: "17.8%" },
                { grade: "B (60-79%)", count: 18, pct: "40.0%" },
                { grade: "C (40-59%)", count: 12, pct: "26.7%" },
                { grade: "D (Below 40%)", count: 3, pct: "6.7%" },
              ].map((g, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "12px 0", fontSize: 14 }}>{g.grade}</td>
                  <td style={{ padding: "12px 0", fontSize: 14, fontWeight: 600, textAlign: "right" }}>{g.count}</td>
                  <td style={{ padding: "12px 0", fontSize: 13, color: "var(--text-secondary)", textAlign: "right" }}>{g.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
