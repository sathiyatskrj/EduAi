import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ── PII Shield ─────────────────────────────────────────────
function stripPII(text) {
  if (!text) return text;
  const namePatterns = [
    /\b(Aarav|Avni|Dhruv|Diya|Ishaan|Kavya|Ravi|Priya|Arjun|Neha|Rohan|Sneha|Vikram|Ananya|Aditya|Meera|Karthik|Pooja|Rahul|Shreya|Om|Lakshmi|Mohan)\s+\w+/gi,
    /\bStudent\s+Name:\s*[A-Za-z\s]+/gi,
  ];
  let cleaned = text;
  const foundNames = [];
  namePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, (match) => {
      if (!foundNames.includes(match.trim())) foundNames.push(match.trim());
      const idx = foundNames.indexOf(match.trim());
      return `Student ${String.fromCharCode(65 + idx)}`;
    });
  });
  cleaned = cleaned.replace(/\b\w+\s*(School|Academy|Vidyalaya|Institute|College)\b/gi, "[School]");
  cleaned = cleaned.replace(/(\+91|0)?[6-9]\d{9}/g, "[PHONE]");
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]");
  return cleaned;
}

// ── Streaming Handler ───────────────────────────────────────
async function handleStreamingResponse(provider, safePrompt, safeSystem, model) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      try {
        if (provider === "ollama") {
          const url = "http://localhost:11434/api/generate";
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: model || "gemma2",
              prompt: safeSystem ? `System: ${safeSystem}\n\nUser: ${safePrompt}` : safePrompt,
              stream: true,
              options: { temperature: 0.2 }
            })
          });
          if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
          const reader = res.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const lines = decoder.decode(value).split("\n");
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) controller.enqueue(encoder.encode(parsed.response));
              } catch {}
            }
          }
        } else if (provider === "gemini-flash-2") {
          // Gemini 2.0 Flash
          if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in environment");
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: safeSystem ? `${safeSystem}\n\n${safePrompt}` : safePrompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
            })
          });
          if (!res.ok) throw new Error(`Gemini 2.0 error: ${res.status}`);
          await streamGeminiResponse(res.body, controller, encoder, decoder);
        } else {
          // Gemini 1.5 Flash (default)
          if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in environment");
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: safeSystem ? `${safeSystem}\n\n${safePrompt}` : safePrompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
            })
          });
          if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
          await streamGeminiResponse(res.body, controller, encoder, decoder);
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n\n⚠️ Error: ${err.message}`));
      } finally {
        controller.close();
      }
    }
  });
}

async function streamGeminiResponse(body, controller, encoder, decoder) {
  const reader = body.getReader();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // Extract all "text" fields from the buffered JSON chunks
    const matches = buffer.match(/"text":\s*"((?:[^"\\]|\\.)*)"/g);
    if (matches) {
      for (const match of matches) {
        const raw = match.slice(8, -1);
        const text = raw
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\")
          .replace(/\\t/g, "\t");
        controller.enqueue(encoder.encode(text));
      }
      // Clear processed buffer
      buffer = "";
    }
  }
}

// ── Route Handler ───────────────────────────────────────────
export async function POST(request) {
  try {
    const { prompt, systemPrompt, provider, model } = await request.json();
    const safePrompt = stripPII(prompt);
    const safeSystem = stripPII(systemPrompt);
    const stream = await handleStreamingResponse(provider || "gemini", safePrompt, safeSystem, model);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
