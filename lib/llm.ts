import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractIntent(userQuery: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    User Query: "${userQuery}"
    Extract 2-3 search keywords and the state (if mentioned).
    Return ONLY JSON: {"keywords": "...", "state": "..."}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  // Clean up markdown code blocks if LLM adds them
  const jsonStr = text.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function generateSteps(serviceName: string, language: string = "English") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Service: ${serviceName}
    Language: ${language}
    Generate 3-4 very short, simple instruction steps for a user with low digital literacy to navigate this site.
    Return ONLY JSON: ["Step 1 text", "Step 2 text", "Step 3 text"]
  `;

  const result = await model.generateContent(prompt);
  const jsonStr = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(jsonStr);
}