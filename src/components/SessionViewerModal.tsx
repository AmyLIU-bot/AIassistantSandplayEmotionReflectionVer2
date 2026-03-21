import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SandboxSession } from "@/lib/sandboxSessions";
import { format } from "date-fns";

interface SessionViewerModalProps {
  session: SandboxSession | null;
  onClose: () => void;
}

export function SessionViewerModal({ session, onClose }: SessionViewerModalProps) {
  if (!session) return null;

  const uniqueTypes = session.objectTypes;

  return (
    <AnimatePresence>
      {session && (
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
            className="relative w-[90vw] max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {session.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(session.timestamp), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  {session.objectCount} object{session.objectCount !== 1 ? "s" : ""} placed
                </span>
                {uniqueTypes.length > 0 && (
                  <>
                    <span className="w-px h-3 bg-border" />
                    <span className="truncate">
                      {uniqueTypes.slice(0, 5).join(", ")}
                      {uniqueTypes.length > 5 ? "…" : ""}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Object arrangement visualization */}
            <div className="mx-5 mb-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-3">Object Arrangement</p>
              <div className="relative w-full aspect-[16/10] bg-background/60 rounded-lg border border-border/40 overflow-hidden">
                {session.objects.map((obj) => {
                  // Map object x/y (roughly -4 to 4 range) to percentage positions
                  const px = ((obj.x + 5) / 10) * 100;
                  const py = ((obj.y + 5) / 10) * 100;
                  return (
                    <div
                      key={obj.id}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${Math.max(4, Math.min(96, px))}%`,
                        top: `${Math.max(4, Math.min(96, py))}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
                        title={obj.type}
                      >
                        <span className="text-[8px] font-bold text-primary">
                          {obj.type.charAt(0)}
                        </span>
                      </div>
                      <span className="text-[7px] text-muted-foreground mt-0.5 whitespace-nowrap">
                        {obj.type}
                      </span>
                    </div>
                  );
                })}
                {session.objects.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    No objects
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5">
              <Button variant="outline" size="sm" onClick={onClose} className="w-full text-xs">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
