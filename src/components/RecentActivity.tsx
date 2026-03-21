import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Sparkles, Coffee, Leaf } from "lucide-react";
import { getSavedReflections } from "@/lib/reflections";
import { formatDistanceToNow } from "date-fns";

const defaultActivities = [
  { icon: BookOpen, text: "Journaled about today's feelings", time: "2 hours ago", color: "bg-calm" },
  { icon: MessageCircle, text: "Completed a mindfulness check-in", time: "5 hours ago", color: "bg-warm" },
  { icon: Sparkles, text: "Achieved a 7-day streak", time: "Yesterday", color: "bg-gentle" },
  { icon: Coffee, text: "Set morning routine reminder", time: "2 days ago", color: "bg-accent" },
];

const RecentActivity = () => {
  const savedReflections = getSavedReflections();

  const reflectionActivities = savedReflections.map((r) => ({
    icon: Leaf,
    text: r.text.length > 60 ? r.text.slice(0, 60) + "…" : r.text,
    time: formatDistanceToNow(new Date(r.timestamp), { addSuffix: true }),
    color: "bg-primary/10",
  }));

  const activities = [...reflectionActivities, ...defaultActivities];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.slice(0, 8).map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`w-8 h-8 rounded-xl ${activity.color} flex items-center justify-center shrink-0`}>
              <activity.icon className="w-4 h-4 text-foreground/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.text}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
