import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, projectType, dimensions } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Project description prompt is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are an expert construction material estimator and civil engineering advisor for Build Tech Hub, Nigeria's premier commercial building materials supplier.
Given a user's construction project description, breakdown the required structural building materials with accurate estimates tailored for the Nigerian market.
Return a structured JSON object containing:
1. "summary": A professional overview of the project engineering requirements, structural considerations, and Nigerian building code/SONCAP standards.
2. "materials": An array of recommended items, each with:
   - "name": string (descriptive name matching common Nigerian building products, e.g. "Dangote Portland Cement 50kg (Grade 42.5N)", "Y16 High-Yield Steel Rebar Length (12m)", "0.55mm Aluguard Longspan Aluminum Sheet", "2x6 Seasoned Hardwood Timber Beam", "Coleman 16mm Armoured Copper Cable")
   - "category": string (one of: "Structural Steel", "Cement & Concrete", "Masonry & Blocks", "Lumber & Framing", "Roofing & Siding", "Plumbing & Electrical", "Drywall & Insulation", "Tools & Fasteners")
   - "estimatedQuantity": number
   - "unit": string (e.g., "pieces", "bags", "sheets", "rolls", "tons", "coils", "m")
   - "estimatedUnitPrice": number (realistic Nigerian Naira ₦ price, e.g., 9800 for 50kg cement, 14500 for Y16 rebar, 11500 per sq m aluminum sheet)
   - "specification": string (e.g., "NIS 444-1 Grade 42.5N", "SONCAP High-Yield BS 4449", "0.55mm Thickness Grade 3003")
   - "reason": string (brief explanation of why this material and quantity was selected for Nigerian site conditions)
3. "recommendations": An array of 3 actionable contractor tips for Nigerian climate/site conditions (e.g., damp-proof membrane waterproofing, concrete slump testing, anti-termite wood treatment).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Project Type: ${projectType || 'General Construction'}\nDimensions/Specs: ${dimensions || 'Standard'}\nDescription: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            materials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  estimatedQuantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedUnitPrice: { type: Type.NUMBER },
                  specification: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["name", "category", "estimatedQuantity", "unit", "estimatedUnitPrice", "specification", "reason"],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["summary", "materials", "recommendations"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from AI model.");
    }

    const data = JSON.parse(resultText);
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("Error in Vercel API handler:", err);
    return res.status(500).json({ error: err.message || "Failed to generate project material estimate." });
  }
}
