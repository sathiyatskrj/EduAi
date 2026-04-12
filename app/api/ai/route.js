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
          if (!res.ok) {
            const errorDetails = await res.text();
            throw new Error(`Gemini Connection Error (${res.status}): ${errorDetails}`);
          }
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
          // GEMINI STREAM - utilizing 'gemini-3.1-flash-lite-preview'
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:streamGenerateContent?key=${GEMINI_API_KEY}`;
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
          // Gemini 3.1 Flash Lite (Best free tier: 500 RPD)
          if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in environment");
          
          let lastErr;
          const maxAttempts = 3;
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
             try {
               // Use gemini-3.1-flash-lite-preview base model
               const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:streamGenerateContent?key=${GEMINI_API_KEY}`;
               const res = await fetch(url, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                   contents: [{ parts: [{ text: safeSystem ? `${safeSystem}\n\n${safePrompt}` : safePrompt }] }],
                   generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
                 })
               });

               if (res.status === 429) {
                 const wait = Math.pow(2, attempt) * 2000;
                 console.warn(`[AI API] 429 Rate Limit. Retrying in ${wait}ms... (Attempt ${attempt + 1}/${maxAttempts})`);
                 if (attempt < maxAttempts - 1) {
                   await new Promise(r => setTimeout(r, wait));
                   continue;
                 }
                 throw new Error("Rate limit exceeded. Please wait a minute or try Offline Mode (Ollama).");
               }

               if (res.status === 503 && attempt < maxAttempts - 1) {
                 console.warn(`[AI API] 503 Overloaded. Retrying in 1s...`);
                 await new Promise(r => setTimeout(r, 1000));
                 continue;
               }

               if (!res.ok) {
                 const errorText = await res.text();
                 throw new Error(`Gemini error (${res.status}): ${errorText}`);
               }
               
               await streamGeminiResponse(res.body, controller, encoder, decoder);
               return; // Success
             } catch (e) {
               lastErr = e;
               if (attempt === maxAttempts - 1) throw e;
             }
          }
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
    
    // Gemini streaming returns an array of chunks: [ { "candidates": [...] }, ... ]
    // Each chunk is usually a JSON object. However, the stream might deliver partial objects.
    // We attempt to find complete JSON objects in the buffer.
    
    let boundary = buffer.indexOf('}\n,');
    if (boundary === -1) boundary = buffer.indexOf('}]'); // End of stream
    
    // Robust approach: Look for "text": "..." and extract specifically.
    // We use a global regex but we DON'T clear the buffer blindly.
    const regex = /"text":\s*"((?:[^"\\]|\\.)*)"/g;
    let match;
    let lastIndex = 0;
    
    while ((match = regex.exec(buffer)) !== null) {
      const raw = match[1];
      const text = raw
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .replace(/\\t/g, "\t");
      
      controller.enqueue(encoder.encode(text));
      lastIndex = regex.lastIndex;
    }
    
    // Keep the part of the buffer that hasn't been matched yet (might be a partial "text" key)
    if (lastIndex > 0) {
      buffer = buffer.slice(lastIndex);
    }
  }
}

// ── Route Handler ───────────────────────────────────────────
export async function POST(request) {
  try {
    const { prompt, systemPrompt, provider, model } = await request.json();
    console.log(`[AI API] Request received. Provider: ${provider}, Model: ${model}`);
    
    if (provider === "gemini" && !GEMINI_API_KEY) {
      console.error("[AI API] Error: GEMINI_API_KEY is missing in environment.");
      return NextResponse.json({ error: "GEMINI_API_KEY not set in environment" }, { status: 500 });
    }

    const safePrompt = stripPII(prompt);
    const safeSystem = stripPII(systemPrompt);
    
    const stream = await handleStreamingResponse(provider || "gemini", safePrompt, safeSystem, model);
    console.log("[AI API] Starting stream response...");
    
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
