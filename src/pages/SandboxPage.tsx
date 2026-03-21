import { useState, useCallback, useRef } from "react";
import { ObjectBar } from "@/components/ObjectBar";
import { ChatPanel } from "@/components/ChatPanel";
import { CanvasToolbar } from "@/components/CanvasToolbar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface PlacedObject {
  id: string;
  type: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
}

const reflections = [
  "I notice you've placed the person near the tree — perhaps there's a part of you seeking grounding and connection with nature right now. What does that space feel like?",
  "The house sits apart from the other objects. Sometimes distance in our inner landscape reflects a need for safety, or perhaps a longing for home. What comes to mind?",
  "There's an openness in your arrangement — objects breathing, with space between them. That spaciousness might mirror a desire for clarity or peace. How does it feel to see it?",
  "The sun and the person are close together. Warmth, hope, visibility — what drew you to place them near each other?",
];

export default function SandboxPage() {
  const [objects, setObjects] = useState<PlacedObject[]>([]);
  const [reflectionText, setReflectionText] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<PlacedObject[][]>([[]]);
  const historyIndexRef = useRef(0);
  const navigate = useNavigate();

  const pushHistory = (next: PlacedObject[]) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(next);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    try {
      const parsed = JSON.parse(data);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (parsed.isNew) {
        setObjects((prev) => {
          const next = [...prev, { id: `${parsed.type}-${Date.now()}`, type: parsed.type, emoji: parsed.image, x, y, scale: 1 }];
          pushHistory(next);
          return next;
        });
      }
    } catch {}
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

  const handleObjectMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingId(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const obj = objects.find(o => o.id === id);
    if (!obj) return;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setObjects(prev => prev.map(o => o.id === id ? { ...o, x: obj.x + dx, y: obj.y + dy } : o));
    };
    const onUp = () => {
      setDraggingId(null);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setObjects(prev => {
        pushHistory(prev);
        return prev;
      });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-card/80 border-b border-border/40">
        <button onClick={() => navigate("/home")} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">Sandbox Canvas</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Object Bar */}
        <div className="w-44 shrink-0">
          <ObjectBar />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col">
          <CanvasToolbar
            onClear={handleClear}
            onFinish={handleFinish}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndexRef.current > 0}
            canRedo={historyIndexRef.current < historyRef.current.length - 1}
            hasObjects={objects.length > 0}
          />
          <div
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex-1 relative overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, hsl(38, 45%, 88%) 0%, transparent 60%),
                radial-gradient(circle at 70% 60%, hsl(35, 35%, 85%) 0%, transparent 60%),
                hsl(38, 40%, 86%)
              `,
            }}
          >
            {/* Grid dots */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, hsl(35, 35%, 70%) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />

            {/* Placed objects */}
            {objects.map((obj) => (
              <div
                key={obj.id}
                onMouseDown={(e) => handleObjectMouseDown(obj.id, e)}
                className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow ${
                  draggingId === obj.id ? "z-50 drop-shadow-lg" : "z-10"
                }`}
                style={{
                  left: obj.x - 20,
                  top: obj.y - 20,
                  transform: `scale(${obj.scale})`,
                }}
              >
                <span className="text-4xl">{obj.emoji}</span>
              </div>
            ))}

            {objects.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground/50 text-sm">Drag objects from the left panel onto the canvas</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-72 shrink-0">
          <ChatPanel onReflect={handleReflect} reflectionText={reflectionText} />
        </div>
      </div>
    </div>
  );
}
