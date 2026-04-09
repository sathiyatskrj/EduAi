import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const OLLAMA_PATH = `"C:\\Users\\Neel\\AppData\\Local\\Programs\\Ollama\\ollama.exe"`;

export async function GET() {
  try {
    const { stdout } = await execPromise(`${OLLAMA_PATH} list`);
    
    // Parse Ollama list output
    // Format: NAME ID SIZE MODIFIED
    const lines = stdout.split("\n").slice(1); // Skip header
    const models = lines
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          name: parts[0],
          id: parts[1],
          size: parts[2],
          modified: parts.slice(3).join(" ")
        };
      });

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json({ 
      error: "Ollama not found or not running",
      details: error.message 
    }, { status: 500 });
  }
}
