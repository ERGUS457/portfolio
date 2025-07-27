// File: /api/chat.js (untuk Vercel/Netlify)

// Catatan: Anda perlu menginstal @google/generative-ai di lingkungan hosting Anda.
// Vercel/Netlify biasanya akan melakukannya secara otomatis jika Anda memiliki file package.json.
// Jika tidak, kita bisa menambahkannya.
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ambil API Key dari environment variable untuk keamanan
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Mengatur header CORS untuk mengizinkan permintaan dari domain portofolio Anda
        res.setHeader('Access-Control-Allow-Origin', '*'); // Untuk pengembangan, bisa diperketat nanti
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.status(200).json({ text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: 'Failed to generate content from AI' });
    }
}
