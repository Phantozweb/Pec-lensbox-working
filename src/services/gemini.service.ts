import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize with empty key to prevent runtime crash on 'process is not defined'.
    // API calls will fail gracefully in the try/catch blocks if no key is present.
    this.ai = new GoogleGenAI({ apiKey: '' });
  }

  async getHelpfulAnalysis(context: string): Promise<string> {
    try {
      const model = 'gemini-2.5-flash';
      const prompt = `You are an assistant for an Optical Store Feedback system. 
      Analyze the following customer feedback comments and provide a very short, 1-sentence summary of the sentiment and a suggested action.
      
      Comments: "${context}"
      
      Format: Sentiment: [Sentiment], Action: [Action]`;

      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      
      return response.text || 'Could not analyze.';
    } catch (e) {
      // Console error removed to keep console clean for user
      return 'AI Analysis unavailable (Check API Key).';
    }
  }

  async generateWhatsappMessage(customerName: string, issue: string): Promise<string> {
    try {
       const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Draft a professional, polite, and short WhatsApp message for a customer named ${customerName} who had the following feedback about their lenses: "${issue}". The message should come from Dr. Preethika's Eyecare. Do not use hashtags.`,
      });
      return response.text.trim();
    } catch (e) {
      return `Hello ${customerName}, we saw your feedback. Please let us know how we can help.`;
    }
  }
}