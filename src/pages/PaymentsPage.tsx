import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Coins, Sparkles, Star, MessageSquare, Send, Zap, Heart, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";

/* ── token packages ── */
const packages = [
  {
    id: "small",
    name: "Starter Pack",
    tokens: 20,
    price: "$4.99",
    desc: "A gentle start — enough for a few meaningful reflections.",
    accent: false,
  },
  {
    id: "medium",
    name: "Growth Pack",
    tokens: 50,
    price: "$9.99",
    desc: "Deepen your journey with more sessions and richer guidance.",
    accent: true,
  },
  {
    id: "large",
    name: "Insight Pack",
    tokens: 120,
    price: "$18.99",
    desc: "Unlock long-form reflections and premium AI styles.",
    accent: false,
  },
];

/* ── premium features ── */
const premiumFeatures = [
  { icon: Sparkles, title: "Deeper Reflections", desc: "Longer, more nuanced AI responses that explore patterns across sessions." },
  { icon: Eye, title: "Advanced Insight Styles", desc: "Access poetic, narrative, and Socratic reflection modes." },
  { icon: Heart, title: "Emotional Timeline", desc: "Track how your emotional landscape shifts over weeks and months." },
  { icon: Shield, title: "Priority Processing", desc: "Your reflections are processed first — no waiting in line." },
];

/* ── rating dimensions ── */
const ratingDimensions = [
  { key: "helpfulness", label: "Helpfulness", desc: "Did the reflection feel genuinely useful?" },
  { key: "clarity", label: "Clarity", desc: "Were the insights easy to understand?" },
  { key: "comfort", label: "Comfort", desc: "Did the experience feel safe and calm?" },
  { key: "usefulness", label: "Usefulness", desc: "Can you apply these insights to your life?" },
];

/* ── star rating component ── */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="p-0.5 transition-transform duration-150 active:scale-90"
        >
          <Star
            className={`w-5 h-5 transition-colors duration-150 ${
              s <= (hover || value)
                ? "fill-primary text-primary"
                : "text-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ── entrance variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function PaymentsPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");

  const overallScore =
    Object.values(ratings).length > 0
      ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
      : "—";

  const handleBuy = (pkg: (typeof packages)[0]) => {
    toast.success(`${pkg.tokens} tokens added to your balance!`, {
      description: `${pkg.name} purchased successfully.`,
    });
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast.error("Please write something before submitting.");
      return;
    }
    toast.success("Thank you for your thoughtful feedback.");
    setFeedback("");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />

      <div className="flex flex-1 h-full min-w-0" style={{ marginLeft: 80 }}>
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

            {/* ── Section 1: Token Balance ── */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="rounded-2xl bg-card border border-border/50 p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3 flex-1">
                  <h2 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    Your Token Balance
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-secondary/60 p-4 text-center">
                      <p className="text-3xl font-bold text-foreground tabular-nums">24</p>
                      <p className="text-xs text-muted-foreground mt-1">Tokens Available</p>
                    </div>
                    <div className="rounded-xl bg-secondary/60 p-4 text-center">
                      <p className="text-3xl font-bold text-foreground tabular-nums">6</p>
                      <p className="text-xs text-muted-foreground mt-1">Reflections Remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ── Section 2: Buy More Tokens ── */}
            <section className="space-y-5">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <h2 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Add More Tokens
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Choose a package that fits your reflection journey.</p>
              </motion.div>

              <div className="grid sm:grid-cols-3 gap-4">
                {packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i + 2}
                    className={`rounded-2xl border p-5 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md ${
                      pkg.accent
                        ? "bg-primary/5 border-primary/30 ring-1 ring-primary/15"
                        : "bg-card border-border/50"
                    }`}
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    {pkg.accent && (
                      <span className="self-start text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-foreground">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{pkg.desc}</p>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-auto">
                      <span className="text-2xl font-bold text-foreground tabular-nums">{pkg.tokens}</span>
                      <span className="text-xs text-muted-foreground">tokens</span>
                      <span className="ml-auto text-sm font-semibold text-primary">{pkg.price}</span>
                    </div>
                    <Button
                      onClick={() => handleBuy(pkg)}
                      variant={pkg.accent ? "default" : "outline"}
                      className="w-full rounded-xl active:scale-[0.97] transition-transform duration-150"
                    >
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Buy Now
                    </Button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Section 3: Premium Reflection Features ── */}
            <section className="space-y-5">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} custom={0}>
                <h2 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Premium Reflection Features
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Here's what additional tokens unlock for you.</p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4">
                {premiumFeatures.map((feat, i) => (
                  <motion.div
                    key={feat.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    custom={i + 1}
                    className="rounded-2xl bg-card border border-border/50 p-5 flex gap-4 hover:shadow-md transition-shadow duration-200"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <feat.icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{feat.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Section 4: Reflection Experience Rating ── */}
            <section className="space-y-5">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} custom={0}>
                <h2 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Your Reflection Experience
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Help us understand how the reflection felt for you.</p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={1}
                className="rounded-2xl bg-card border border-border/50 p-6 space-y-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {ratingDimensions.map((dim) => (
                    <div key={dim.key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{dim.label}</span>
                        <StarRating
                          value={ratings[dim.key] || 0}
                          onChange={(v) => setRatings((prev) => ({ ...prev, [dim.key]: v }))}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{dim.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Overall score */}
                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Overall Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary tabular-nums">{overallScore}</span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ── Section 5: Feedback ── */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
              className="rounded-2xl bg-card border border-border/50 p-6 space-y-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    Share Your Thoughts
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    What resonated? What could feel better? Every word helps us grow.
                  </p>
                </div>
              </div>

              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience — what felt meaningful, what could be improved..."
                rows={4}
                className="rounded-xl border-border/50 bg-secondary/30 resize-none focus-visible:ring-primary/30"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitFeedback}
                  className="rounded-xl active:scale-[0.97] transition-transform duration-150"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Feedback
                </Button>
              </div>
            </motion.section>

            <div className="h-6" />
          </div>
        </main>
      </div>
    </div>
  );
}
