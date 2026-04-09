"use client";
import { useState, useEffect, useRef } from "react";
import { exportToPDF } from "@/app/utils/exports";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { Download, BookOpen } from "lucide-react";
import Chart from "chart.js/auto";

// --- Mock Data ---
const SCORES = [12, 18, 22, 25, 28, 29, 31, 33, 34, 35, 35, 36, 38, 38, 38, 39, 40, 40, 41, 42, 42, 43, 44, 45, 45, 46, 47, 48, 48, 49, 50, 50, 50, 32, 27, 19, 37, 41, 44, 46, 30, 23, 36, 39, 43];
const INTERVALS = ["0-10", "11-20", "21-30", "31-40", "41-50"];
const FREQ = [1, 3, 6, 18, 17];
const CUM_FREQ = [1, 4, 10, 28, 45];
const CUM_FREQ_MORE = [45, 44, 41, 35, 17];
const MIDPOINTS = [5, 15.5, 25.5, 35.5, 45.5];

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

// Animated counter
function AnimatedStat({ value, label, formula }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const num = parseFloat(value);
    const suffix = value.replace(/[0-9.-]/g, "");
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const step = num / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start.toFixed(num % 1 ? 2 : 0) + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)" }}>{display}</div>
      <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)", marginTop: 5, fontStyle: "italic" }}>{formula}</div>
    </div>
  );
}

export default function Statistics() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [activeChart, setActiveChart] = useState("histogram");
  const [showWorking, setShowWorking] = useState(false);
  const [narrative, setNarrative] = useState("");
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const { aiProvider, ollamaModel, incrementAiUsage, showToast } = useApp();

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    const ctx = chartRef.current.getContext("2d");
    const gridColor = "rgba(148, 163, 184, 0.1)";
    const primary = "rgba(0, 150, 136, 0.7)";
    const primaryBorder = "rgba(0, 150, 136, 1)";
    const accent = "rgba(0, 188, 212, 0.7)";
    const accentBorder = "rgba(0, 188, 212, 1)";
    const warnBorder = "rgba(245, 158, 11, 1)";
    let config = {};
    if (activeChart === "histogram") {
      config = { type: "bar", data: { labels: INTERVALS, datasets: [{ label: "Frequency", data: FREQ, backgroundColor: primary, borderColor: primaryBorder, borderWidth: 1, borderRadius: 6, barPercentage: 1, categoryPercentage: 0.95 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: "Students", color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8" } }, x: { title: { display: true, text: "Marks Range", color: "#94A3B8" }, grid: { display: false }, ticks: { color: "#94A3B8" } } } } };
    }
    if (activeChart === "polygon") {
      config = { type: "line", data: { labels: MIDPOINTS.map(m => m.toFixed(1)), datasets: [{ label: "Freq Polygon", data: FREQ, borderColor: primaryBorder, backgroundColor: "rgba(0,150,136,0.1)", fill: true, tension: 0.3, pointBackgroundColor: primaryBorder, pointRadius: 5, borderWidth: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: "#94A3B8" } }, x: { grid: { color: gridColor }, ticks: { color: "#94A3B8" } } } } };
    }
    if (activeChart === "ogive") {
      config = { type: "line", data: { labels: INTERVALS, datasets: [{ label: "Less-than CF↑", data: CUM_FREQ, borderColor: primaryBorder, backgroundColor: "rgba(0,150,136,0.08)", fill: true, tension: 0.4, pointRadius: 5, borderWidth: 3 }, { label: "More-than CF↓", data: CUM_FREQ_MORE, borderColor: warnBorder, backgroundColor: "rgba(245,158,11,0.08)", fill: true, tension: 0.4, pointRadius: 5, borderWidth: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#F1F5F9" } } }, scales: { y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: "#94A3B8" } }, x: { grid: { color: gridColor }, ticks: { color: "#94A3B8" } } } } };
    }
    if (activeChart === "boxplot") {
      const min = sorted[0], max = sorted[N - 1];
      config = { type: "bar", data: { labels: ["VII-A Distribution"], datasets: [{ label: "Min→Q1", data: [Q1 - min], backgroundColor: "rgba(148,163,184,0.15)", borderColor: "transparent", barPercentage: 0.4, stack: "box" }, { label: "Q1→Median", data: [parseFloat(median) - Q1], backgroundColor: primary, borderColor: primaryBorder, borderWidth: 2, barPercentage: 0.4, stack: "box" }, { label: "Median→Q3", data: [Q3 - parseFloat(median)], backgroundColor: accent, borderColor: accentBorder, borderWidth: 2, barPercentage: 0.4, stack: "box" }, { label: "Q3→Max", data: [max - Q3], backgroundColor: "rgba(148,163,184,0.15)", borderColor: "transparent", barPercentage: 0.4, stack: "box" }] }, options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#F1F5F9" } } }, scales: { x: { stacked: true, grid: { color: gridColor }, ticks: { color: "#94A3B8" } }, y: { stacked: true, grid: { display: false }, ticks: { color: "#94A3B8" } } } } };
    }
    if (activeChart === "bell") {
      const mu = sum / N, sig = parseFloat(sd);
      const bellX = [], bellY = [];
      for (let x = mu - 3.5 * sig; x <= mu + 3.5 * sig; x += sig * 0.15) {
        bellX.push(x.toFixed(1));
        bellY.push((1 / (sig * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sig, 2)));
      }
      config = { type: "line", data: { labels: bellX, datasets: [{ data: bellY, borderColor: primaryBorder, backgroundColor: "rgba(0,150,136,0.12)", fill: true, tension: 0.4, pointRadius: 0, borderWidth: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { y: { display: false }, x: { title: { display: true, text: `μ=${mean}  σ=${sd}`, color: "#94A3B8" }, grid: { color: gridColor }, ticks: { color: "#94A3B8", maxTicksLimit: 10 } } } } };
    }
    chartInstanceRef.current = new Chart(ctx, config);
    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
  }, [activeChart]);

  const downloadChartPNG = () => {
    if (!chartRef.current) return;
    const link = document.createElement("a");
    link.download = `eduai-${activeChart}-chart.png`;
    link.href = chartRef.current.toDataURL("image/png");
    link.click();
    showToast("Chart downloaded as PNG");
  };

  const generateNarrative = async () => {
    setNarrativeLoading(true);
    setNarrative("");
    incrementAiUsage();
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "You are EduAI assistant. Write a clear, teacher-friendly narrative analysis of the stats data. Be concise (3-4 paragraphs). Identify key insights, suggest action items.",
          prompt: `Analyze these class stats for VII-A Mathematics Unit Test 1 (${N} students, max 50 marks):\nMean=${mean}, Median=${median}, Mode=${mode}, SD=${sd}, Range=${range}, Q1=${Q1}, Q3=${Q3}, QD=${qd}, MeanDev=${md}, CV=${cv}%.\n\nGrade breakdown: A+ (90-100%): 4, A (80-89%): 8, B (60-79%): 18, C (40-59%): 12, D (<40%): 3.\n\nProvide insights and recommendations.`,
          provider: aiProvider,
          model: ollamaModel,
        }),
      });
      setNarrativeLoading(false);
      await consumeStream(res, (text) => setNarrative(text), null, (err) => setNarrative("Error: " + err));
    } catch (err) {
      setNarrative("Error: " + err.message);
      setNarrativeLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <span className="icon-wrap" style={{ fontSize: 20 }}>📊</span> Automated Statistics
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>VII-A Mathematics — Unit Test 1 ({N} students)</p>
        </div>
        <div className="no-print" style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setShowWorking(!showWorking)}>
            {showWorking ? "Hide" : "Show"} Working
          </button>
          <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => exportToPDF("B-Ed-Report.pdf", "EduAI B.Ed Statistics Report", `Mean: ${mean}\nMedian: ${median}\nMode: ${mode}\nSD: ${sd}\nRange: ${range}`)}>
            📄 Export Report
          </button>
        </div>
      </div>

      {/* 10 Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Mean (x̄)", value: mean, formula: "Σx/N" },
          { label: "Median", value: median, formula: "Middle value" },
          { label: "Mode", value: mode, formula: "Most frequent" },
          { label: "Range", value: range, formula: "Max − Min" },
          { label: "Q1", value: String(Q1), formula: "(N+1)/4 th" },
          { label: "Q3", value: String(Q3), formula: "3(N+1)/4 th" },
          { label: "QD", value: qd, formula: "(Q3−Q1)/2" },
          { label: "Mean Dev", value: md, formula: "Σ|x−x̄|/N" },
          { label: "Std Dev (σ)", value: sd, formula: "√(Σ(x−x̄)²/N)" },
          { label: "CV", value: cv + "%", formula: "(σ/x̄)×100" },
        ].map((s, i) => <AnimatedStat key={i} {...s} />)}
      </div>

      {/* Working */}
      {showWorking && (
        <div className="card animate-fade-in" style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--primary)" }}>Step-by-Step Working (B.Ed Format)</h2>
          <div className="ai-content" style={{ fontSize: 13, lineHeight: 1.8 }}>
            <h3>1. Mean (x̄)</h3><p>x̄ = Σx / N = {sum} / {N} = <strong>{mean}</strong></p>
            <h3>2. Median</h3><p>N = {N}. Median = {Math.floor(N / 2) + 1}th value = <strong>{median}</strong></p>
            <h3>3. Standard Deviation</h3><p>σ = √(Σ(x−x̄)²/N) = √({variance.toFixed(2)}) = <strong>{sd}</strong></p>
            <h3>4. Quartile Deviation</h3><p>Q1={Q1}, Q3={Q3}. QD = ({Q3}−{Q1})/2 = <strong>{qd}</strong></p>
            <h3>5. CV</h3><p>CV = ({sd}/{mean})×100 = <strong>{cv}%</strong></p>
          </div>
        </div>
      )}

      {/* Chart Tabs */}
      <div className="no-print" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
        {CHART_TYPES.map(ct => (
          <button key={ct.id} onClick={() => setActiveChart(ct.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
            background: activeChart === ct.id ? "var(--primary)" : "rgba(255,255,255,0.04)",
            color: activeChart === ct.id ? "white" : "var(--text-secondary)",
            border: activeChart === ct.id ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s"
          }}>
            <span style={{ fontSize: 15 }}>{ct.icon}</span> {ct.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>
              {CHART_TYPES.find(c => c.id === activeChart)?.icon} {CHART_TYPES.find(c => c.id === activeChart)?.label}
            </h2>
            <button className="btn-secondary no-print" style={{ padding: "5px 12px", fontSize: 11 }} onClick={downloadChartPNG}>
              <Download size={11} /> PNG
            </button>
          </div>
          <div style={{ height: 320 }}><canvas ref={chartRef}></canvas></div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Grade Breakdown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { grade: "A+ (90-100%)", count: 4, pct: "8.9%", color: "#10B981" },
                { grade: "A (80-89%)", count: 8, pct: "17.8%", color: "#009688" },
                { grade: "B (60-79%)", count: 18, pct: "40.0%", color: "#00BCD4" },
                { grade: "C (40-59%)", count: 12, pct: "26.7%", color: "#F59E0B" },
                { grade: "D (<40%)", count: 3, pct: "6.7%", color: "#EF4444" },
              ].map((g, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <td style={{ padding: "10px 0", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, display: "inline-block" }}></span>
                    {g.grade}
                  </td>
                  <td style={{ padding: "10px 0", fontSize: 13, fontWeight: 600, textAlign: "right" }}>{g.count}</td>
                  <td style={{ padding: "10px 0", fontSize: 12, color: "var(--text-secondary)", textAlign: "right" }}>{g.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* AI Narrative */}
          <div style={{ marginTop: 18, padding: 14, background: "rgba(0,150,136,0.05)", borderRadius: 12, border: "1px solid rgba(0,150,136,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)" }}>AI NARRATIVE</div>
              {!narrative && !narrativeLoading && (
                <button className="btn-primary no-print" style={{ padding: "4px 10px", fontSize: 10 }} onClick={generateNarrative}>
                  ✨ Generate
                </button>
              )}
            </div>
            {narrativeLoading ? (
              <div><div className="skeleton skeleton-text" style={{ marginBottom: 6 }} /><div className="skeleton skeleton-text" style={{ width: "80%" }} /></div>
            ) : narrative ? (
              <p className={narrativeLoading ? "ai-cursor" : ""} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{narrative}</p>
            ) : (
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {N} students appeared. Mean score is {mean} ({((mean / 50) * 100).toFixed(0)}%).
                {parseFloat(cv) > 30 ? " High variability." : parseFloat(cv) > 20 ? " Moderate spread." : " Consistent performance."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
