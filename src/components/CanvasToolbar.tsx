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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="gap-1.5 text-muted-foreground"
      >
        <Undo2 size={14} />
        <span className="hidden sm:inline text-xs">Undo</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="gap-1.5 text-muted-foreground"
      >
        <Redo2 size={14} />
        <span className="hidden sm:inline text-xs">Redo</span>
      </Button>

      <div className="w-px h-5 bg-border/50 mx-1" />

      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        disabled={!hasObjects}
        className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
      >
        <Trash2 size={14} />
        <span className="hidden sm:inline text-xs">Clear All</span>
      </Button>

      <div className="flex-1" />

      <Button
        size="sm"
        onClick={onFinish}
        className="gap-1.5"
      >
        <CheckCircle2 size={14} />
        <span className="text-xs">Finish</span>
      </Button>
    </div>
  );
}
