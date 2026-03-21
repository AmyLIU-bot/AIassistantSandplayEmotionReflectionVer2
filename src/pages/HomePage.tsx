import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import EmotionalStatus from "@/components/EmotionalStatus";
import RecentActivity from "@/components/RecentActivity";
import ProfileSection from "@/components/ProfileSection";
import { Sparkles } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const HomePage = () => {
  const [name, setName] = useState("Alex");
  const [mood, setMood] = useState(1);

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground">Hello, {name} 🌿</h1>
          <p className="text-sm text-muted-foreground mt-1">Take a breath. You're doing great today.</p>
        </motion.div>

        <motion.div variants={item} className="grid md:grid-cols-2 gap-4">
          <EmotionalStatus currentMood={mood} onMoodChange={setMood} />
          <ProfileSection name={name} onNameChange={setName} />
        </motion.div>

        <motion.div variants={item}>
          <RecentActivity />
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5 text-center">
          <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground italic">"You are allowed to take things one step at a time."</p>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default HomePage;
