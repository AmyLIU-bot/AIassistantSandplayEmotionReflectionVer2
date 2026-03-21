import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Leaf, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgNature from "@/assets/bg-nature.jpg";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
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
        <div className="flex-1 min-h-0 px-4 md:px-8 pb-4 md:pb-5">
          <div className="w-full max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 lg:gap-5">

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

            {/* Right side — Login card */}
            <div className="animate-fade-in-up animation-delay-200 h-full min-h-0 flex items-center">
              <Card className="shadow-card border-0 backdrop-blur-sm bg-card/95 w-full">
                <CardHeader className="pb-2 px-5 md:px-6 pt-5 md:pt-6">
                  <CardTitle className="text-xl font-bold text-foreground">Login</CardTitle>
                </CardHeader>
                <CardContent className="px-5 md:px-6 pb-5 md:pb-6">
                  <form onSubmit={handleLogin} className="space-y-3.5">
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">Username or Email</Label>
                      <Input id="email" type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 bg-background/60 backdrop-blur-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                      <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 bg-background/60 backdrop-blur-sm" />
                    </div>

                    <Button type="submit" className="w-full h-10 text-sm font-semibold rounded-lg">Login</Button>

                    <div className="relative flex items-center">
                      <div className="flex-1 border-t border-border" />
                      <span className="px-3 text-xs text-muted-foreground">or</span>
                      <div className="flex-1 border-t border-border" />
                    </div>

                    <Button type="button" variant="google" className="w-full h-10 text-sm font-medium rounded-lg gap-2.5" onClick={() => navigate("/home")}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Don't have an account?{" "}
                      <button type="button" className="text-primary font-semibold hover:underline underline-offset-2">Sign up</button>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
