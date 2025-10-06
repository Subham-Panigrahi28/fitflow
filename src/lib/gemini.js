
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the new API key
const genAI = new GoogleGenerativeAI("AIzaSyDYHCWh2AMQjL9pFDE899u321IJNrwzTCQ");

export const generateResponse = async (userContext, userMessage) => {
  // Use gemini-1.5-pro instead of gemini-pro
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
  const prompt = `
  Fitness Coach Assistant - User Context:
  - Name: ${userContext.name}
  - Stats: ${userContext.age}y, ${userContext.height}cm, ${userContext.weight}kg
  - Goal: ${userContext.goal} (${userContext.calculated.dailyCalorieTarget} kcal)
  - Macros: P${userContext.calculated.macros.protein}g/C${userContext.calculated.macros.carbs}g/F${userContext.calculated.macros.fat}g
  - Progress: ${userContext.progress.weightChange}/week
  - Current Workout Split: ${userContext.workoutSplit}

  User Question: "${userMessage}"
  
  Respond with:
  1. Science-backed advice (cite studies when possible)
  2. Actionable steps
  3. ${userContext.gamification.streak > 3 ? "Motivational note for their streak" : ""}
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};
