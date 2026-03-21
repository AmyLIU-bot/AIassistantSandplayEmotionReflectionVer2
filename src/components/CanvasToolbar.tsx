import { Undo2, Redo2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasToolbarProps {
  onClear: () => void;
  onFinish: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasObjects: boolean;
}

export function CanvasToolbar({
  onClear,
  onFinish,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasObjects,
}: CanvasToolbarProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-card/80 backdrop-blur-sm border-b border-border/40">
      <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="h-8 px-2">
        <Undo2 className="w-4 h-4" />
        <span className="text-xs ml-1">Undo</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="h-8 px-2">
        <Redo2 className="w-4 h-4" />
        <span className="text-xs ml-1">Redo</span>
      </Button>
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={onClear} disabled={!hasObjects} className="h-8 px-2 text-destructive hover:text-destructive">
        <Trash2 className="w-4 h-4" />
        <span className="text-xs ml-1">Clear All</span>
      </Button>
      <Button size="sm" onClick={onFinish} disabled={!hasObjects} className="h-8 px-3 bg-primary text-primary-foreground">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-xs ml-1">Finish</span>
      </Button>
    </div>
  );
}
