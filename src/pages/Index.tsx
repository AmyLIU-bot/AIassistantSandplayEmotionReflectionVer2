import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Leaf, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import leafBg from "@/assets/leaf-bg.jpg";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  const parallaxOffset = scrollY * 0.3;
  const bgScale = 1.15 + scrollY * 0.0003;
  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const mouseShiftX = (mousePos.x - 0.5) * 12;
  const mouseShiftY = (mousePos.y - 0.5) * 8;

  return (
    <div className="min-h-[200vh] relative overflow-x-hidden">
      {/* Full-screen leaf background with parallax */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={leafBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${bgScale}) translate(${mouseShiftX}px, ${-parallaxOffset + mouseShiftY}px)`,
            filter: `brightness(0.92) saturate(1.1)`,
          }}
        />
        {/* Soft color overlays that shift with scroll */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(ellipse at ${30 + mousePos.x * 20}% ${40 + mousePos.y * 15}%, hsla(145, 35%, 65%, 0.25) 0%, transparent 60%),
              radial-gradient(ellipse at ${70 - mousePos.x * 15}% ${60 - mousePos.y * 10}%, hsla(80, 30%, 75%, 0.2) 0%, transparent 55%),
              linear-gradient(to bottom, hsla(80, 25%, 97%, 0.15), hsla(145, 20%, 30%, 0.35))
            `,
          }}
        />
        {/* Breathing light pulse */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(145, 40%, 70%, 0.12) 0%, transparent 70%)",
            transition: "left 1.2s cubic-bezier(0.16, 1, 0.3, 1), top 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative"
        style={{ opacity: heroOpacity }}
      >
        {/* Logo with gentle float */}
        <div
          className="flex items-center gap-3 mb-8 animate-fade-in"
          style={{
            animationDuration: "0.8s",
            animationDelay: "0.2s",
            animationFillMode: "both",
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-card/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight drop-shadow-sm">
            Sandbox AI
          </span>
        </div>

        <h1
          className="text-4xl md:text-6xl font-bold text-foreground text-center max-w-2xl animate-fade-in drop-shadow-sm"
          style={{
            lineHeight: "1.1",
            animationDuration: "0.8s",
            animationDelay: "0.5s",
            animationFillMode: "both",
            textWrap: "balance",
          }}
        >
          Express your emotions without words.
        </h1>
        <p
          className="mt-6 text-lg text-muted-foreground text-center max-w-md animate-fade-in"
          style={{
            animationDuration: "0.8s",
            animationDelay: "0.8s",
            animationFillMode: "both",
          }}
        >
          A quiet, creative space for self-reflection and emotional discovery.
        </p>

        {/* Scroll indicator */}
        <button
          onClick={scrollToContent}
          className="mt-16 text-muted-foreground hover:text-foreground transition-colors animate-fade-in"
          style={{
            animationDuration: "0.8s",
            animationDelay: "1.2s",
            animationFillMode: "both",
          }}
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </button>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div
        ref={contentRef}
        className="min-h-screen py-16 px-6 relative"
        style={{
          background: "linear-gradient(to bottom, hsla(80, 25%, 97%, 0.88) 0%, hsla(80, 25%, 97%, 0.95) 30%, hsl(80, 25%, 97%) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-12">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground">Sandbox AI</span>
        </div>

        {/* Content grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left side */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground" style={{ textWrap: "balance" }}>
              What is a Sandbox?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A sandbox is a creative space where users can express their emotions
              by placing objects and building a scene instead of using words.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The system then reflects their emotions in a gentle and meaningful way.
            </p>

            {/* Decorative dots */}
            <div className="flex gap-3 pt-4">
              {["hsl(145,25%,72%)", "hsl(38,30%,78%)", "hsl(200,18%,78%)"].map((c, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: c,
                    animation: `pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
            </div>

            {/* Demo video placeholder */}
            <div className="mt-8 aspect-video rounded-2xl bg-card border border-border/50 flex items-center justify-center overflow-hidden relative group shadow-sm">
              <img
                src={leafBg}
                alt="Nature preview"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <span className="text-muted-foreground text-sm relative z-10 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                Demo Video
              </span>
            </div>
          </div>

          {/* Right side - Login card */}
          <Card className="border-border/40 shadow-xl bg-card/85 backdrop-blur-md hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Login</CardTitle>
              <p className="text-sm text-muted-foreground">Welcome back to your quiet space.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username or Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-background/60 backdrop-blur-sm transition-all duration-200 focus:bg-background/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-background/60 backdrop-blur-sm transition-all duration-200 focus:bg-background/80 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
                >
                  Login
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-sm text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 active:scale-[0.98] transition-all duration-150"
                  onClick={() => navigate("/home")}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <button type="button" className="text-primary hover:underline font-medium">
                    Sign up
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
