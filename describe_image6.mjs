import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const filePath = 'public/images/lawn/image6.jpeg';
const b64 = fs.readFileSync(filePath).toString('base64');
    
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [
    {
      role: 'user',
      parts: [
        { text: 'Analyze this dress fabric. Suggest a professional 3-5 word product name based on the design and color (e.g. "Emerald Green Floral Lawn", "Monochrome Geometric Pret"). Then provide a 2 sentence description.' },
        { inlineData: { data: b64, mimeType: 'image/jpeg' } }
      ]
    }
  ]
});
    
console.log(`--- image6.jpeg ---`);
console.log(response.text);
