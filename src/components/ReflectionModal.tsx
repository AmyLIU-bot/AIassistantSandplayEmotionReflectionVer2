import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ReflectionRecord {
  id: string;
  text: string;
  objectCount: number;
  objectTypes: string[];
  timestamp: string;
}

interface ReflectionModalProps {
  open: boolean;
  reflection: string;
  objectCount: number;
  objectTypes: string[];
  onClose: () => void;
  onSave: () => void;
}

export function ReflectionModal({
  open,
  reflection,
  objectCount,
  objectTypes,
  onClose,
  onSave,
}: ReflectionModalProps) {
  if (!open) return null;

  const uniqueTypes = [...new Set(objectTypes)];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90vw] max-w-md rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    Reflection Report
                  </h3>
                  <p className="text-xs text-muted-foreground">Your sandbox session</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session summary */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  {objectCount} object{objectCount !== 1 ? "s" : ""} placed
                </span>
                {uniqueTypes.length > 0 && (
                  <>
                    <span className="w-px h-3 bg-border" />
                    <span className="truncate">{uniqueTypes.slice(0, 4).join(", ")}{uniqueTypes.length > 4 ? "…" : ""}</span>
                  </>
                )}
              </div>
            </div>

            {/* Reflection text */}
            <div className="mx-5 mb-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <p className="text-sm leading-relaxed text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                {reflection}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-5 pb-5">
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1 text-xs">
                Dismiss
              </Button>
              <Button size="sm" onClick={onSave} className="flex-1 text-xs gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Save to Activity
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
