import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, CheckCircle2, Loader2, MapPin, Clock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const { toast } = useToast();

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!EMAIL_REGEX.test(email.trim())) e.email = "Please enter a valid email";
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex items-start justify-center px-4 py-10 md:py-16 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Contact Us
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Feel free to reach out anytime. We're here to support you.
            </p>
          </div>

          {/* Form card */}
          <Card className="border-0 shadow-card bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground">Send us a message</CardTitle>
              <CardDescription>We'd love to hear from you.</CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Thank you!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Your message has been sent successfully. We usually respond within 24 hours.
                  </p>
                  <Button variant="outline" className="mt-2" onClick={() => setSent(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 bg-background/60"
                      maxLength={100}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 bg-background/60"
                      maxLength={255}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px] bg-background/60 resize-none"
                      maxLength={1000}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full h-10 text-base font-semibold rounded-lg gap-2" disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Support info */}
          <div className="text-center space-y-1 pb-6">
            <p className="text-sm text-muted-foreground">
              You can also email us at{" "}
              <a href="mailto:support@example.com" className="text-primary font-medium hover:underline underline-offset-2">
                support@example.com
              </a>
            </p>
            <p className="text-xs text-muted-foreground/70">We usually respond within 24 hours.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContactPage;
