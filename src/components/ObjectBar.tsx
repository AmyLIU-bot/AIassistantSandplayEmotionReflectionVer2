import React, { useState } from "react";

interface ObjectItem {
  type: string;
  emoji: string;
}

interface Category {
  name: string;
  emoji: string;
  items: ObjectItem[];
}

const categories: Category[] = [
  {
    name: "People",
    emoji: "🧑",
    items: [
      { type: "Person", emoji: "🧑" },
      { type: "Woman", emoji: "👩" },
      { type: "Child", emoji: "🧒" },
      { type: "Elder", emoji: "🧓" },
    ],
  },
  {
    name: "Nature",
    emoji: "🌳",
    items: [
      { type: "Tree", emoji: "🌳" },
      { type: "Flower", emoji: "🌸" },
      { type: "Mountain", emoji: "⛰️" },
      { type: "Seedling", emoji: "🌱" },
    ],
  },
  {
    name: "Places",
    emoji: "🏠",
    items: [
      { type: "House", emoji: "🏠" },
      { type: "School", emoji: "🏫" },
      { type: "Bridge", emoji: "🌉" },
    ],
  },
  {
    name: "Objects",
    emoji: "🪑",
    items: [
      { type: "Bench", emoji: "🪑" },
      { type: "Key", emoji: "🔑" },
      { type: "Book", emoji: "📖" },
      { type: "Candle", emoji: "🕯️" },
    ],
  },
  {
    name: "Weather",
    emoji: "☀️",
    items: [
      { type: "Sun", emoji: "☀️" },
      { type: "Cloud", emoji: "☁️" },
      { type: "Rainbow", emoji: "🌈" },
      { type: "Moon", emoji: "🌙" },
    ],
  },
  {
    name: "Animals",
    emoji: "🐕",
    items: [
      { type: "Dog", emoji: "🐕" },
      { type: "Cat", emoji: "🐈" },
      { type: "Bird", emoji: "🐦" },
      { type: "Butterfly", emoji: "🦋" },
    ],
  },
  {
    name: "Feelings",
    emoji: "❤️",
    items: [
      { type: "Heart", emoji: "❤️" },
      { type: "Broken Heart", emoji: "💔" },
      { type: "Star", emoji: "⭐" },
      { type: "Tear", emoji: "💧" },
    ],
  },
];

export function ObjectBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, type: string, emoji: string) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type, image: emoji, isNew: true })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const activeItems = categories.find((c) => c.name === activeCategory)?.items ?? [];

  return (
    <div className="flex flex-col h-full bg-object-bar border-r border-border/60">
      {/* Expanded items panel */}
      {activeCategory && (
        <div className="border-b border-border/40 px-3 py-2">
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs text-muted-foreground hover:text-foreground mb-2 block"
          >
            ← Back
          </button>
          <p className="text-sm font-semibold text-foreground mb-2">{activeCategory}</p>
          <div className="flex flex-wrap gap-2">
            {activeItems.map(({ type, emoji }) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type, emoji)}
                className="flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing group shrink-0 p-2 rounded-lg hover:bg-card/60 transition-colors"
              >
                <span className="text-2xl select-none">{emoji}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider px-1 mb-2">Categories</p>
        {categories.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => setActiveCategory(name)}
            className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg transition-all duration-150 active:scale-95 text-left ${
              activeCategory === name
                ? "bg-primary/10 shadow-sm"
                : "hover:bg-card/60"
            }`}
          >
            <span className="text-lg">{emoji}</span>
            <span className="text-xs font-medium text-foreground">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
