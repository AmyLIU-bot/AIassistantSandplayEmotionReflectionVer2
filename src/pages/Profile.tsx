import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileForm from "@/components/profile/ProfileForm";
import AccountActions from "@/components/profile/AccountActions";

const Profile = () => {
  const [name, setName] = useState("Alex");
  const [email, setEmail] = useState("alex@example.com");

  const handleSave = (newName: string, newEmail: string) => {
    setName(newName);
    setEmail(newEmail);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information and account settings.</p>
        </div>
        <ProfileForm initialName={name} initialEmail={email} onSave={handleSave} />
        <AccountActions />
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
