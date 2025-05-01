
import { useUser } from "../../contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const WeightChart = () => {
  const { userData, logWeight } = useUser();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  if (!userData) return null;
  
  const weightEntries = userData.progress?.weightEntries || {};
  const weightChange = userData.progress?.weightChange || "No data";
  
  // Convert to array for chart
  const chartData = Object.keys(weightEntries).map(date => ({
    date: date,
    weight: weightEntries[date]
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) {
      toast({
        title: "Missing information",
        description: "Please enter your weight",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await logWeight(parseFloat(weight), date);
      toast({
        title: "Weight logged",
        description: "Your weight has been recorded successfully",
      });
      setOpen(false);
      setWeight("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log weight",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Weight Progress</CardTitle>
            <CardDescription>
              Weekly change: <span className={weightChange.startsWith("-") ? "text-green-600" : weightChange.startsWith("+") || weightChange.startsWith("0") ? "text-blue-600" : "text-gray-600"}>{weightChange}</span>
            </CardDescription>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Log Weight</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Your Weight</DialogTitle>
                <DialogDescription>
                  Track your progress by logging your weight regularly.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Weight"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="h-[200px]">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(weight) => `${weight}kg`}
              />
              <Tooltip 
                formatter={(value) => [`${value}kg`, "Weight"]}
                labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#2563eb" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p className="mb-2">Not enough data to display chart</p>
            <p className="text-sm">Log your weight to track progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightChart;
