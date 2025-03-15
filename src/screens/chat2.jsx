import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiResponse(userInput) {
    const GEMINI_API_KEY = "AIzaSyBIhcR9zftIUImxYcgVGx6ZJWLlZABnfF8";
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(userInput);
        const responseText = await result.response.text();
        return responseText;
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        return "Sorry, I couldn't process your request.";
    }
}