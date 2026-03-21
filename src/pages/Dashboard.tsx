import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import EmotionalChart from "@/components/dashboard/EmotionalChart";
import DayDetailCard from "@/components/dashboard/DayDetailCard";
import AIInsightsPanel from "@/components/dashboard/AIInsightsPanel";
import { emotionalData, type EmotionalEntry } from "@/data/emotionalData";

const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState<EmotionalEntry | null>(null);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emotional History</h1>
          <p className="text-sm text-muted-foreground">Your emotional journey, visualized gently.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-4">
            <EmotionalChart data={emotionalData} onDayClick={setSelectedDay} selectedDay={selectedDay} />
            {selectedDay && <DayDetailCard entry={selectedDay} onClose={() => setSelectedDay(null)} />}
          </div>
          <AIInsightsPanel />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
