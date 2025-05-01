import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Circle, Plus, X } from "lucide-react";
import { setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getUserDoc } from "../../firebase";
import { format, addDays, subDays } from 'date-fns';

// Assuming there's a type definition needed for the nutrition data
interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DietLogger = () => {
  const { currentUser } = useAuth();
  const { userData } = useUser();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealType, setMealType] = useState("Breakfast");
  const [foodItem, setFoodItem] = useState("");
  const [calories, setCalories] = useState<number | undefined>(undefined);
  const [protein, setProtein] = useState<number | undefined>(undefined);
  const [carbs, setCarbs] = useState<number | undefined>(undefined);
  const [fat, setFat] = useState<number | undefined>(undefined);
  const [todaysMeals, setTodaysMeals] = useState<any[]>([]);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editedFoodItem, setEditedFoodItem] = useState("");
  const [editedCalories, setEditedCalories] = useState<number | undefined>(undefined);
  const [editedProtein, setEditedProtein] = useState<number | undefined>(undefined);
  const [editedCarbs, setEditedCarbs] = useState<number | undefined>(undefined);
  const [editedFat, setEditedFat] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    if (userData) {
      fetchMealsForDate(selectedDate);
    }
  }, [userData, selectedDate]);
  
  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };
  
  const fetchMealsForDate = async (date: Date) => {
    if (!userData) return;
    
    const formattedDate = formatDate(date);
    const dietLogs = userData.diet?.logs || {};
    const mealsForDate = dietLogs[formattedDate] || [];
    setTodaysMeals(mealsForDate);
  };
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodItem || !calories || !protein || !carbs || !fat) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    const newMeal = {
      id: Date.now().toString(),
      type: mealType,
      foodItem,
      calories,
      protein,
      carbs,
      fat,
    };
    
    const formattedDate = formatDate(selectedDate);
    const userDocRef = getUserDoc(currentUser?.uid);
    const dietLogsPath = `diet.logs.${formattedDate}`;
    
    try {
      await updateDoc(userDocRef, {
        [dietLogsPath]: arrayUnion(newMeal),
      });
      
      setFoodItem("");
      setCalories(undefined);
      setProtein(undefined);
      setCarbs(undefined);
      setFat(undefined);
      
      await fetchMealsForDate(selectedDate);
      
      toast({
        title: "Success",
        description: "Meal logged successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
      console.error("Diet log error:", error);
    }
  };
  
  const handleEditMeal = (meal: any) => {
    setEditingMealId(meal.id);
    setEditedFoodItem(meal.foodItem);
    setEditedCalories(meal.calories);
    setEditedProtein(meal.protein);
    setEditedCarbs(meal.carbs);
    setEditedFat(meal.fat);
  };
  
  const handleUpdateMeal = async () => {
    if (!editedFoodItem || !editedCalories || !editedProtein || !editedCarbs || !editedFat) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedMeal = {
      id: editingMealId,
      type: mealType,
      foodItem: editedFoodItem,
      calories: editedCalories,
      protein: editedProtein,
      carbs: editedCarbs,
      fat: editedFat,
    };
    
    const formattedDate = formatDate(selectedDate);
    const userDocRef = getUserDoc(currentUser?.uid);
    const dietLogsPath = `diet.logs.${formattedDate}`;
    
    try {
      // Remove the old meal and add the updated meal
      await updateDoc(userDocRef, {
        [dietLogsPath]: arrayRemove(...todaysMeals.filter((meal: any) => meal.id === editingMealId)),
      });
      
      await updateDoc(userDocRef, {
        [dietLogsPath]: arrayUnion(updatedMeal),
      });
      
      setEditingMealId(null);
      setEditedFoodItem("");
      setEditedCalories(undefined);
      setEditedProtein(undefined);
      setEditedCarbs(undefined);
      setEditedFat(undefined);
      
      await fetchMealsForDate(selectedDate);
      
      toast({
        title: "Success",
        description: "Meal updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update meal. Please try again.",
        variant: "destructive",
      });
      console.error("Diet update error:", error);
    }
  };
  
  const handleDeleteMeal = async (mealId: string) => {
    const formattedDate = formatDate(selectedDate);
    const userDocRef = getUserDoc(currentUser?.uid);
    const dietLogsPath = `diet.logs.${formattedDate}`;
    
    try {
      await updateDoc(userDocRef, {
        [dietLogsPath]: arrayRemove(...todaysMeals.filter((meal: any) => meal.id === mealId)),
      });
      
      await fetchMealsForDate(selectedDate);
      
      toast({
        title: "Success",
        description: "Meal deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
      console.error("Diet delete error:", error);
    }
  };
  
  const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal?.calories as number || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal?.protein as number || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + (meal?.carbs as number || 0), 0);
  const totalFat = todaysMeals.reduce((sum, meal) => sum + (meal?.fat as number || 0), 0);
  
  return (
    <div>
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Button size="sm" onClick={() => handleDateChange(subDays(selectedDate, 1))}>
          Previous
        </Button>
        <h2 className="text-lg font-semibold">{format(selectedDate, 'MMMM dd, yyyy')}</h2>
        <Button size="sm" onClick={() => handleDateChange(addDays(selectedDate, 1))}>
          Next
        </Button>
      </div>
      
      <Card>
        <CardContent>
          <form onSubmit={handleLogMeal} className="grid gap-4">
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="text"
              placeholder="Food item"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
            />
            
            <div className="grid grid-cols-4 gap-2">
              <Input
                type="number"
                placeholder="Calories"
                value={calories === undefined ? "" : calories.toString()}
                onChange={(e) => setCalories(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Protein"
                value={protein === undefined ? "" : protein.toString()}
                onChange={(e) => setProtein(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Carbs"
                value={carbs === undefined ? "" : carbs.toString()}
                onChange={(e) => setCarbs(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Fat"
                value={fat === undefined ? "" : fat.toString()}
                onChange={(e) => setFat(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
            </div>
            
            <Button type="submit">Log Meal</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Today's Meals</h3>
          
          {todaysMeals.length === 0 ? (
            <p>No meals logged for today.</p>
          ) : (
            <div className="space-y-4">
              {todaysMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <p className="font-medium">{meal.foodItem} ({meal.type})</p>
                    <p className="text-sm text-gray-500">
                      {meal.calories} calories, {meal.protein}g protein, {meal.carbs}g carbs, {meal.fat}g fat
                    </p>
                  </div>
                  
                  <div>
                    {editingMealId === meal.id ? (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={handleUpdateMeal}>
                          Update
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMealId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEditMeal(meal)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteMeal(meal.id)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {editingMealId && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Edit Meal</h4>
              <div className="grid gap-4">
                <Input
                  type="text"
                  placeholder="Food item"
                  value={editedFoodItem}
                  onChange={(e) => setEditedFoodItem(e.target.value)}
                />
                
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={editedCalories === undefined ? "" : editedCalories.toString()}
                    onChange={(e) => setEditedCalories(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Protein"
                    value={editedProtein === undefined ? "" : editedProtein.toString()}
                    onChange={(e) => setEditedProtein(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Carbs"
                    value={editedCarbs === undefined ? "" : editedCarbs.toString()}
                    onChange={(e) => setEditedCarbs(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Fat"
                    value={editedFat === undefined ? "" : editedFat.toString()}
                    onChange={(e) => setEditedFat(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Daily Totals</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Calories</Label>
              <p>{totalCalories}</p>
            </div>
            <div>
              <Label>Protein</Label>
              <p>{totalProtein}g</p>
            </div>
            <div>
              <Label>Carbs</Label>
              <p>{totalCarbs}g</p>
            </div>
            <div>
              <Label>Fat</Label>
              <p>{totalFat}g</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietLogger;
