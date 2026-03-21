import { motion } from "framer-motion";
import { Layers, ExternalLink, Inbox, Sparkles } from "lucide-react";
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
        <div className="space-y-4">
          {sessions.slice(0, 6).map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-secondary/30 overflow-hidden"
            >
              {/* Header row */}
              <div className="flex items-center gap-3 px-4 py-3">
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
                  Open
                </Button>
              </div>

              {/* Object types preview */}
              {session.objectTypes.length > 0 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {session.objectTypes.slice(0, 6).map((type) => (
                    <span
                      key={type}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-muted-foreground border border-border/30"
                    >
                      {type}
                    </span>
                  ))}
                  {session.objectTypes.length > 6 && (
                    <span className="text-[10px] px-2 py-0.5 text-muted-foreground/60">
                      +{session.objectTypes.length - 6} more
                    </span>
                  )}
                </div>
              )}

              {/* AI Reflection */}
              {session.reflection && (
                <div className="mx-3 mb-3 p-3 rounded-lg bg-card/60 border border-border/30">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 text-primary/70" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      AI Reflection
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80">
                    {session.reflection}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
