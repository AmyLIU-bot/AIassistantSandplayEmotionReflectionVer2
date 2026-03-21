import { useState, useCallback, useRef } from "react";
import { SandboxCanvas3D, type PlacedObject } from "@/components/SandboxCanvas3D";
import { ObjectBar } from "@/components/ObjectBar";
import { ChatPanel } from "@/components/ChatPanel";
import { CanvasToolbar } from "@/components/CanvasToolbar";
import { SandboxSidebar } from "@/components/SandboxSidebar";

const reflections = [
  "I notice you've placed the person near the tree — perhaps there's a part of you seeking grounding and connection with nature right now. What does that space feel like?",
  "The house sits apart from the other objects. Sometimes distance in our inner landscape reflects a need for safety, or perhaps a longing for home. What comes to mind?",
  "There's an openness in your arrangement — objects breathing, with space between them. That spaciousness might mirror a desire for clarity or peace. How does it feel to see it?",
  "The sun and the person are close together. Warmth, hope, visibility — what drew you to place them near each other?",
];

export default function SandboxPage() {
  const [objects, setObjects] = useState<PlacedObject[]>([]);
  const [reflectionText, setReflectionText] = useState<string | null>(null);
  const historyRef = useRef<PlacedObject[][]>([[]]);
  const historyIndexRef = useRef(0);

  const pushHistory = (next: PlacedObject[]) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(next);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
  };

  const handleDropNew = useCallback((type: string, image: string, x: number, y: number) => {
    setObjects((prev) => {
      const next = [...prev, { id: `${type}-${Date.now()}`, type, image, x, y, scale: 1, rotation: 0, elevation: 0 }];
      pushHistory(next);
      return next;
    });
  }, []);

  const handleUpdateObject = useCallback((id: string, updates: Partial<PlacedObject>) => {
    setObjects((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...updates } : o));
      pushHistory(next);
      return next;
    });
  }, []);

  const handleRemoveObject = useCallback((id: string) => {
    setObjects((prev) => {
      const next = prev.filter((o) => o.id !== id);
      pushHistory(next);
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    const next: PlacedObject[] = [];
    pushHistory(next);
    setObjects(next);
    setReflectionText(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setObjects(historyRef.current[historyIndexRef.current]);
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setObjects(historyRef.current[historyIndexRef.current]);
  }, []);

  const handleFinish = useCallback(() => {
    if (objects.length === 0) {
      setReflectionText("Place some objects on the canvas first — let your hands lead, and your mind will follow. 🌱");
      return;
    }
    const r = reflections[Math.floor(Math.random() * reflections.length)];
    setReflectionText(r);
  }, [objects]);

  const handleReflect = useCallback(() => {
    if (objects.length === 0) {
      setReflectionText("Place some objects on the canvas first — let your hands lead, and your mind will follow. 🌱");
      return;
    }
    const r = reflections[Math.floor(Math.random() * reflections.length)];
    setReflectionText(r);
  }, [objects]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SandboxSidebar />

      {/* Center */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 p-3 gap-3 bg-secondary/30">
        <SandboxCanvas3D
          objects={objects}
          onUpdateObject={handleUpdateObject}
          onRemoveObject={handleRemoveObject}
          onDropNew={handleDropNew}
        />
        <CanvasToolbar
          onClear={handleClear}
          onFinish={handleFinish}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndexRef.current > 0}
          canRedo={historyIndexRef.current < historyRef.current.length - 1}
          hasObjects={objects.length > 0}
        />
        <ObjectBar />
      </main>

      <ChatPanel onReflect={handleReflect} reflectionText={reflectionText} />
    </div>
  );
}
