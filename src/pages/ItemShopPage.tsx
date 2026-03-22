import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const categories = [
  {
    id: "people",
    label: "People",
    items: [
      { id: "p1", name: "Grandmother", price: 120, image: "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?w=300&h=300&fit=crop" },
      { id: "p2", name: "Athlete", price: 150, image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=300&h=300&fit=crop" },
      { id: "p3", name: "Baby", price: 100, image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop" },
      { id: "p4", name: "Artist", price: 130, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=300&fit=crop" },
      { id: "p5", name: "Teacher", price: 130, image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&h=300&fit=crop" },
      { id: "p6", name: "Musician", price: 140, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop" },
    ] as ShopItem[],
  },
  {
    id: "nature",
    label: "Nature",
    items: [
      { id: "n1", name: "Willow Tree", price: 180, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300&h=300&fit=crop" },
      { id: "n2", name: "Cactus", price: 80, image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=300&h=300&fit=crop" },
      { id: "n3", name: "Rose Bush", price: 110, image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=300&h=300&fit=crop" },
      { id: "n4", name: "Waterfall", price: 250, image: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8b86?w=300&h=300&fit=crop" },
      { id: "n5", name: "Bamboo", price: 90, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=300&fit=crop" },
      { id: "n6", name: "Sunflower", price: 70, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&h=300&fit=crop" },
    ] as ShopItem[],
  },
  {
    id: "buildings",
    label: "Buildings",
    items: [
      { id: "b1", name: "Lighthouse", price: 300, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
      { id: "b2", name: "Castle", price: 450, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop" },
      { id: "b3", name: "Windmill", price: 280, image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&h=300&fit=crop" },
      { id: "b4", name: "Cottage", price: 220, image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=300&h=300&fit=crop" },
      { id: "b5", name: "Temple", price: 350, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=300&fit=crop" },
      { id: "b6", name: "Treehouse", price: 400, image: "https://images.unsplash.com/photo-1520637836993-a071674e2815?w=300&h=300&fit=crop" },
    ] as ShopItem[],
  },
  {
    id: "furniture",
    label: "Furniture",
    items: [
      { id: "f1", name: "Rocking Chair", price: 90, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop" },
      { id: "f2", name: "Garden Swing", price: 160, image: "https://images.unsplash.com/photo-1501004318855-e5ef363c0de0?w=300&h=300&fit=crop" },
      { id: "f3", name: "Stone Fountain", price: 280, image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&h=300&fit=crop" },
      { id: "f4", name: "Picnic Table", price: 110, image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=300&h=300&fit=crop" },
      { id: "f5", name: "Hammock", price: 130, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=300&fit=crop" },
      { id: "f6", name: "Fire Pit", price: 200, image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=300&h=300&fit=crop" },
    ] as ShopItem[],
  },
  {
    id: "animals",
    label: "Animals",
    items: [
      { id: "a1", name: "Owl", price: 170, image: "https://images.unsplash.com/photo-1543549790-f07e6db39c3c?w=300&h=300&fit=crop" },
      { id: "a2", name: "Fox", price: 190, image: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=300&h=300&fit=crop" },
      { id: "a3", name: "Deer", price: 200, image: "https://images.unsplash.com/photo-1484406743952-2cee44a0eb0e?w=300&h=300&fit=crop" },
      { id: "a4", name: "Dolphin", price: 250, image: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=300&h=300&fit=crop" },
      { id: "a5", name: "Horse", price: 220, image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=300&h=300&fit=crop" },
      { id: "a6", name: "Peacock", price: 180, image: "https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?w=300&h=300&fit=crop" },
    ] as ShopItem[],
  },
  {
    id: "special",
    label: "Special",
    items: [
      { id: "s1", name: "Crystal Orb", price: 500, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop" },
      { id: "s2", name: "Wishing Well", price: 350, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop" },
      { id: "s3", name: "Enchanted Gate", price: 600, image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=300&h=300&fit=crop" },
      { id: "s4", name: "Spirit Lantern", price: 400, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
      { id: "s5", name: "Dream Catcher", price: 280, image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=300&h=300&fit=crop" },
      { id: "s6", name: "Aurora Stone", price: 550, image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=300&fit=crop" },
    ] as ShopItem[],
  },
];

export default function ItemShopPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  const handleBuy = (item: ShopItem) => {
    setPurchased((prev) => new Set(prev).add(item.id));
    toast.success(`${item.name} added to your collection!`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />

      <div className="flex flex-1 h-full min-w-0" style={{ marginLeft: 80 }}>
        <main className="flex-1 flex flex-col min-w-0 min-h-0 p-6 gap-5 bg-secondary/30 overflow-y-auto">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Item Shop</h1>
            </div>
            <p className="text-sm text-muted-foreground pl-[46px]">
              Browse and collect new items for your sandbox.
            </p>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground border border-border/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentCategory.items.map((item) => {
              const owned = purchased.has(item.id);
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-card/80 backdrop-blur-sm border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-muted/30 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {owned && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">
                        {item.price} coins
                      </span>
                      <Button
                        size="sm"
                        variant={owned ? "outline" : "default"}
                        disabled={owned}
                        onClick={() => handleBuy(item)}
                        className="h-7 px-3 text-[11px] rounded-lg"
                      >
                        {owned ? "Owned" : "Buy"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
