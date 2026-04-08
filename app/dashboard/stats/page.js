"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

// --- Mock Data ---
const SCORES = [12, 18, 22, 25, 28, 29, 31, 33, 34, 35, 35, 36, 38, 38, 38, 39, 40, 40, 41, 42, 42, 43, 44, 45, 45, 46, 47, 48, 48, 49, 50, 50, 50, 32, 27, 19, 37, 41, 44, 46, 30, 23, 36, 39, 43];
const INTERVALS = ["0-10", "11-20", "21-30", "31-40", "41-50"];
const FREQ = [1, 3, 6, 18, 17];
const CUM_FREQ = [1, 4, 10, 28, 45];
const CUM_FREQ_MORE = [45, 44, 41, 35, 17];
const MIDPOINTS = [5, 15.5, 25.5, 35.5, 45.5];

// --- Stat Calculations ---
const N = SCORES.length;
const sorted = [...SCORES].sort((a, b) => a - b);
const sum = SCORES.reduce((a, b) => a + b, 0);
const mean = (sum / N).toFixed(2);
const median = N % 2 === 1 ? sorted[Math.floor(N / 2)].toFixed(1) : ((sorted[N / 2 - 1] + sorted[N / 2]) / 2).toFixed(1);
const mode = (() => { const freq = {}; SCORES.forEach(s => freq[s] = (freq[s] || 0) + 1); return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]; })();
const variance = SCORES.reduce((s, x) => s + Math.pow(x - sum / N, 2), 0) / N;
const sd = Math.sqrt(variance).toFixed(2);
const Q1 = sorted[Math.floor(N * 0.25)];
const Q3 = sorted[Math.floor(N * 0.75)];
const qd = ((Q3 - Q1) / 2).toFixed(2);
const md = (SCORES.reduce((s, x) => s + Math.abs(x - sum / N), 0) / N).toFixed(2);
const cv = ((sd / (sum / N)) * 100).toFixed(1);
const range = (sorted[N - 1] - sorted[0]).toFixed(1);

const CHART_TYPES = [
  { id: "histogram", label: "Histogram", icon: "📊" },
  { id: "polygon", label: "Freq Polygon", icon: "📈" },
  { id: "ogive", label: "Ogive", icon: "📉" },
  { id: "boxplot", label: "Box & Whisker", icon: "📦" },
  { id: "bell", label: "Bell Curve", icon: "🔔" },
];

export default function Statistics() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [activeChart, setActiveChart] = useState("histogram");
  const [showWorking, setShowWorking] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    const gridColor = "rgba(148, 163, 184, 0.1)";
    const primary = "rgba(0, 150, 136, 0.7)";
    const primaryBorder = "rgba(0, 150, 136, 1)";
    const accent = "rgba(0, 188, 212, 0.7)";
    const accentBorder = "rgba(0, 188, 212, 1)";
    const warn = "rgba(245, 158, 11, 0.7)";
    const warnBorder = "rgba(245, 158, 11, 1)";

    let config = {};

    if (activeChart === "histogram") {
      config = {
        type: "bar",
        data: {
          labels: INTERVALS,
          datasets: [{
            label: "Frequency",
            data: FREQ,
            backgroundColor: primary,
            borderColor: primaryBorder,
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 1,
            categoryPercentage: 0.95,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y} students` } } },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "No. of Students (1cm = 2 students)", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } },
            x: { title: { display: true, text: "Marks Range (1cm = 10 marks)", color: "#94A3B8" }, grid: { display: false }, ticks: { color: "#94A3B8" } },
          }
        }
      };
    }

    if (activeChart === "polygon") {
      config = {
        type: "line",
        data: {
          labels: MIDPOINTS.map(m => m.toFixed(1)),
          datasets: [{
            label: "Frequency Polygon",
            data: FREQ,
            borderColor: primaryBorder,
            backgroundColor: "rgba(0, 150, 136, 0.1)",
            fill: true,
            tension: 0.3,
            pointBackgroundColor: primaryBorder,
            pointRadius: 6,
            pointHoverRadius: 9,
            borderWidth: 3,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Frequency", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } },
            x: { title: { display: true, text: "Class Midpoints", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } },
          }
        }
      };
    }

    if (activeChart === "ogive") {
      config = {
        type: "line",
        data: {
          labels: INTERVALS,
          datasets: [
            {
              label: "Less-than Ogive (CF↑)",
              data: CUM_FREQ,
              borderColor: primaryBorder,
              backgroundColor: "rgba(0, 150, 136, 0.08)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: primaryBorder,
              pointRadius: 5,
              borderWidth: 3,
            },
            {
              label: "More-than Ogive (CF↓)",
              data: CUM_FREQ_MORE,
              borderColor: warnBorder,
              backgroundColor: "rgba(245, 158, 11, 0.08)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: warnBorder,
              pointRadius: 5,
              borderWidth: 3,
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: true, labels: { color: "#F1F5F9" } } },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Cumulative Frequency", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } },
            x: { title: { display: true, text: "Marks Range", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } },
          }
        }
      };
    }

    if (activeChart === "boxplot") {
      const min = sorted[0];
      const max = sorted[N - 1];
      config = {
        type: "bar",
        data: {
          labels: ["Class VII-A Distribution"],
          datasets: [
            { label: "Min → Q1", data: [Q1 - min], backgroundColor: "rgba(148, 163, 184, 0.15)", borderColor: "transparent", borderWidth: 0, barPercentage: 0.4, stack: "box" },
            { label: "Q1 → Median", data: [parseFloat(median) - Q1], backgroundColor: primary, borderColor: primaryBorder, borderWidth: 2, barPercentage: 0.4, stack: "box" },
            { label: "Median → Q3", data: [Q3 - parseFloat(median)], backgroundColor: accent, borderColor: accentBorder, borderWidth: 2, barPercentage: 0.4, stack: "box" },
            { label: "Q3 → Max", data: [max - Q3], backgroundColor: "rgba(148, 163, 184, 0.15)", borderColor: "transparent", borderWidth: 0, barPercentage: 0.4, stack: "box" },
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: "#F1F5F9" } },
            tooltip: {
              callbacks: {
                afterTitle: () => `Min: ${min}  |  Q1: ${Q1}  |  Median: ${median}  |  Q3: ${Q3}  |  Max: ${max}`,
              }
            }
          },
          scales: {
            x: { stacked: true, title: { display: true, text: "Marks", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } },
            y: { stacked: true, grid: { display: false }, ticks: { color: "#94A3B8" } },
          }
        }
      };
    }

    if (activeChart === "bell") {
      const mu = sum / N;
      const sig = parseFloat(sd);
      const bellX = [];
      const bellY = [];
      for (let x = mu - 3.5 * sig; x <= mu + 3.5 * sig; x += sig * 0.15) {
        bellX.push(x.toFixed(1));
        bellY.push((1 / (sig * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sig, 2)));
      }
      config = {
        type: "line",
        data: {
          labels: bellX,
          datasets: [{
            label: "Normal Distribution",
            data: bellY,
            borderColor: primaryBorder,
            backgroundColor: "rgba(0, 150, 136, 0.12)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          scales: {
            y: { display: false },
            x: {
              title: { display: true, text: `μ = ${mean}   σ = ${sd}`, color: "#94A3B8" },
              grid: { color: gridColor },
              ticks: { color: "#94A3B8", maxTicksLimit: 10 }
            },
          }
        }
      };
    }

    chartInstanceRef.current = new Chart(ctx, config);
    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
  }, [activeChart]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>📊 Automated Statistics</h1>
          <p style={{ color: "var(--text-secondary)" }}>Viewing analysis for: VII-A Mathematics — Unit Test 1 ({N} students)</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary" style={{ padding: "10px 20px" }} onClick={() => setShowWorking(!showWorking)}>
            {showWorking ? "Hide" : "Show"} Working
          </button>
          <button className="btn-primary" style={{ padding: "10px 20px" }}>📄 Export B.Ed Report (PDF)</button>
        </div>
      </div>

      {/* 10 Stat Measures */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Mean (x̄)", value: mean, formula: "Σx/N" },
          { label: "Median", value: median, formula: "Middle value" },
          { label: "Mode", value: mode, formula: "Most frequent" },
          { label: "Range", value: range, formula: "Max − Min" },
          { label: "Q1", value: Q1, formula: "(N+1)/4 th" },
          { label: "Q3", value: Q3, formula: "3(N+1)/4 th" },
          { label: "QD", value: qd, formula: "(Q3−Q1)/2" },
          { label: "Mean Dev (MD)", value: md, formula: "Σ|x−x̄|/N" },
          { label: "Std Dev (σ)", value: sd, formula: "√(Σ(x−x̄)²/N)" },
          { label: "CV", value: cv + "%", formula: "(σ/x̄)×100" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "rgba(148, 163, 184, 0.5)", marginTop: 6, fontStyle: "italic" }}>{s.formula}</div>
          </div>
        ))}
      </div>

      {/* Step-by-step Working (Toggle) — TRIZ: Comprehensiveness vs Readability */}
      {showWorking && (
        <div className="card animate-fade-in" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--primary)" }}>Step-by-Step Working (B.Ed Format)</h2>
          <div className="ai-content" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <h3>1. Mean (x̄)</h3>
            <p>x̄ = Σx / N = {sum} / {N} = <strong>{mean}</strong></p>
            <h3>2. Median</h3>
            <p>N = {N} (odd). Median = ({N}+1)/2 = {Math.floor(N / 2) + 1}th observation = <strong>{median}</strong></p>
            <h3>3. Standard Deviation (σ)</h3>
            <p>σ = √(Σ(x − x̄)² / N) = √({variance.toFixed(2)}) = <strong>{sd}</strong></p>
            <h3>4. Quartile Deviation</h3>
            <p>Q1 = {Q1}, Q3 = {Q3}. QD = (Q3 − Q1)/2 = ({Q3} − {Q1})/2 = <strong>{qd}</strong></p>
            <h3>5. Coefficient of Variation</h3>
            <p>CV = (σ / x̄) × 100 = ({sd} / {mean}) × 100 = <strong>{cv}%</strong></p>
          </div>
        </div>
      )}

      {/* Chart Type Selector — SCAMPER: Modify/Magnify */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {CHART_TYPES.map(ct => (
          <button
            key={ct.id}
            onClick={() => setActiveChart(ct.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
              background: activeChart === ct.id ? "var(--primary)" : "var(--bg-card)",
              color: activeChart === ct.id ? "white" : "var(--text-secondary)",
              border: activeChart === ct.id ? "1px solid var(--primary)" : "1px solid var(--border)",
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 16 }}>{ct.icon}</span> {ct.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            {CHART_TYPES.find(c => c.id === activeChart)?.icon} {CHART_TYPES.find(c => c.id === activeChart)?.label}
          </h2>
          <div style={{ height: 340 }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Grade Breakdown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { grade: "A+ (90-100%)", count: 4, pct: "8.9%", color: "#10B981" },
                { grade: "A (80-89%)", count: 8, pct: "17.8%", color: "#009688" },
                { grade: "B (60-79%)", count: 18, pct: "40.0%", color: "#00BCD4" },
                { grade: "C (40-59%)", count: 12, pct: "26.7%", color: "#F59E0B" },
                { grade: "D (Below 40%)", count: 3, pct: "6.7%", color: "#EF4444" },
              ].map((g, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "12px 0", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: g.color, display: "inline-block" }}></span>
                    {g.grade}
                  </td>
                  <td style={{ padding: "12px 0", fontSize: 14, fontWeight: 600, textAlign: "right" }}>{g.count}</td>
                  <td style={{ padding: "12px 0", fontSize: 13, color: "var(--text-secondary)", textAlign: "right" }}>{g.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* AI Narrative (SCAMPER Adapt: clinical report style) */}
          <div style={{ marginTop: 20, padding: 16, background: "rgba(0,150,136,0.05)", borderRadius: 12, border: "1px solid rgba(0,150,136,0.15)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 6 }}>AI NARRATIVE</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {N} students appeared. Mean score is {mean} out of 50 ({((mean / 50) * 100).toFixed(0)}%). Standard Deviation is {sd}, indicating
              {parseFloat(cv) > 30 ? " high variability" : parseFloat(cv) > 20 ? " moderate spread" : " consistent performance"} in scores.
              {parseInt(mode) > parseFloat(mean) ? " Mode exceeds mean — positively skewed." : " Distribution is approximately symmetric."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
