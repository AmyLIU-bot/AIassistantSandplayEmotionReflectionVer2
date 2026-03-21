import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Leaf, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-[200vh] relative">
      {/* Full-screen hero background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(145,30%,85%)] via-[hsl(80,25%,90%)] to-[hsl(40,30%,88%)]" />
        {/* Soft floating glow accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        {/* Sandbox logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">Sandbox AI</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground text-center max-w-2xl leading-tight" style={{ lineHeight: '1.1' }}>
          Express your emotions without words.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground text-center max-w-md">
          Sandbox AI is here for you!
        </p>

        {/* Scroll indicator */}
        <button onClick={scrollToContent} className="mt-16 animate-bounce text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div ref={contentRef} className="min-h-screen bg-background/80 backdrop-blur-sm py-16 px-6">
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
            <h2 className="text-3xl font-bold text-foreground">What is a Sandbox?</h2>
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
                <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>

            {/* Demo video placeholder */}
            <div className="mt-8 aspect-video rounded-2xl bg-card border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Demo Video</span>
            </div>
          </div>

          {/* Right side - Login card */}
          <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
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
                    className="h-11 bg-background/60 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-background/60 backdrop-blur-sm transition-all duration-200 pr-10"
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

                <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                  Login
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-card px-3 text-sm text-muted-foreground">or</span></div>
                </div>

                <Button type="button" variant="outline" className="w-full h-11" onClick={() => navigate("/home")}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
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
