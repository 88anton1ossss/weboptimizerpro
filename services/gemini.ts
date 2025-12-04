import { GoogleGenAI } from "@google/genai";
import { AuditReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Web Optimizer Pro, an elite AI Web Audit Engine. Your goal is to analyze a website URL provided by the user and generate a HIGHLY DETAILED, JSON-formatted audit report based on REAL-TIME DATA from Google Search.

**CORE MANDATE:**
You **MUST** use the 'googleSearch' tool to perform a live investigation of the target URL. 
- Verify if the site is indexed.
- Analyze its actual search snippets (Title, Meta Description).
- Find real competitors ranking for similar terms.
- Extract the specific business niche from the content found.
- **KEYWORD PARSING:** Analyze the vocabulary used by top-ranking competitors in this niche to extract high-value keywords.

**EXECUTION STEPS:**
1.  **Live Reconnaissance:** Search for "site:{url}" to check indexing status. Search for the brand name to find reviews and social profiles. Search for generic terms related to the business to find competitors.
2.  **Niche & Keyword Extraction:** Based *strictly* on the content found in the search results, determine the exact micro-niche. Generate 10 high-value "Money Keywords" (high intent) and 10 "Long-Tail Key Phrases" that users actually search for in this niche. Formulate a short strategy on how to use them.
3.  **10-Dimension Analysis:**
    1.  **Initial Site Overview:** Design aesthetics (inferred from description/industry standards), UI modernization needs.
    2.  **Technical & Performance:** Speed indicators (from mobile-friendly tests if mentioned in search), SSL status.
    3.  **AI Visibility (LLM Optimization):** Is the content clear enough for an AI to summarize? (Test this by trying to summarize the search snippets).
    4.  **Voice Search Readiness:** Look for Question/Answer structures in the content snippets.
    5.  **User Intent & Conversion:** clear Call-to-Actions (CTA) in the meta description?
    6.  **Trust & Social Proof:** Are there star ratings in the snippets? Reviews on third-party sites?
    7.  **Local SEO:** Is there a physical address or Google Map entry visible in search results?
    8.  **Content Depth:** Do the search results show blog posts, service pages, or just a homepage?
    9.  **Competitor Differentiation:** Compare against 2 real competitors found in the search.
    10. **Scoring:** Strict 1-10 scoring.

**OUTPUT FORMAT RULES:**
- Return ONLY valid JSON.
- No Markdown code blocks.
- The structure must match the AuditReport interface strictly.
- **Critical:** In "recommendations", provide specific technical instructions (e.g., "Add JSON-LD Organization schema", "Compress hero image to WebP").

{
  "targetUrl": "string",
  "overallScore": number (0-100),
  "executiveSummary": "string (Focus on business value and critical blockers found via search)",
  "quickWins": ["string", "string", "string"],
  "businessImpact": "string (e.g., 'Fixing technical errors could boost organic traffic by ~25% and conversion by ~15%')",
  "keywords": ["string", "string" ... (top 10 single words specific to this niche)],
  "keyPhrases": ["string", "string" ... (top 10 phrases specific to this niche)],
  "keywordStrategy": "string (A 2-3 sentence strategic advice on how to deploy these keywords based on competitor gaps found in search)",
  "scanDate": "string",
  "sections": [
    {
      "id": "1",
      "title": "Initial Site Overview & Design",
      "score": number (1-10),
      "summary": "string",
      "weaknesses": ["string", "string"],
      "recommendations": [
        {
          "issue": "string",
          "fix": "string (Specific technical or content fix)",
          "impact": "High" | "Medium" | "Low",
          "difficulty": "Easy" | "Medium" | "Hard",
          "keywords": ["string"]
        }
      ]
    }
  ]
}
`;

export const analyzeWebsite = async (url: string): Promise<AuditReport> => {
  try {
    const model = 'gemini-2.5-flash'; 

    const prompt = `Perform a Live Deep Dive Audit on: ${url}. 
    
    STEP 1: USE GOOGLE SEARCH. Search for the site's domain.
    STEP 2: Analyze the search snippets to understand the business niche.
    STEP 3: Generate the JSON report.
    
    If the site is not found in Google Search, assume it has "Critical" SEO visibility issues (De-indexed or New).
    
    Generate high-value, niche-specific keywords based on what you find.`;

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
    
    const contextSummary = `
      Current Audit Context for ${reportContext.targetUrl}:
      Overall Score: ${reportContext.overallScore}
      Summary: ${reportContext.executiveSummary}
      Key Weaknesses: ${reportContext.sections.map(s => s.weaknesses.join(', ')).join('; ')}
      Identified Niche Keywords: ${reportContext.keywords.join(', ')}
    `;

    const systemPrompt = `You are Web Optimizer Pro Assistant, a helpful AI web engineer.
    The user is asking questions about the audit report you just generated.
    
    CONTEXT:
    ${contextSummary}

    RULES:
    1. If the user asks for code (schema, meta tags, css), WRITE IT.
    2. Be concise and practical.
    3. Use the audit findings to support your answers.
    4. If asked about the keywords, explain why they were chosen for this specific niche.
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