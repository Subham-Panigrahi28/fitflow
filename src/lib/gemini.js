// ===============================
//  AI Fitness Coach Response API
// ===============================

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Verify key presence
if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ Missing GOOGLE_API_KEY in .env file");
  process.exit(1);
}

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.AIzaSyDYHCWh2AMQjL9pFDE899u321IJNrwzTCQ);

// ===============================
//  Main Function
// ===============================

export const generateResponse = async (userContext, userMessage) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // use the stable model

  const prompt = `
Fitness Coach Assistant - User Context:
- Name: ${userContext.name}
- Stats: ${userContext.age}y, ${userContext.height}cm, ${userContext.weight}kg
- Goal: ${userContext.goal} (${userContext.calculated.dailyCalorieTarget} kcal/day)
- Macros: P${userContext.calculated.macros.protein}g / C${userContext.calculated.macros.carbs}g / F${userContext.calculated.macros.fat}g
- Progress: ${userContext.progress.weightChange} per week
- Current Workout Split: ${userContext.workoutSplit}

User Question:
"${userMessage}"

Respond with:
1. Science-backed advice (cite studies when possible)
2. Actionable steps
3. ${userContext.gamification.streak > 3 ? "Motivational note for their streak" : ""}
`;

  try {
    // Request generation
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Success
    return text;
  } catch (error) {
    // Detailed logging for diagnosis
    console.error("🔥 Gemini API Error:");
    console.error("Message:", error.message);
    if (error.response) {
      try {
        const errText = await error.response.text();
        console.error("Response:", errText);
      } catch {
        console.error("Response object present but unreadable");
      }
    }
    // Return user-facing fallback
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};
