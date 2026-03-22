import { useEffect, useRef, useState } from "react";

type Visibility = "hidden" | "entering" | "active" | "exiting";

const styles: Record<Visibility, React.CSSProperties> = {
  hidden: { opacity: 0, transform: "scale(0.96) translateY(24px)" },
  entering: { opacity: 0.85, transform: "scale(0.99) translateY(4px)" },
  active: { opacity: 1, transform: "scale(1) translateY(0)" },
  exiting: { opacity: 0.9, transform: "scale(0.98) translateY(0)" },
};

const shadowMap: Record<Visibility, string> = {
  hidden: "var(--shadow-card)",
  entering: "var(--shadow-card)",
  active: "var(--shadow-card-hover)",
  exiting: "var(--shadow-card)",
};

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollSection({ children, className = "", style }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState<Visibility>("hidden");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const r = entry.intersectionRatio;
        if (r >= 0.3) setVis("active");
        else if (r >= 0.08) setVis(entry.isIntersecting ? "entering" : "exiting");
        else setVis("hidden");
      },
      { threshold: [0, 0.08, 0.15, 0.3, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...styles[vis],
        boxShadow: shadowMap[vis],
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s ease",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
