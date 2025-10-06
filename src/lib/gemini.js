// ===============================
//  AI Fitness Coach Response API
// ===============================

import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚡ Hardcoded API Key (frontend only for college project)
const genAI = new GoogleGenerativeAI("AIzaSyDYHCWh2AMQjL9pFDE899u321IJNrwzTCQ");

// ===============================
//  Main Function
// ===============================

export const generateResponse = async (userContext, userMessage) => {
  try {
    // Load Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Safely handle missing userContext fields
    const name = userContext?.name || "User";
    const age = userContext?.age || "N/A";
    const height = userContext?.height || "N/A";
    const weight = userContext?.weight || "N/A";
    const goal = userContext?.goal || "Fitness";
    const dailyCalorieTarget = userContext?.calculated?.dailyCalorieTarget || "N/A";
    const macros = userContext?.calculated?.macros || { protein: 0, carbs: 0, fat: 0 };
    const progress = userContext?.progress || { weightChange: "N/A" };
    const workoutSplit = userContext?.workoutSplit || "N/A";
    const streak = userContext?.gamification?.streak || 0;

    // Build the AI prompt
    const prompt = `
You are a world-class AI Fitness Coach. Provide scientifically accurate, motivational, and actionable advice.

User Context:
- Name: ${name}
- Age: ${age} years
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal} (${dailyCalorieTarget} kcal/day)
- Macros: P${macros.protein}g / C${macros.carbs}g / F${macros.fat}g
- Progress: ${progress.weightChange} per week
- Current Workout Split: ${workoutSplit}

User Question:
"${userMessage}"

Your Response Must Include:
1. Clear, evidence-based fitness or nutrition guidance.
2. Actionable next steps.
3. A ${streak > 3 ? "motivational message celebrating their streak." : "short motivational boost."}
`;

    // Generate AI response
    const result = await model.generateContent([prompt]);

    // Extract text
    const response = await result.response;
    const text = response?.text?.() || "No response text received.";

    return text;

  } catch (error) {
    console.error("🔥 Gemini API Error:", error);
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};
