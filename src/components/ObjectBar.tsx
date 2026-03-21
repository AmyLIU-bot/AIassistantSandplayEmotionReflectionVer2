import React, { useState } from "react";

// People
import personImg from "@/assets/objects/people/person.png";
import womanImg from "@/assets/objects/people/woman.png";
import childImg from "@/assets/objects/people/child.png";
import elderImg from "@/assets/objects/people/elder.png";

// Nature
import treeImg from "@/assets/objects/nature/tree.png";
import flowerImg from "@/assets/objects/nature/flower.png";
import mountainImg from "@/assets/objects/nature/mountain.png";
import seedlingImg from "@/assets/objects/nature/seedling.png";

// Places
import houseImg from "@/assets/objects/places/house.png";
import schoolImg from "@/assets/objects/places/school.png";
import bridgeImg from "@/assets/objects/places/bridge.png";

// Items
import benchImg from "@/assets/objects/items/bench.png";
import keyImg from "@/assets/objects/items/key.png";
import bookImg from "@/assets/objects/items/book.png";
import candleImg from "@/assets/objects/items/candle.png";

// Weather
import sunImg from "@/assets/objects/weather/sun.png";
import cloudImg from "@/assets/objects/weather/cloud.png";
import rainbowImg from "@/assets/objects/weather/rainbow.png";
import moonImg from "@/assets/objects/weather/moon.png";

// Animals
import dogImg from "@/assets/objects/animals/dog.png";
import catImg from "@/assets/objects/animals/cat.png";
import birdImg from "@/assets/objects/animals/bird.png";
import butterflyImg from "@/assets/objects/animals/butterfly.png";

// Feelings
import heartImg from "@/assets/objects/feelings/heart.png";
import brokenHeartImg from "@/assets/objects/feelings/broken-heart.png";
import starImg from "@/assets/objects/feelings/star.png";
import tearImg from "@/assets/objects/feelings/tear.png";

interface ObjectItem {
  type: string;
  image: string;
}

interface Category {
  name: string;
  icon: string;
  items: ObjectItem[];
}

const categories: Category[] = [
  {
    name: "People",
    icon: personImg,
    items: [
      { type: "Person", image: personImg },
      { type: "Woman", image: womanImg },
      { type: "Child", image: childImg },
      { type: "Elder", image: elderImg },
    ],
  },
  {
    name: "Nature",
    icon: treeImg,
    items: [
      { type: "Tree", image: treeImg },
      { type: "Flower", image: flowerImg },
      { type: "Mountain", image: mountainImg },
      { type: "Seedling", image: seedlingImg },
    ],
  },
  {
    name: "Places",
    icon: houseImg,
    items: [
      { type: "House", image: houseImg },
      { type: "School", image: schoolImg },
      { type: "Bridge", image: bridgeImg },
    ],
  },
  {
    name: "Objects",
    icon: benchImg,
    items: [
      { type: "Bench", image: benchImg },
      { type: "Key", image: keyImg },
      { type: "Book", image: bookImg },
      { type: "Candle", image: candleImg },
    ],
  },
  {
    name: "Weather",
    icon: sunImg,
    items: [
      { type: "Sun", image: sunImg },
      { type: "Cloud", image: cloudImg },
      { type: "Rainbow", image: rainbowImg },
      { type: "Moon", image: moonImg },
    ],
  },
  {
    name: "Animals",
    icon: dogImg,
    items: [
      { type: "Dog", image: dogImg },
      { type: "Cat", image: catImg },
      { type: "Bird", image: birdImg },
      { type: "Butterfly", image: butterflyImg },
    ],
  },
  {
    name: "Feelings",
    icon: heartImg,
    items: [
      { type: "Heart", image: heartImg },
      { type: "Broken Heart", image: brokenHeartImg },
      { type: "Star", image: starImg },
      { type: "Tear", image: tearImg },
    ],
  },
];

export function ObjectBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, type: string, image: string) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type, image, isNew: true })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const activeItems = categories.find((c) => c.name === activeCategory)?.items ?? [];

  return (
    <div className="relative flex flex-col gap-0">
      {/* Expanded items panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          activeCategory ? "max-h-28 opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
        }`}
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/40 shadow-sm">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mr-1 shrink-0">
            {activeCategory}
          </span>
          <div className="w-px h-6 bg-border/40" />
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {activeItems.map(({ type, image }) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type, image)}
                className="flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing group shrink-0"
              >
                <div className="w-12 h-12 rounded-lg bg-white/80 shadow-sm hover:shadow-md border border-border/30 flex items-center justify-center transition-all duration-150 active:scale-90 hover:-translate-y-0.5 p-1">
                  <img src={image} alt={type} className="w-full h-full object-contain" draggable={false} />
                </div>
                <span className="text-[9px] text-muted-foreground/70 group-hover:text-foreground transition-colors whitespace-nowrap">
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1 px-4 py-2 bg-object-bar rounded-xl border border-border/50">
        <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:block shrink-0">
          Categories
        </span>
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            onMouseEnter={() => setActiveCategory(name)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-150 active:scale-95 ${
              activeCategory === name
                ? "bg-primary/10 shadow-sm"
                : "hover:bg-card/60"
            }`}
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <img src={icon} alt={name} className="w-full h-full object-contain" />
            </div>
            <span
              className={`text-[9px] transition-colors ${
                activeCategory === name
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
