
export const calculateTDEE = (user) => {
  // BMR Calculation
  let bmr;
  if (user.gender === "Male") {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  }

  // Activity Multipliers
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  const tdee = bmr * multipliers[user.activityLevel - 1];

  // Goal Adjustments
  let target;
  if (user.goal === "Cut") target = tdee - 300;
  else if (user.goal === "Bulk") target = tdee + 300;
  else target = tdee;

  // Protein Intake (ISSN Guidelines)
  const protein = user.goal === "Bulk" ? 1.8 * user.weight : 2.2 * user.weight;

  return {
    maintenanceCalories: Math.round(tdee),
    dailyCalorieTarget: Math.round(target),
    macros: {
      protein: Math.round(protein),
      carbs: Math.round((target * 0.4) / 4), // 40% carbs
      fat: Math.round((target * 0.3) / 9)    // 30% fats
    }
  };
};

export const calculateWeightChange = (weightEntries) => {
  if (!weightEntries || Object.keys(weightEntries).length < 2) return "No data";
  
  const dates = Object.keys(weightEntries).sort();
  const firstWeight = weightEntries[dates[0]];
  const lastWeight = weightEntries[dates[dates.length - 1]];
  
  // Calculate weeks between first and last entry
  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);
  const weeksDiff = (lastDate - firstDate) / (7 * 24 * 60 * 60 * 1000);
  
  if (weeksDiff < 0.5) return "Insufficient data";
  
  const weightDiff = lastWeight - firstWeight;
  const weeklyChange = weightDiff / weeksDiff;
  
  return `${weeklyChange.toFixed(1)}kg`;
};

export const generateWorkoutPlan = (user) => {
  const plans = {
    "Push/Pull/Legs": {
      day1: { name: "Push", exercises: ["Bench Press", "Overhead Press", "Tricep Extensions", "Lateral Raises"], sets: 4 },
      day2: { name: "Pull", exercises: ["Deadlifts", "Barbell Rows", "Pull-ups", "Bicep Curls"], sets: 4 },
      day3: { name: "Legs", exercises: ["Squats", "Romanian Deadlifts", "Leg Press", "Calf Raises"], sets: 4 },
      day4: { name: "Rest", exercises: ["Mobility Work", "Light Cardio (optional)"], sets: 1 },
      day5: { name: "Push", exercises: ["Incline Press", "Dumbbell Press", "Tricep Pushdowns", "Chest Flies"], sets: 4 },
      day6: { name: "Pull", exercises: ["Pull-ups", "Seated Rows", "Face Pulls", "Hammer Curls"], sets: 4 },
      day7: { name: "Legs", exercises: ["Front Squats", "Lunges", "Leg Extensions", "Leg Curls"], sets: 4 },
    },
    "Upper/Lower": {
      day1: { name: "Upper", exercises: ["Bench Press", "Barbell Rows", "Overhead Press", "Pull-ups"], sets: 4 },
      day2: { name: "Lower", exercises: ["Squats", "Romanian Deadlifts", "Lunges", "Calf Raises"], sets: 4 },
      day3: { name: "Rest", exercises: ["Mobility Work", "Light Cardio"], sets: 1 },
      day4: { name: "Upper", exercises: ["Incline Press", "Lat Pulldowns", "Lateral Raises", "Bicep Curls"], sets: 4 },
      day5: { name: "Lower", exercises: ["Deadlifts", "Leg Press", "Leg Curls", "Leg Extensions"], sets: 4 },
      day6: { name: "Rest", exercises: ["Mobility Work", "Light Cardio"], sets: 1 },
      day7: { name: "Full Body", exercises: ["Push-ups", "Pull-ups", "Goblet Squats", "Planks"], sets: 3 },
    },
    "Full Body": {
      day1: { name: "Full Body A", exercises: ["Squats", "Bench Press", "Barbell Rows", "Shoulder Press"], sets: 3 },
      day2: { name: "Rest", exercises: ["Mobility Work", "Light Cardio"], sets: 1 },
      day3: { name: "Full Body B", exercises: ["Deadlifts", "Incline Press", "Pull-ups", "Lunges"], sets: 3 },
      day4: { name: "Rest", exercises: ["Mobility Work", "Light Cardio"], sets: 1 },
      day5: { name: "Full Body C", exercises: ["Front Squats", "Dips", "Seated Rows", "Bulgarian Split Squats"], sets: 3 },
      day6: { name: "Active Recovery", exercises: ["Light Cardio", "Core Work", "Mobility"], sets: 2 },
      day7: { name: "Rest", exercises: ["Complete Rest"], sets: 0 },
    }
  };
  
  // Default to Full Body for beginners
  return plans[user.workoutSplit || "Full Body"];
};

export const generateDietPlan = (user) => {
  const dailyCalories = user.calculated.dailyCalorieTarget;
  const protein = user.calculated.macros.protein;
  const carbs = user.calculated.macros.carbs;
  const fat = user.calculated.macros.fat;
  
  // Basic meal template
  const plan = {
    monday: {
      meals: [
        { name: "Breakfast", description: "Protein Oatmeal with Berries", calories: Math.round(dailyCalories * 0.25), protein: Math.round(protein * 0.25) },
        { name: "Lunch", description: "Chicken Salad with Quinoa", calories: Math.round(dailyCalories * 0.35), protein: Math.round(protein * 0.35) },
        { name: "Dinner", description: "Baked Salmon with Vegetables", calories: Math.round(dailyCalories * 0.30), protein: Math.round(protein * 0.30) },
        { name: "Snack", description: "Greek Yogurt with Almonds", calories: Math.round(dailyCalories * 0.10), protein: Math.round(protein * 0.10) }
      ]
    }
  };
  
  // Clone Monday for other days with slight variations
  const days = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const proteins = ["Turkey", "Lean Beef", "Tofu", "White Fish", "Eggs", "Protein Shake"];
  const sides = ["Brown Rice", "Sweet Potato", "Whole Grain Pasta", "Bulgur", "Beans", "Quinoa"];
  
  days.forEach((day, index) => {
    plan[day] = {
      meals: [
        { 
          name: "Breakfast", 
          description: index % 2 === 0 ? "Protein Smoothie Bowl" : "Eggs with Whole Grain Toast", 
          calories: Math.round(dailyCalories * 0.25), 
          protein: Math.round(protein * 0.25) 
        },
        { 
          name: "Lunch", 
          description: `${proteins[index]} with ${sides[index]}`, 
          calories: Math.round(dailyCalories * 0.35), 
          protein: Math.round(protein * 0.35) 
        },
        { 
          name: "Dinner", 
          description: index % 2 === 0 ? "Lean Protein Stir Fry" : "Protein with Roasted Vegetables", 
          calories: Math.round(dailyCalories * 0.30), 
          protein: Math.round(protein * 0.30) 
        },
        { 
          name: "Snack", 
          description: index % 2 === 0 ? "Protein Bar" : "Cottage Cheese with Fruit", 
          calories: Math.round(dailyCalories * 0.10), 
          protein: Math.round(protein * 0.10) 
        }
      ]
    };
  });
  
  return plan;
};

export const generateChallenge = (user) => {
  // Generate personalized weekly challenges
  const challenges = {
    strength: [
      "Add 2.5kg to your squat this week",
      "Increase reps by 2 on your main lifts",
      "Try a new compound exercise variation"
    ],
    nutrition: [
      "Hit protein goal before 6PM for 3 days",
      "Drink 3L of water daily for a week",
      "Add a vegetable to every meal"
    ],
    recovery: [
      "Log 7+ hours of sleep 4 nights",
      "Add 10 minutes of stretching after workouts",
      "Take a complete rest day with no exercise"
    ]
  };
  
  // Select random challenge from each category
  return {
    strength: challenges.strength[Math.floor(Math.random() * challenges.strength.length)],
    nutrition: challenges.nutrition[Math.floor(Math.random() * challenges.nutrition.length)],
    recovery: challenges.recovery[Math.floor(Math.random() * challenges.recovery.length)]
  };
};

export const calculateSciencePoints = (user) => {
  if (!user.gamification) return 0;
  
  let points = 0;
  
  // 1 point for each workout logged
  if (user.workouts && user.workouts.logs) {
    points += Object.keys(user.workouts.logs).length;
  }
  
  // 0.5 points for each meal logged
  if (user.diet && user.diet.logs) {
    points += Object.keys(user.diet.logs).length * 0.5;
  }
  
  return Math.round(points);
};
