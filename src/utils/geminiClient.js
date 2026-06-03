import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiInstance = null;

export function initGemini(apiKey) {
  geminiInstance = new GoogleGenerativeAI(apiKey);
}

export function getGeminiInstance() {
  return geminiInstance;
}

export async function callGemini(prompt, options = {}) {
  if (!geminiInstance) {
    throw new Error("Gemini API not initialized. Please provide your API key.");
  }

  // Fallback chain of free tier models from the provided list, ordered by highest RPM
  const MODEL_CHAIN = [
    "gemini-3.1-flash-lite", // 15 RPM
    "gemini-2.5-flash-lite", // 10 RPM
    "gemini-3.5-flash",      // 5 RPM
    "gemini-3-flash",        // 5 RPM
    "gemini-2.5-flash",
    "gemini-2.0-flash"
  ];

  let lastError;
  const maxRetries = 4;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Try each model in the fallback chain
    for (const modelName of MODEL_CHAIN) {
      try {
        const model = geminiInstance.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: options.temperature ?? 0.4,
            maxOutputTokens: options.maxTokens ?? 4096,
            responseMimeType: options.jsonMode ? "application/json" : "text/plain",
          },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (options.jsonMode) {
          const clean = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
          try {
            return JSON.parse(clean);
          } catch (parseErr) {
            const jsonMatch = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (jsonMatch) {
              return JSON.parse(jsonMatch[1]);
            }
            throw new Error(`Failed to parse JSON response: ${parseErr.message}`);
          }
        }
        return text;
      } catch (err) {
        lastError = err;
        const errorMessage = err.message || "";
        const isRateLimit = errorMessage.includes("429") || errorMessage.includes("Quota exceeded");
        const isOverloaded = errorMessage.includes("503");
        const isNotFound = errorMessage.includes("404") || errorMessage.includes("not found");
        const isParseError = errorMessage.includes("Failed to parse JSON");
        
        if (isRateLimit || isOverloaded || isNotFound || isParseError) {
          console.warn(`[Gemini] ${modelName} failed (${isRateLimit ? '429' : isOverloaded ? '503' : isNotFound ? '404' : 'Parse Error'}). Falling back to next model...`);
          // Try the next model immediately
          continue;
        } else {
          // If it's a 400 Bad Request or other unrecoverable error, break to retry
          console.warn(`[Gemini] Non-fallback error with ${modelName}:`, errorMessage);
          break;
        }
      }
    } // End MODEL_CHAIN loop

    // If we reach here, either ALL models failed with 429/503, OR a non-fallback error occurred.
    if (attempt < maxRetries) {
      const errorMessage = lastError?.message || "";
      const isRateLimit = errorMessage.includes("429") || errorMessage.includes("Quota exceeded");
      
      if (isRateLimit) {
        // Parse delay from API if provided
        const retryMatch = errorMessage.match(/Please retry in ([\d.]+)s/);
        let waitMs = attempt * 5000;
        if (retryMatch && retryMatch[1]) {
           waitMs = Math.ceil(parseFloat(retryMatch[1])) * 1000 + 2000; 
        }
        console.warn(`[Gemini] All models exhausted. Waiting ${waitMs}ms before global retry ${attempt}...`);
        await new Promise((r) => setTimeout(r, Math.min(waitMs, 60000))); // Max 60s
      } else {
        const waitMs = attempt * 3000;
        console.warn(`[Gemini] Retrying after error... Waiting ${waitMs}ms`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  
  throw lastError;
}
