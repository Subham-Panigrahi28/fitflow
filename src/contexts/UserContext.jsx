
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc } from '../firebase';
import { getDoc, setDoc } from 'firebase/firestore';
import { 
  calculateTDEE,
  calculateWeightChange,
  generateWorkoutPlan,
  generateDietPlan,
  generateChallenge,
  calculateSciencePoints
} from '../lib/calculations';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!currentUser) return;

    try {
      // Calculate new TDEE based on updated profile
      const calculated = calculateTDEE(profileData);
      
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Update profile data
      const updatedData = {
        ...currentData,
        profile: {
          ...profileData,
          calculated
        }
      };
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Log weight entry
  const logWeight = async (weight, date = new Date().toISOString().split('T')[0]) => {
    if (!currentUser) return;

    try {
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Update weight entries
      const weightEntries = {
        ...currentData.progress.weightEntries,
        [date]: parseFloat(weight)
      };
      
      // Calculate weight change
      const weightChange = calculateWeightChange(weightEntries);
      
      const updatedData = {
        ...currentData,
        progress: {
          ...currentData.progress,
          weightEntries,
          weightChange
        }
      };
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error logging weight:", error);
      throw error;
    }
  };

  // Log workout
  const logWorkout = async (workout) => {
    if (!currentUser) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Update workout logs
      const updatedData = {
        ...currentData,
        workouts: {
          ...currentData.workouts,
          logs: {
            ...currentData.workouts.logs,
            [today]: workout
          }
        }
      };
      
      // Update science points
      const sciencePoints = calculateSciencePoints(updatedData);
      updatedData.gamification.sciencePoints = sciencePoints;
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error logging workout:", error);
      throw error;
    }
  };

  // Log diet entry
  const logDiet = async (meal) => {
    if (!currentUser) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Get existing meals for today or initialize empty object
      const todayMeals = currentData.diet.logs[today] || {};
      
      // Update diet logs
      const updatedData = {
        ...currentData,
        diet: {
          ...currentData.diet,
          logs: {
            ...currentData.diet.logs,
            [today]: {
              ...todayMeals,
              [meal.name.toLowerCase()]: meal
            }
          }
        }
      };
      
      // Update science points
      const sciencePoints = calculateSciencePoints(updatedData);
      updatedData.gamification.sciencePoints = sciencePoints;
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error logging diet:", error);
      throw error;
    }
  };

  // Update workout plan
  const updateWorkoutPlan = async (split) => {
    if (!currentUser) return;

    try {
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Generate workout plan based on split
      const plan = generateWorkoutPlan({ ...currentData.profile, workoutSplit: split });
      
      const updatedData = {
        ...currentData,
        workouts: {
          ...currentData.workouts,
          plan: {
            ...plan,
            split
          }
        }
      };
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating workout plan:", error);
      throw error;
    }
  };

  // Update diet plan
  const updateDietPlan = async () => {
    if (!currentUser) return;

    try {
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Generate diet plan based on user profile
      const plan = generateDietPlan(currentData.profile);
      
      const updatedData = {
        ...currentData,
        diet: {
          ...currentData.diet,
          plan
        }
      };
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating diet plan:", error);
      throw error;
    }
  };

  // Generate weekly challenges
  const generateWeeklyChallenges = async () => {
    if (!currentUser) return;

    try {
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Generate challenges
      const challenges = generateChallenge(currentData);
      
      const updatedData = {
        ...currentData,
        gamification: {
          ...currentData.gamification,
          challenges
        }
      };
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error generating challenges:", error);
      throw error;
    }
  };

  // Complete a challenge
  const completeChallenge = async (challengeType) => {
    if (!currentUser) return;

    try {
      // Get current user data
      const userDoc = await getDoc(getUserDoc(currentUser.uid));
      const currentData = userDoc.data();
      
      // Mark challenge as completed
      const challenges = { ...currentData.gamification.challenges };
      challenges[`${challengeType}_completed`] = true;
      
      // Add 3 science points for completing a challenge
      const sciencePoints = (currentData.gamification.sciencePoints || 0) + 3;
      
      const updatedData = {
        ...currentData,
        gamification: {
          ...currentData.gamification,
          challenges,
          sciencePoints
        }
      };
      
      await setDoc(getUserDoc(currentUser.uid), updatedData);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error completing challenge:", error);
      throw error;
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(getUserDoc(currentUser.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // On initial mount or after login, generate plans if they don't exist
  useEffect(() => {
    const initializeUserData = async () => {
      if (!currentUser || !userData) return;
      
      // Check if workout plan exists
      if (!userData.workouts?.plan || Object.keys(userData.workouts.plan).length === 0) {
        try {
          await updateWorkoutPlan(userData.profile?.workoutSplit || "Full Body");
        } catch (error) {
          console.error("Error initializing workout plan:", error);
        }
      }
      
      // Check if diet plan exists
      if (!userData.diet?.plan || Object.keys(userData.diet.plan).length === 0) {
        try {
          await updateDietPlan();
        } catch (error) {
          console.error("Error initializing diet plan:", error);
        }
      }
      
      // Check if weekly challenges exist
      if (!userData.gamification?.challenges || Object.keys(userData.gamification.challenges).length === 0) {
        try {
          await generateWeeklyChallenges();
        } catch (error) {
          console.error("Error generating weekly challenges:", error);
        }
      }
    };
    
    initializeUserData();
  }, [currentUser, userData]);

  const value = {
    userData,
    loading,
    updateProfile,
    logWeight,
    logWorkout,
    logDiet,
    updateWorkoutPlan,
    updateDietPlan,
    generateWeeklyChallenges,
    completeChallenge
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
