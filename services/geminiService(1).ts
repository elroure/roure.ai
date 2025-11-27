import { GoogleGenAI } from "@google/genai";
import { GenerateResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCodeFromScreenshot = async (
  imageBase64: string, 
  instructions: string = ""
): Promise<GenerateResult> => {
  
  // Remove header if present in base64 string (e.g., "data:image/png;base64,")
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const systemPrompt = `
    You are a world-class Frontend Engineer and UI/UX Designer. 
    Your task is to replicate a website UI as closely as possible based on a provided screenshot.
    
    Rules:
    1. Output a SINGLE HTML file.
    2. Use Tailwind CSS for styling via CDN: <script src="https://cdn.tailwindcss.com"></script>.
    3. Use semantic HTML5 tags.
    4. Make the design responsive (mobile-first approach).
    5. Use "https://picsum.photos/width/height" for any images, estimating the size from the screenshot.
    6. Use "lucide" icons if possible by importing the script, or use SVG strings inline for icons. 
       For simplicity, use: <script src="https://unpkg.com/lucide@latest"></script> and <script>lucide.createIcons();</script> at the end of the body.
       Use <i data-lucide="icon-name"></i> syntax.
    7. Do NOT add any markdown formatting (like \`\`\`html). Return ONLY the raw HTML string.
    8. Ensure high contrast and accessibility.
    9. If the user provided specific instructions, incorporate them.
    10. The goal is VISUAL ACCURACY. Match colors, spacing, and typography as best as the model allows.
  `;

  const userPrompt = `
    Here is a screenshot of a website I want you to recreate.
    
    Additional Instructions: ${instructions ? instructions : "None."}
    
    Generate the complete HTML file now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Flash is excellent for vision and code speed
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", // Assuming PNG for simplicity, GenAI handles common formats
              data: cleanBase64
            }
          },
          {
            text: userPrompt
          }
        ]
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4, // Lower temperature for more precise code generation
      }
    });

    // Extract text
    let code = response.text || "";

    // Cleanup if the model accidentally included markdown
    code = code.replace(/```html/g, "").replace(/```/g, "").trim();

    return {
      html: code
    };

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};