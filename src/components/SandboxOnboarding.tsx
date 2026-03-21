import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, GripHorizontal, Move, Layers, MousePointerClick, MessageCircle, CheckCircle2, Video, PanelLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "sandbox_onboarding_completed";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string;
  arrowDirection?: "down" | "up" | "left" | "right";
  waitForAction?: boolean;
  expandCutout?: { top?: number; bottom?: number; left?: number; right?: number };
}

const steps: OnboardingStep[] = [
  {
    title: "Your Sandbox",
    description: "This is your sandbox. You can place and arrange objects to express your thoughts.",
    icon: <Sparkles className="w-5 h-5" />,
    target: "canvas",
  },
  {
    title: "Object Bar",
    description: "Hover over a category icon to see available objects, then drag them into the sandbox.",
    icon: <MousePointerClick className="w-5 h-5" />,
    target: "objectbar",
    arrowDirection: "down",
    expandCutout: { top: 120 },
  },
  {
    title: "Terrain & Environment",
    description: "Change the sandbox terrain and environment here. Try different shapes and layouts.",
    icon: <Layers className="w-5 h-5" />,
    target: "terrain-selector",
    arrowDirection: "down",
  },
  {
    title: "Camera / Object Mode",
    description: "Switch between Camera mode (rotate & zoom the view) and Object mode (move & place objects).",
    icon: <Video className="w-5 h-5" />,
    target: "mode-toggle",
    arrowDirection: "left",
  },
  {
    title: "Camera Controls",
    description: "Use these buttons to zoom, rotate, tilt, and pan the camera view.",
    icon: <Camera className="w-5 h-5" />,
    target: "camera-controls",
    arrowDirection: "left",
  },
  {
    title: "Process Controls",
    description: "Undo, redo, clear all objects, or finish your session with these buttons.",
    icon: <GripHorizontal className="w-5 h-5" />,
    target: "toolbar",
  },
  {
    title: "Sidebar Navigation",
    description: "Use the sidebar to navigate between Home, Account, Sandbox, and other pages.",
    icon: <PanelLeft className="w-5 h-5" />,
    target: "sandbox-sidebar",
    arrowDirection: "right",
  },
  {
    title: "Try It Out",
    description: "Now try dragging an object from the Object Bar into the sandbox!",
    icon: <Move className="w-5 h-5" />,
    target: "objectbar-first",
    arrowDirection: "up",
    waitForAction: true,
    expandCutout: { top: 120 },
  },
  {
    title: "Reflect",
    description: "When you're ready, click Reflect to receive an AI-generated reflection.",
    icon: <MessageCircle className="w-5 h-5" />,
    target: "reflect-button",
  },
  {
    title: "You're Ready!",
    description: "You're all set to explore your own space. Have fun!",
    icon: <CheckCircle2 className="w-5 h-5" />,
    target: "canvas",
  },
];

export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

function getTooltipPosition(rect: DOMRect, viewport: { w: number; h: number }) {
  const tooltipW = 320;
  const tooltipH = 180;
  const gap = 16;

  // Try placing below
  if (rect.bottom + gap + tooltipH < viewport.h) {
    return { top: rect.bottom + gap, left: Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipW / 2, viewport.w - tooltipW - 8)) };
  }
  // Try placing above
  if (rect.top - gap - tooltipH > 0) {
    return { top: rect.top - gap - tooltipH, left: Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipW / 2, viewport.w - tooltipW - 8)) };
  }
  // Try placing to the right
  if (rect.right + gap + tooltipW < viewport.w) {
    return { top: Math.max(8, rect.top + rect.height / 2 - tooltipH / 2), left: rect.right + gap };
  }
  // Fallback: left
  return { top: Math.max(8, rect.top + rect.height / 2 - tooltipH / 2), left: Math.max(8, rect.left - gap - tooltipW) };
}

function ArrowIndicator({ from, to, direction }: { from: DOMRect; to?: DOMRect; direction?: string }) {
  if (!direction) return null;

  const cx = from.left + from.width / 2;
  const cy = from.top + from.height / 2;

  // Animated bouncing arrow
  const arrowProps = (() => {
    switch (direction) {
      case "down":
        return { x: cx, y: from.top - 12, rotation: 0 };
      case "up":
        return { x: cx, y: from.bottom + 12, rotation: 180 };
      case "left":
        return { x: from.right + 12, y: cy, rotation: 90 };
      case "right":
        return { x: from.left - 12, y: cy, rotation: -90 };
      default:
        return { x: cx, y: from.top - 12, rotation: 0 };
    }
  })();

  return (
    <motion.div
      className="fixed z-[102] pointer-events-none"
      style={{ left: arrowProps.x - 12, top: arrowProps.y - 12 }}
      animate={{
        y: direction === "down" || direction === "up" ? [0, -8, 0] : 0,
        x: direction === "left" || direction === "right" ? [0, -8, 0] : 0,
      }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        style={{ transform: `rotate(${arrowProps.rotation}deg)` }}
      >
        <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function DragAnimation({ fromRect }: { fromRect: DOMRect }) {
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;

  return (
    <motion.div
      className="fixed z-[102] pointer-events-none"
      initial={{ left: startX - 10, top: startY - 10, opacity: 0.8 }}
      animate={{
        left: [startX - 10, startX - 10, startX - 60, startX - 60],
        top: [startY - 10, startY - 10, startY - 160, startY - 160],
        opacity: [0.8, 1, 1, 0],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.7, 1] }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" fill="hsl(var(--primary))" opacity="0.5" />
        <circle cx="10" cy="10" r="4" fill="hsl(var(--primary))" />
      </svg>
    </motion.div>
  );
}

export function SandboxOnboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const measureTarget = useCallback(() => {
    const el = document.querySelector(`[data-onboarding="${step.target}"]`);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step.target]);

  useEffect(() => {
    measureTarget();
    const handleResize = () => measureTarget();
    window.addEventListener("resize", handleResize);
    const interval = setInterval(measureTarget, 500);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [measureTarget]);

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleNext = () => {
    if (isLast) {
      finish();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSkip = () => finish();

  const viewport = { w: window.innerWidth, h: window.innerHeight };
  const pad = 8;

  const tooltipPos = targetRect
    ? getTooltipPosition(targetRect, viewport)
    : { top: viewport.h / 2 - 90, left: viewport.w / 2 - 160 };

  // Build 4 overlay rects around the target cutout (leaves target area truly uncovered)
  const dimStyle = "fixed bg-foreground/15 transition-all duration-500 pointer-events-auto";
  const expand = step.expandCutout ?? {};
  const cutout = targetRect
    ? {
        left: targetRect.left - pad - (expand.left ?? 0),
        top: targetRect.top - pad - (expand.top ?? 0),
        right: targetRect.right + pad + (expand.right ?? 0),
        bottom: targetRect.bottom + pad + (expand.bottom ?? 0),
      }
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] pointer-events-none"
        >
          {/* 4 dim panels around the target — target area is completely uncovered */}
          {cutout ? (
            <>
              {/* Top */}
              <div className={dimStyle} style={{ top: 0, left: 0, right: 0, height: cutout.top }} onClick={handleNext} />
              {/* Bottom */}
              <div className={dimStyle} style={{ top: cutout.bottom, left: 0, right: 0, bottom: 0 }} onClick={handleNext} />
              {/* Left */}
              <div className={dimStyle} style={{ top: cutout.top, left: 0, width: cutout.left, height: cutout.bottom - cutout.top }} onClick={handleNext} />
              {/* Right */}
              <div className={dimStyle} style={{ top: cutout.top, left: cutout.right, right: 0, height: cutout.bottom - cutout.top }} onClick={handleNext} />
            </>
          ) : (
            <div className="absolute inset-0 bg-foreground/15 pointer-events-auto" onClick={handleNext} />
          )}

          {/* Highlight border around target */}
          {targetRect && (
            <motion.div
              key={`highlight-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="fixed pointer-events-none rounded-xl"
              style={{
                left: targetRect.left - pad,
                top: targetRect.top - pad,
                width: targetRect.width + pad * 2,
                height: targetRect.height + pad * 2,
                boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 20px 2px hsl(var(--primary) / 0.15)",
              }}
            />
          )}

          {/* Arrow indicator */}
          {targetRect && step.arrowDirection && (
            <ArrowIndicator from={targetRect} direction={step.arrowDirection} />
          )}

          {/* Drag animation for step 4 */}
          {targetRect && step.waitForAction && (
            <DragAnimation fromRect={targetRect} />
          )}

          {/* Tooltip card */}
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[103] pointer-events-auto"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              width: 320,
            }}
          >
            <div className="bg-card rounded-2xl shadow-lg border border-border/60 p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                  {currentStep + 1}/{steps.length}
                </span>
              </div>

              {/* Description */}
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Progress bar */}
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: `${(currentStep / steps.length) * 100}%` }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {step.waitForAction ? "Skip this step" : "Skip tutorial"}
                </button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1.5 rounded-lg text-xs h-8 px-3 active:scale-[0.97] transition-transform"
                >
                  {isLast ? "Start" : "Next"}
                  {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
