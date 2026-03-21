import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Activity, Sparkles, Send, Play } from "lucide-react";

const insights = [
  { icon: TrendingUp, label: "Improving stability", detail: "Your scores have trended upward over the past 5 days.", tone: "positive" as const },
  { icon: TrendingDown, label: "Mid-month dip", detail: "A brief stress period around Mar 10–11 was followed by strong recovery.", tone: "neutral" as const },
  { icon: Activity, label: "Irregular fluctuations", detail: "Day-to-day swings suggest external stressors. Routines may help.", tone: "caution" as const },
];

const suggestions = [
  "Try a 10-minute breathing exercise before bed",
  "Journal about one thing you're grateful for",
  "Schedule a nature walk this weekend",
];

type ChatMsg = { role: "user" | "ai"; text: string };

const AIInsightsPanel = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: "Hi! I've been looking at your emotional history. Feel free to ask me anything about your trends or how to improve your well-being. 💚" },
  ]);

  const sendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "ai", text: "Thank you for sharing. Based on your recent data, I'd suggest focusing on consistency in your routines — your best days correlate with structured self-care activities." },
    ]);
    setChatInput("");
  };

  const toneColors: Record<string, string> = {
    positive: "bg-primary/10 text-primary",
    neutral: "bg-secondary text-secondary-foreground",
    caution: "bg-destructive/10 text-destructive/80",
  };

  return (
    <div className="space-y-4">
      {/* Insights */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((ins, i) => (
            <div key={i} className={`p-3 rounded-xl ${toneColors[ins.tone]}`}>
              <div className="flex items-center gap-2 mb-1">
                <ins.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{ins.label}</span>
              </div>
              <p className="text-xs opacity-80">{ins.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Supportive Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl hover:bg-accent/50 transition-colors">
              <Play className="w-3 h-3 text-primary shrink-0" />
              <span className="text-sm text-foreground">{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Talk with AI</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40 mb-3">
            <div className="space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-xl text-sm ${m.role === "ai" ? "bg-accent/50" : "bg-primary/10 ml-4"}`}>
                  <span className="text-xs font-medium text-muted-foreground">{m.role === "ai" ? "AI:" : "You:"}</span>
                  <p className="text-foreground">{m.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your emotional trends..."
              className="min-h-[40px] resize-none text-sm"
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            />
            <Button size="sm" onClick={sendMessage} className="shrink-0 h-10 w-10 p-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPanel;
