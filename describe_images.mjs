import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const dir = 'public/images/lawn';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg')).sort();

async function describeImages() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    const uploadResult = await ai.files.upload({
      file: filePath,
      mimeType: 'image/jpeg',
    });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: 'Describe the design and color of this dress fabric in one short sentence.' },
        uploadResult
      ]
    });
    
    console.log(`--- ${file} ---`);
    console.log(response.text);
  }
}

describeImages().catch(console.error);
