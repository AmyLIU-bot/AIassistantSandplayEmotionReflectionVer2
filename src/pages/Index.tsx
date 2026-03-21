import { useRef } from "react";
import { Leaf, ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgNature from "@/assets/bg-nature.jpg";

const Index = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen nature background */}
      <div className="fixed inset-0">
        <img
          src={bgNature}
          alt=""
          className="w-full h-full animate-[drift_35s_ease-in-out_infinite]"
          style={{ objectFit: 'cover', objectPosition: '60% center', transform: 'scale(1.01)', filter: 'contrast(1.08) saturate(1.15)' }}
        />
        <div className="absolute inset-0 bg-background/10" />
      </div>

      {/* Soft floating glow accents */}
      <div className="fixed top-[10%] left-[8%] w-80 h-80 rounded-full blur-[100px] animate-float-slow" style={{ background: "hsl(var(--primary) / 0.12)" }} />
      <div className="fixed bottom-[15%] right-[10%] w-96 h-96 rounded-full blur-[120px] animate-float-medium" style={{ background: "hsl(170 30% 50% / 0.08)" }} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Leaf className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
              Sandbox AI
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight max-w-3xl text-primary-foreground drop-shadow-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Express your emotions without words.
          </h1>
          <p className="text-xl md:text-2xl max-w-lg mx-auto text-primary-foreground/80 drop-shadow-md" style={{ fontFamily: 'var(--font-body)' }}>
            Sandbox AI is here for you!
          </p>
        </div>

        <button
          onClick={scrollToContent}
          className="absolute bottom-10 animate-bounce text-primary-foreground hover:text-primary-foreground transition-colors"
          aria-label="Scroll down"
        >
          <div className="w-12 h-12 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <ChevronDown className="w-7 h-7 drop-shadow-md" />
          </div>
        </button>
      </section>

      {/* ===== CONTENT SECTION ===== */}
      {/* ===== CONTENT SECTION ===== */}
      <section ref={contentRef} className="relative z-10 h-[100dvh] flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="px-5 md:px-8 pt-3 pb-2 shrink-0">
          <div className="animate-fade-in-up flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'hsl(150 10% 15%)' }}>
              Sandbox
            </span>
          </div>
        </div>

        {/* Content grid — both columns share the remaining height */}
        <div className="flex-1 min-h-0 px-4 md:px-8 pb-4 md:pb-5 flex items-center justify-center">
          <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1.8fr_0.55fr] gap-4 lg:gap-6 items-center" style={{ minHeight: '80vh' }}>

            {/* Left side — glass panel */}
            <div className="relative flex flex-col h-full min-h-0 rounded-3xl px-5 md:px-7 py-5 md:py-6 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-3xl backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, hsl(140 20% 97% / 0.45), hsl(140 20% 97% / 0.25))' }} />

              <div className="space-y-3 shrink-0">
                <h2 className="animate-fade-in-up animation-delay-100 text-3xl md:text-[2.6rem] font-bold leading-tight tracking-tight" style={{ color: 'hsl(150 15% 12%)' }}>
                  What is a Sandbox?
                </h2>
                <p className="animate-fade-in-up animation-delay-200 text-[0.95rem] md:text-base leading-relaxed max-w-xl" style={{ color: 'hsl(150 8% 25%)' }}>
                  A sandbox is a creative space where users can express their emotions by placing objects and building a scene instead of using words.
                </p>
                <p className="animate-fade-in-up animation-delay-300 text-[0.95rem] md:text-base leading-relaxed max-w-xl" style={{ color: 'hsl(150 8% 25%)' }}>
                  The system then reflects their emotions in a gentle and meaningful way.
                </p>
                <div className="animate-fade-in-up animation-delay-400 flex gap-2 pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/25" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/15" />
                </div>
              </div>

              {/* Demo video — fills remaining space */}
              <div className="animate-fade-in-up animation-delay-400 mt-4 flex-1 min-h-[120px] rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-2 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-primary ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <p className="text-sm font-medium">Demo Video</p>
                </div>
              </div>
            </div>

            {/* Right side — Get Started CTA */}
            <div className="animate-fade-in-up animation-delay-200 flex flex-col items-center justify-center lg:items-start gap-5">
              <div className="flex items-center gap-4">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Get Started
                </h2>
                <button
                  onClick={() => navigate("/login")}
                  className="group w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ease-out"
                  aria-label="Get Started"
                >
                  <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              <p className="text-sm font-medium max-w-[220px] text-center lg:text-left text-foreground/70 drop-shadow-sm">
                Begin your emotional journey
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
