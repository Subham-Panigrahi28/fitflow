// ===============================
//  AI Fitness Coach Response API
// ===============================

// Import the official Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize the SDK with your API key
// IMPORTANT: Never hardcode this key in frontend code.
// Put it in your .env file (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "YOUR_API_KEY_HERE");

// ===============================
//  Main Function
// ===============================

export const generateResponse = async (userContext, userMessage) => {
  // Choose the latest stable Gemini model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Build the full context-aware prompt
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
    // Generate content from Gemini
    const result = await model.generateContent(prompt);

    // Correct way to extract text
    const response = await result.response;
    const text = response.text();

    // Return AI's reply
    return text;

  } catch (error) {
    // Log full error for debugging
    console.error("🔥 Error generating AI response:", error);
    // Return friendly fallback message
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};
