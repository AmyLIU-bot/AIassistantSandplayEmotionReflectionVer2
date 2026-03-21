import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface ChatPanelProps {
  onReflect: () => void;
  reflectionText: string | null;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Welcome to your reflective space. Place some objects on the canvas — wherever feels right — and when you're ready, press Reflect. I'll share what I notice. 🌿",
  },
];

export function ChatPanel({ onReflect, reflectionText }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reflectionText) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "ai", content: reflectionText },
      ]);
    }
  }, [reflectionText]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content:
            "Thank you for sharing. I hear you — take a moment to sit with that feeling. There's no rush here. 💛",
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg border-l border-border/60">
      {/* Header */}
      <div className="p-3 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">Reflection Chat</h3>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl text-sm leading-relaxed ${
              m.role === "ai"
                ? "bg-chat-ai text-foreground"
                : "bg-chat-user text-foreground ml-4"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Reflect button */}
      <div className="px-3 py-2">
        <button
          onClick={onReflect}
          className="w-full py-2 rounded-xl bg-reflect text-reflect-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          Reflect
        </button>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/40 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Share your thoughts..."
          className="flex-1 px-3 py-2 text-sm rounded-xl bg-background border border-border/60 outline-none focus:ring-1 focus:ring-primary/30 text-foreground"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
