import { GoogleGenAI } from "@google/genai";
import { AuditReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Web Optimizer Pro, an expert AI website auditor.
Your goal is to analyze the provided website URL and return a strict JSON report based on REAL-TIME DATA from Google Search.

**CORE MANDATE:**
You **MUST** use the 'googleSearch' tool to perform a live investigation of the target URL. 
- Verify indexing and analyze actual search snippets.
- Analyze content depth, competitors, and user intent.
- **TONE:** Use plain, friendly business language. Avoid jargon where possible. 

**ANALYSIS ZONES (10 Dimensions per Protocol):**
1. Initial Site Overview (Design & UI)
2. Technical SEO & Performance (Meta tags, structure)
3. AI Visibility (How LLMs read this content)
4. Voice Search Readiness (NLP optimization)
5. User Intent & Conversion (CTA clarity)
6. Trust & Social Proof (Reviews, specific trust signals)
7. Local SEO (NAP consistency, location pages)
8. Content Depth (Structure, keywords)
9. Competitor Differentiation (USP analysis)
10. Scoring & ROI

**OUTPUT FORMAT:**
Return ONLY valid JSON. The structure must match strictly:

{
  "targetUrl": "string",
  "overallScore": number (0-100),
  "executiveSummary": "string (2-3 sentences, focus on business value)",
  "quickWins": ["string", "string", "string"],
  "roiEstimate": {
    "trafficGain": "string (e.g. '+25% Organic')",
    "leadIncrease": "string (e.g. '2x Inquiries')",
    "revenueProjection": "string (e.g. '$5k-10k/mo potential')"
  },
  "keywords": ["string" ... top 10 niche keywords],
  "keyPhrases": ["string" ... top 10 niche phrases],
  "keywordStrategy": "string (Strategic advice on deployment)",
  "sections": [
    {
      "id": "1", // Use "1" through "10" matching the dimensions above
      "title": "Initial Site Overview",
      "score": number (1-10),
      "summary": "string",
      "findings": ["string", "string" ... (friendly explanation of issues)],
      "recommendations": [
        {
          "issue": "string",
          "fix": "string",
          "impact": "High" | "Medium" | "Low",
          "difficulty": "Easy" | "Medium" | "Hard",
          "keywords": ["string"]
        }
      ]
    }
    ... include all 10 sections ...
  ],
  "implementationPlan": [
    { "week": 1, "focus": "string", "tasks": ["string", "string", "string"] },
    { "week": 2, "focus": "string", "tasks": ["string", "string", "string"] },
    { "week": 3, "focus": "string", "tasks": ["string", "string", "string"] },
    { "week": 4, "focus": "string", "tasks": ["string", "string", "string"] }
  ],
  "scanDate": "string"
}
`;

export const analyzeWebsite = async (url: string): Promise<AuditReport> => {
  try {
    const model = 'gemini-2.5-flash'; 

    const prompt = `Perform a Live Deep Dive Audit on: ${url}. 
    
    STEP 1: USE GOOGLE SEARCH. Search for the site's domain.
    STEP 2: Analyze the search snippets to understand the business niche.
    STEP 3: Generate the JSON report covering all 10 dimensions, ROI estimate, and 4-week implementation plan.
    
    If the site is not found in Google Search, assume it has "Critical" SEO visibility issues.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated.");

    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '');
    }

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Audit failed:", error);
    throw error;
  }
};

export const chatWithZaiper = async (message: string, reportContext: AuditReport, history: any[]) => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Response Scenario Architecture from PDF
    const systemPrompt = `You are Web Optimizer Pro Assistant.
    
    **RESPONSE ARCHITECTURE:**
    1. **Understand Intent:** Clarification? Content Generation? Strategy? Planning?
    2. **Context:** Use the audit report data provided below.
    3. **Output Patterns:**
       - If explaining an issue: Use "Explain + 3 steps".
       - If asked for content: Provide "Text blocks" (ready-to-copy).
       - If strategic: Use "3-action focus".
       - If planning: Create a "Time-boxed plan".
    
    **CONTEXT:**
    Target: ${reportContext.targetUrl}
    Score: ${reportContext.overallScore}
    ROI Estimate: Traffic ${reportContext.roiEstimate.trafficGain}, Leads ${reportContext.roiEstimate.leadIncrease}.
    Top Issues: ${reportContext.sections.flatMap(s => s.findings).slice(0, 5).join('; ')}
    
    **RULES:**
    - Be plain, friendly, and business-appropriate.
    - No markdown artifacts like "**" or technical jargon unless explained.
    - Focus on concrete actions.
    `;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemPrompt,
      }
    });
    
    const result = await chat.sendMessage({
      message: message
    });

    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the core right now.";
  }
};
