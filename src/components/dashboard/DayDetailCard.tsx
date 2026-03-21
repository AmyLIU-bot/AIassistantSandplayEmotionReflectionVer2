import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmotionalEntry } from "@/data/emotionalData";

interface Props {
  entry: EmotionalEntry;
  onClose: () => void;
}

const scoreColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 65) return "text-muted-foreground";
  return "text-destructive/80";
};

const DayDetailCard = ({ entry, onClose }: Props) => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">
            {entry.date} — Score: <span className={scoreColor(entry.score)}>{entry.score}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{entry.summary}</p>

          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">Journal</p>
              <p className="text-sm text-muted-foreground">{entry.journal}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Layers className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">Sandbox Record</p>
              <p className="text-sm text-muted-foreground">{entry.sandbox}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DayDetailCard;
