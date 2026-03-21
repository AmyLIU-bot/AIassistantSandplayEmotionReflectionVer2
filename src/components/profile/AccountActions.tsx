import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountActions = () => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = () => {
    toast({ title: "Signed out", description: "You have been signed out." });
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 800));
    setDeleting(false);
    toast({
      title: "Account deleted",
      description: "Your account has been permanently removed.",
      variant: "destructive",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-foreground">Account Actions</h2>

      <Button variant="outline" className="w-full rounded-xl justify-start gap-2" onClick={handleSignOut}>
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full rounded-xl justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/5">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="rounded-xl bg-destructive text-destructive-foreground">
              {deleting ? "Deleting…" : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AccountActions;
