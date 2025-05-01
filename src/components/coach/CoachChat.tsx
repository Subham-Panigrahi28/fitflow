
import { useState, useRef, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { generateResponse } from "../../lib/gemini";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

const CoachChat = () => {
  const { userData } = useUser();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate a welcome message when the component mounts
  useEffect(() => {
    if (userData && messages.length === 0) {
      const profile = userData.profile || {};
      const firstName = profile.name?.split(' ')[0] || "there";
      
      setMessages([
        {
          id: "welcome",
          sender: "coach",
          text: `Hello ${firstName}! I'm your AI Fitness Coach. I'm here to help you achieve your ${profile.goal?.toLowerCase() || "fitness"} goals with science-backed advice. What fitness questions can I answer for you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [userData]);
  
  // Scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !userData) return;
    
    const userMessage = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: message,
      timestamp: new Date()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage("");
    setLoading(true);
    
    try {
      // Prepare user context for the AI
      const profile = userData.profile || {};
      const workoutSplit = userData.workouts?.plan?.split || "Full Body";
      
      const userContext = {
        name: profile.name || "User",
        age: profile.age || 30,
        height: profile.height || 175,
        weight: profile.weight || 75,
        goal: profile.goal || "Maintenance",
        calculated: profile.calculated || {
          dailyCalorieTarget: 2000,
          macros: { protein: 150, carbs: 200, fat: 65 }
        },
        progress: {
          weightChange: userData.progress?.weightChange || "No data"
        },
        workoutSplit,
        gamification: userData.gamification || { streak: 0 }
      };
      
      const response = await generateResponse(userContext, userMessage.text);
      
      // Process the AI response - add line breaks for markdown content
      const formattedResponse = response.replace(/\n\n/g, "\n");
      
      const coachMessage = {
        id: (Date.now() + 1).toString(),
        sender: "coach" as const,
        text: formattedResponse,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, coachMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to get response from coach. Please try again.",
        variant: "destructive",
      });
      console.error("AI Coach error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[700px] max-h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                msg.sender === "user"
                  ? "flex-row-reverse items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  msg.sender === "user"
                    ? "bg-blue-600 ml-2"
                    : "bg-green-600 mr-2"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              <Card
                className={`${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                <CardContent className="p-3 whitespace-pre-line">
                  {msg.text}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 mr-2">
                <Bot className="h-4 w-4 text-white" />
              </div>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Coach is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            placeholder="Ask your fitness coach a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !message.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CoachChat;
