import { NextResponse } from "next/server";

// === FREE AI PROVIDERS ===
// 1. GROQ - Llama 3.3 70B (completely free, get key at console.groq.com)
// 2. Google Gemini 2.0 Flash (free tier, get key at aistudio.google.com)

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

async function callGroq(prompt, systemPrompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });
  if (!res.ok) throw new Error(`Groq error: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response.";
}

async function callGemini(prompt, systemPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [
      ...(systemPrompt ? [{ role: "user", parts: [{ text: `System: ${systemPrompt}` }] }, { role: "model", parts: [{ text: "Understood." }] }] : []),
      { role: "user", parts: [{ text: prompt }] }
    ],
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  };
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}

export async function POST(request) {
  try {
    const { prompt, systemPrompt } = await request.json();

    let result;

    // Priority: Groq (Llama 3) first (faster & free), then Gemini as fallback
    if (GROQ_API_KEY) {
      result = await callGroq(prompt, systemPrompt);
    } else if (GEMINI_API_KEY) {
      result = await callGemini(prompt, systemPrompt);
    } else {
      return NextResponse.json({ 
        error: "No API key configured. Get a FREE key:\n• Groq (Llama 3): https://console.groq.com\n• Gemini: https://aistudio.google.com\n\nAdd to .env.local as GROQ_API_KEY or GEMINI_API_KEY" 
      }, { status: 500 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
