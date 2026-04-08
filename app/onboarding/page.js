"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Splash, 1: Login, 2: Profile, 3: Language, 4: Plans

  // Splash Screen Effect
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-dark)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      
      {/* Background glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,150,136,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      {step === 0 && (
        <div className="animate-fade-in" style={{ textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "var(--gradient-1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, color: "white", margin: "0 auto 24px", boxShadow: "0 0 40px rgba(0, 150, 136, 0.4)" }}>
            E
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--primary)" }}>EduAI</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Classroom Intelligence</p>
        </div>
      )}

      {step === 1 && (
        <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 420, textAlign: "center", padding: "48px 32px" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--gradient-1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "white", margin: "0 auto 24px" }}>
            E
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome to EduAI</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>For Teachers. By Teachers.</p>
          
          <button onClick={() => setStep(2)} className="btn-secondary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px", marginBottom: 20 }}>
            <span><svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></span>
            Continue with Google
          </button>
          
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 500, padding: "40px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Set Up Your Profile</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Let's customize your teaching experience.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="text" placeholder="Full Name" className="input-field" />
            <input type="text" placeholder="School Name" className="input-field" />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <select className="input-field">
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State">State Board</option>
              </select>
              <select className="input-field">
                <option value="">Main Subject</option>
                <option value="Math">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
              </select>
            </div>
            
            <input type="text" placeholder="Classes Taught (e.g. VII-A, VIII-B)" className="input-field" />
            
            <button onClick={() => setStep(3)} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
              Next Step →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 450, padding: "40px", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Language Preference</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Choose your primary teaching medium.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {["English", "Hindi (हिंदी)", "Kannada (ಕನ್ನಡ)", "Tamil (தமிழ்)"].map((lang) => (
              <button 
                key={lang}
                onClick={() => setStep(4)}
                style={{ 
                  padding: "20px", background: "rgba(15,23,42,0.5)", border: "1px solid var(--border)", 
                  borderRadius: 12, color: "var(--text-primary)", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" 
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 800, padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Choose Your Plan</h2>
            <p style={{ color: "var(--text-secondary)" }}>You can always upgrade later.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 32 }}>
            {[
              { name: "Free", price: "₹0", features: ["5 AI generations / day", "Basic templates", "1 Class section"] },
              { name: "Pro", price: "₹499/mo", features: ["Unlimited AI", "Full stats & diagnosis", "PDF Exports", "Unlimited classes"], popular: true }
            ].map(plan => (
              <div key={plan.name} style={{ 
                padding: "32px 24px", border: `1px solid ${plan.popular ? "var(--primary)" : "var(--border)"}`, 
                borderRadius: 16, background: plan.popular ? "rgba(0,150,136,0.05)" : "rgba(15,23,42,0.5)",
                position: "relative"
              }}>
                {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--gradient-1)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>MOST POPULAR</div>}
                
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 24 }}>{plan.price}</div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", gap: 12, display: "flex", flexDirection: "column" }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 14 }}>
                      <span style={{ color: "var(--success)" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => router.push("/dashboard")} 
                  className={plan.popular ? "btn-primary" : "btn-secondary"} 
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
