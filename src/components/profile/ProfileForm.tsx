import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  onSave: (name: string, email: string) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ProfileForm = ({ initialName, initialEmail, onSave }: ProfileFormProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(name, email);
    setSaving(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-5"
    >
      <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border-border bg-accent/40 focus-visible:ring-primary/30"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          className={`rounded-xl border-border bg-accent/40 focus-visible:ring-primary/30 ${emailError ? "border-destructive" : ""}`}
          placeholder="you@example.com"
        />
        {emailError && (
          <p className="text-xs text-destructive">{emailError}</p>
        )}
      </div>

      <Button onClick={handleConfirm} disabled={saving} className="w-full rounded-xl">
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Check className="w-4 h-4 mr-2" />
        )}
        {saving ? "Saving…" : "Confirm Changes"}
      </Button>
    </motion.div>
  );
};

export default ProfileForm;
