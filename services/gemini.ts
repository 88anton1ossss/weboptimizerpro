import { GoogleGenAI } from "@google/genai";
import { AuditReport, GoogleAd } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Web Optimizer Pro, an expert AI website auditor.
Your goal is to analyze the provided website URL and return a strict JSON report.

**CORE MANDATE:**
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
  const model = 'gemini-2.5-flash'; 

  // Helper function to try generation with or without tools
  const generateAudit = async (useSearch: boolean) => {
    let prompt = `Perform a Deep Dive Audit on: ${url}.`;
    
    if (useSearch) {
        prompt += `\nSTEP 1: USE GOOGLE SEARCH. Search for the site's domain.
        STEP 2: Analyze the search snippets to understand the business niche.
        STEP 3: Generate the JSON report covering all 10 dimensions, ROI estimate, and 4-week implementation plan.`;
    } else {
        prompt += `\nAnalyze the website based on the URL structure, domain authority inference, and general best practices for this type of business niche.
        Generate the JSON report covering all 10 dimensions.`;
    }
    
    prompt += `\nIf the site is not reachable, assume it has "Critical" SEO visibility issues but proceed with the audit based on general best practices.
    
    IMPORTANT: Return ONLY the raw JSON string. Do not use markdown code blocks or introduction text.`;

    const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
    };

    if (useSearch) {
        config.tools = [{ googleSearch: {} }];
    }

    return await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config,
    });
  };

  let text: string | undefined;

  // Attempt 1: With Google Search
  try {
    console.log("Attempting scan with Live Search...");
    const response = await generateAudit(true);
    text = response.text;
  } catch (error) {
    console.warn("Live search attempt failed:", error);
  }

  // Attempt 2: Fallback without Search if text is missing (e.g. tool failure or block)
  if (!text) {
    console.log("Falling back to static analysis...");
    try {
        const response = await generateAudit(false);
        text = response.text;
    } catch (fallbackError: any) {
        console.error("Fallback analysis failed:", fallbackError);
        if (fallbackError.message?.includes("API_KEY") || fallbackError.message?.includes("403")) {
             throw new Error("Invalid API Key configuration or quota exceeded.");
        }
        throw new Error("Unable to generate audit report. The AI service is currently unresponsive.");
    }
  }

  if (!text) throw new Error("No response generated from AI.");

  // Robust JSON extraction: Find the first '{' and last '}'
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  
  if (startIndex === -1 || endIndex === -1) {
      throw new Error("The AI response did not contain a valid JSON report. Please try again.");
  }
  
  const cleanJson = text.substring(startIndex, endIndex + 1);

  try {
      return JSON.parse(cleanJson);
  } catch (parseError) {
      console.error("JSON Parsing failed:", parseError);
      console.error("Raw text:", text);
      throw new Error("Failed to parse the AI report data. The model response was malformed.");
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

export const generateAdCampaign = async (url: string, nicheKeywords: string[]): Promise<GoogleAd> => {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a Google Ads Specialist.
    Create a high-performing Search Ad Campaign for: ${url}.
    Context Keywords: ${nicheKeywords.slice(0, 10).join(', ')}.
  
    Requirements:
    1. Generate 5 optimized Headlines (max 30 chars each).
    2. Generate 4 persuasive Descriptions (max 90 chars each).
    3. Suggest 10 exact-match keywords for the campaign.
  
    Output JSON ONLY:
    {
      "headlines": ["string", ...],
      "descriptions": ["string", ...],
      "keywords": ["string", ...]
    }
    `;
    
    const response = await ai.models.generateContent({
        model, 
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
}