import { motion } from "framer-motion";
import { Layers, ExternalLink, Inbox } from "lucide-react";
import { getSavedSessions } from "@/lib/sandboxSessions";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RecentActivity = () => {
  const sessions = getSavedSessions();
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
            <Inbox className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No recent Sandbox activity yet.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Complete a sandbox session to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.slice(0, 6).map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{session.label}</p>
                <p className="text-xs text-muted-foreground">
                  {session.objectCount} object{session.objectCount !== 1 ? "s" : ""} ·{" "}
                  {formatDistanceToNow(new Date(session.timestamp), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => navigate(`/sandbox?session=${session.id}`)}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
