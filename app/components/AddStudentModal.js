"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function AddStudentModal({ onAdd, onClose }) {
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const student = {
      name: data.get("name"),
      id: "S" + Math.floor(Math.random() * 900 + 100),
      cls: data.get("cls"),
      perf: 75,
      trend: "flat",
      status: "New",
      phone: data.get("phone") || "9999999999",
      parent: data.get("parent") || "Parent",
      weakTopics: [],
    };
    onAdd(student);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Add New Student</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>Fill in the student details below.</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Full Name *</label>
              <input ref={nameRef} name="name" required className="input-field" placeholder="e.g., Aarav Sharma" style={{ padding: "12px 14px" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Class Section *</label>
              <select name="cls" required className="input-field" style={{ padding: "12px 14px" }}>
                {["VII-A", "VII-B", "VIII-A", "VIII-B", "IX-A", "IX-B", "X-A", "X-B"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Parent / Guardian</label>
              <input name="parent" className="input-field" placeholder="e.g., Mr. Sharma" style={{ padding: "12px 14px" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Parent Phone</label>
              <input name="phone" type="tel" className="input-field" placeholder="e.g., 9876543210" style={{ padding: "12px 14px" }} maxLength={10} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: "12px", justifyContent: "center" }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: "12px", justifyContent: "center" }}>
              ✅ Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
