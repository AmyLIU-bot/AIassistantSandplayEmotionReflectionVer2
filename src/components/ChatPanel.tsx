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

    // Simulated AI response
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
    <aside className="flex flex-col w-80 xl:w-96 bg-chat-bg border-l border-border shrink-0 min-h-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Reflection Space</h2>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>A safe place to explore</p>
        </div>
        <button
          onClick={onReflect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-reflect text-reflect-foreground text-xs font-medium hover:opacity-90 transition-opacity active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Reflect
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-chat-ai text-foreground rounded-bl-md"
                  : "bg-chat-user text-foreground rounded-br-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2 border border-border/50 focus-within:ring-1 focus-within:ring-ring/30 transition-shadow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Share a thought…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 disabled:opacity-30 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
