import { User, BookOpen, LayoutGrid, Mail, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: Home, label: "Home", desc: "Return to dashboard home", route: "/home" },
  { icon: User, label: "Account", desc: "Manage your profile and settings", route: "/profile" },
  { icon: BookOpen, label: "Introduction", desc: "Learn how the sandbox works", route: "/home" },
  { icon: LayoutGrid, label: "Sandbox", desc: "Express emotions through objects", route: "/sandbox" },
  { icon: Mail, label: "Contact Us", desc: "Send feedback or ask for help", route: "/home" },
];

export function SandboxSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex flex-col w-16 lg:w-52 min-h-screen bg-background border-r border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-sm font-medium">S</span>
        </div>
        <span className="hidden lg:block text-sm font-medium text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Sandbox AI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1" style={{ fontFamily: 'var(--font-body)' }}>
        {navItems.map(({ icon: Icon, label, desc, route }) => {
          const isActive = label === "Sandbox";
          return (
            <Tooltip key={label} delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150
                    ${isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary"
                    }
                  `}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
                  <span className="hidden lg:block">{label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs max-w-48">
                <p className="font-medium">{label}</p>
                <p className="text-muted-foreground">{desc}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-3 hidden lg:block">
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            A quiet space for reflection and self-discovery.
          </p>
        </div>
      </div>
    </aside>
  );
}
