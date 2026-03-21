import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Check } from "lucide-react";

interface Props {
  name: string;
  onNameChange: (name: string) => void;
}

const ProfileSection = ({ name, onNameChange }: Props) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [preference, setPreference] = useState("Gentle reminders");

  const save = () => {
    onNameChange(editName);
    setEditing(false);
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Your Profile</h3>
        <button
          onClick={() => editing ? save() : setEditing(true)}
          className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center hover:bg-primary/15 transition-colors"
        >
          {editing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
          {name.charAt(0)}
        </div>
        <div>
          {editing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-lg font-semibold bg-accent/50 rounded-lg px-3 py-1 border border-border outline-none focus:ring-1 focus:ring-primary/30 text-foreground"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && save()}
            />
          ) : (
            <p className="text-lg font-semibold text-foreground">{name}</p>
          )}
          <p className="text-xs text-muted-foreground">Member since March 2026</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Notification Style</label>
        <select
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          disabled={!editing}
          className="w-full bg-accent/50 rounded-xl px-3 py-2 text-sm border border-border outline-none text-foreground disabled:opacity-60"
        >
          <option>Gentle reminders</option>
          <option>Morning only</option>
          <option>Minimal</option>
          <option>Silent</option>
        </select>
      </div>
    </div>
  );
};

export default ProfileSection;
