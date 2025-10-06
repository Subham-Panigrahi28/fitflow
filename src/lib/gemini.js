generateResponse(
  {
    name: "Subham",
    age: 22,
    height: 170,
    weight: 68,
    goal: "Cutting",
    calculated: { dailyCalorieTarget: 2200, macros: { protein: 150, carbs: 180, fat: 60 } },
    progress: { weightChange: "-0.5kg" },
    workoutSplit: "Push/Pull/Legs",
    gamification: { streak: 5 },
  },
  "Coach, what's the best time to take protein after workout?"
).then(console.log);
