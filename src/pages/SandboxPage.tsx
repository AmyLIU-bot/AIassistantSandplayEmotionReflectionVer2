import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { SandboxCanvas3D, type PlacedObject } from "@/components/SandboxCanvas3D";
import { SandboxOnboarding } from "@/components/SandboxOnboarding";
import { ObjectBar } from "@/components/ObjectBar";
import { ChatPanel } from "@/components/ChatPanel";
import { CanvasToolbar } from "@/components/CanvasToolbar";
import { ReflectionModal } from "@/components/ReflectionModal";
import AppSidebar from "@/components/AppSidebar";
import { saveReflection } from "@/lib/reflections";
import { saveSession, getSessionById } from "@/lib/sandboxSessions";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const reflections = [
  "I notice you've placed the person near the tree — perhaps there's a part of you seeking grounding and connection with nature right now. What does that space feel like?",
  "The house sits apart from the other objects. Sometimes distance in our inner landscape reflects a need for safety, or perhaps a longing for home. What comes to mind?",
  "There's an openness in your arrangement — objects breathing, with space between them. That spaciousness might mirror a desire for clarity or peace. How does it feel to see it?",
  "The sun and the person are close together. Warmth, hope, visibility — what drew you to place them near each other?",
];

export default function SandboxPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const navigate = useNavigate();

  // Load saved session if viewing one
  const viewingSession = useMemo(
    () => (sessionId ? getSessionById(sessionId) : null),
    [sessionId]
  );
  const isViewMode = !!viewingSession;

  const [objects, setObjects] = useState<PlacedObject[]>([]);
  const [reflectionText, setReflectionText] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [finishReflection, setFinishReflection] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(!isViewMode);
  const [onboardingSignal, setOnboardingSignal] = useState<string | null>(null);
  const historyRef = useRef<PlacedObject[][]>([[]]);
  const historyIndexRef = useRef(0);

  // When entering view mode, load saved objects
  useEffect(() => {
    if (viewingSession) {
      setObjects(viewingSession.objects);
      setShowOnboarding(false);
    }
  }, [viewingSession]);

  const pushHistory = (next: PlacedObject[]) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(next);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
  };

  const handleDropNew = useCallback((type: string, image: string, x: number, y: number) => {
    if (isViewMode) return;
    setObjects((prev) => {
      const next = [...prev, { id: `${type}-${Date.now()}`, type, image, x, y, scale: 1, rotation: 0, elevation: 0 }];
      pushHistory(next);
      return next;
    });
    if (showOnboarding) setOnboardingSignal("object-placed");
  }, [isViewMode, showOnboarding]);

  const handleUpdateObject = useCallback((id: string, updates: Partial<PlacedObject>) => {
    if (isViewMode) return;
    setObjects((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...updates } : o));
      pushHistory(next);
      return next;
    });
    if (showOnboarding) setOnboardingSignal("object-moved");
  }, [isViewMode, showOnboarding]);

  const handleRemoveObject = useCallback((id: string) => {
    if (isViewMode) return;
    setObjects((prev) => {
      const next = prev.filter((o) => o.id !== id);
      pushHistory(next);
      return next;
    });
  }, [isViewMode]);

  const handleClear = useCallback(() => {
    if (isViewMode) return;
    const next: PlacedObject[] = [];
    pushHistory(next);
    setObjects(next);
    setReflectionText(null);
  }, [isViewMode]);

  const handleUndo = useCallback(() => {
    if (isViewMode) return;
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setObjects(historyRef.current[historyIndexRef.current]);
  }, [isViewMode]);

  const handleRedo = useCallback(() => {
    if (isViewMode) return;
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setObjects(historyRef.current[historyIndexRef.current]);
  }, [isViewMode]);

  const handleFinish = useCallback(() => {
    if (isViewMode) return;
    if (objects.length === 0) {
      setReflectionText("Place some objects on the canvas first — let your hands lead, and your mind will follow. 🌱");
      return;
    }
    const r = reflections[Math.floor(Math.random() * reflections.length)];
    setReflectionText(r);
    setFinishReflection(r);
    setModalOpen(true);
  }, [objects, isViewMode]);

  const handleSaveReflection = useCallback(() => {
    saveReflection({
      id: Date.now().toString(),
      text: finishReflection,
      objectCount: objects.length,
      objectTypes: objects.map((o) => o.type),
      timestamp: new Date().toISOString(),
    });
    saveSession(objects, finishReflection);
    setModalOpen(false);
    toast.success("Reflection saved to your activity!");
  }, [finishReflection, objects]);

  const handleReflect = useCallback(() => {
    if (objects.length === 0) {
      setReflectionText("Place some objects on the canvas first — let your hands lead, and your mind will follow. 🌱");
      return;
    }
    const r = reflections[Math.floor(Math.random() * reflections.length)];
    setReflectionText(r);
  }, [objects]);

  const handleBackToSandbox = () => {
    navigate("/sandbox", { replace: true });
    // Force reload to reset state cleanly
    window.location.href = "/sandbox";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />

      <div className="flex flex-1 h-full min-w-0" style={{ marginLeft: 80 }}>
        <main className="flex-1 flex flex-col min-w-0 min-h-0 p-3 gap-3 bg-secondary/30">
          {/* View mode banner */}
          {isViewMode && viewingSession && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
              <Eye className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">Viewing saved session</p>
                <p className="text-[11px] text-muted-foreground">
                  Saved on {format(new Date(viewingSession.timestamp), "MMM d, yyyy · h:mm a")} · {viewingSession.objectCount} object{viewingSession.objectCount !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs gap-1.5 shrink-0"
                onClick={handleBackToSandbox}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sandbox
              </Button>
            </div>
          )}

          <SandboxCanvas3D
            objects={objects}
            onUpdateObject={handleUpdateObject}
            onRemoveObject={handleRemoveObject}
            onDropNew={handleDropNew}
            onTerrainChanged={() => { if (showOnboarding) setOnboardingSignal("terrain-changed"); }}
          />

          {!isViewMode && (
            <>
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
            </>
          )}
        </main>

        {!isViewMode && (
          <ChatPanel onReflect={handleReflect} reflectionText={reflectionText} />
        )}
      </div>

      <ReflectionModal
        open={modalOpen}
        reflection={finishReflection}
        objectCount={objects.length}
        objectTypes={objects.map((o) => o.type)}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveReflection}
      />

      {showOnboarding && !isViewMode && (
        <SandboxOnboarding
          onComplete={() => setShowOnboarding(false)}
          signal={onboardingSignal}
        />
      )}
    </div>
  );
}
