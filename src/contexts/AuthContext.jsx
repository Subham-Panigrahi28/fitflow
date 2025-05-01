
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, getUserDoc, usersCol } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { setDoc, getDoc } from 'firebase/firestore';
import { calculateTDEE } from '../lib/calculations';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authReady, setAuthReady] = useState(false);

  const signup = async (email, password, profileData) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create initial user profile
      const user = userCredential.user;
      
      // Calculate TDEE and other metrics
      const calculated = calculateTDEE(profileData);
      
      // Initialize default workout split
      const workoutSplit = "Full Body";
      
      // Set user doc with profile data
      await setDoc(getUserDoc(user.uid), {
        profile: {
          ...profileData,
          calculated,
          email
        },
        workouts: {
          plan: {
            split: workoutSplit
          },
          logs: {}
        },
        diet: {
          plan: {},
          logs: {}
        },
        progress: {
          weightEntries: {
            [new Date().toISOString().split('T')[0]]: profileData.weight
          },
          weightChange: "No data"
        },
        gamification: {
          streak: { current: 1, longest: 1 },
          challenges: [],
          unlockedContent: [],
          lastActive: new Date().toISOString().split('T')[0],
          sciencePoints: 0
        }
      });
      
      return user;
    } catch (err) {
      console.error("Signup error:", err);
      setError(`Failed to create account: ${err.message}`);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update streak
      const userDoc = await getDoc(getUserDoc(userCredential.user.uid));
      const userData = userDoc.data();
      
      if (userData) {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = userData.gamification?.lastActive || today;
        const lastActiveDate = new Date(lastActive);
        const todayDate = new Date(today);
        
        // Calculate days difference
        const diffTime = todayDate - lastActiveDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Update streak
        if (diffDays === 1) {
          // Consecutive day login
          const currentStreak = userData.gamification.streak.current + 1;
          const longestStreak = Math.max(currentStreak, userData.gamification.streak.longest);
          
          await setDoc(getUserDoc(userCredential.user.uid), {
            ...userData,
            gamification: {
              ...userData.gamification,
              streak: {
                current: currentStreak,
                longest: longestStreak
              },
              lastActive: today
            }
          });
        } else if (diffDays > 1) {
          // Streak broken
          await setDoc(getUserDoc(userCredential.user.uid), {
            ...userData,
            gamification: {
              ...userData.gamification,
              streak: {
                ...userData.gamification.streak,
                current: 1
              },
              lastActive: today
            }
          });
        }
      }
      
      return userCredential.user;
    } catch (err) {
      console.error("Login error:", err);
      setError(`Failed to log in: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth)
      .catch(err => {
        console.error("Logout error:", err);
        setError(`Failed to log out: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setAuthReady(true);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    authReady,
    signup,
    login,
    logout,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {authReady ? children : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium">Initializing app...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
}
