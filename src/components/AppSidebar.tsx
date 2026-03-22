import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, BarChart3, User, Play, Mail, ChevronDown, Leaf, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const accountSubItems = [
  { title: "Home", path: "/home", icon: Home },
  { title: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { title: "Profile", path: "/profile", icon: User },
];

const sandboxSubItems = [
  { title: "Item Shop", path: "/sandbox/shop", icon: ShoppingBag },
];

const mainItems = [
  { title: "Contact Us", path: "/contact", icon: Mail },
];

const AppSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [accountOpen, setAccountOpen] = useState(true);
  const [sandboxOpen, setSandboxOpen] = useState(true);
  const location = useLocation();

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 220 : 68 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-3 top-3 bottom-3 z-50 flex flex-col glass-card rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 8px 32px hsla(145, 20%, 50%, 0.12)" }}
    >
      {/* Logo */}
      <Link to="/home" className="flex items-center gap-3 px-5 py-5 border-b border-border/30">
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
          <Leaf className="w-4 h-4 text-primary" />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-bold text-foreground whitespace-nowrap"
            >
              Sandbox AI
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-hidden">
        {/* Account section */}
        <Link
          to="/home"
          onClick={(e) => {
            if (expanded) {
              e.preventDefault();
              setAccountOpen(!accountOpen);
            }
          }}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-colors ${
            location.pathname === '/home' && !expanded
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent/50"
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between flex-1 whitespace-nowrap"
              >
                <span className="font-medium">Home</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <AnimatePresence>
          {accountOpen && expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-4 space-y-0.5"
            >
              {accountSubItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.title}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sandbox section with sub-items */}
        <Link
          to="/sandbox"
          onClick={(e) => {
            if (expanded) {
              e.preventDefault();
              setSandboxOpen(!sandboxOpen);
            }
          }}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-colors ${
            location.pathname.startsWith('/sandbox') && !expanded
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent/50"
          }`}
        >
          <Play className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between flex-1 whitespace-nowrap"
              >
                <span className="font-medium">Sandbox</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${sandboxOpen ? 'rotate-180' : ''}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <AnimatePresence>
          {sandboxOpen && expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-4 space-y-0.5"
            >
              <Link
                to="/sandbox"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                  location.pathname === '/sandbox'
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                <Play className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Sandbox</span>
              </Link>
              {sandboxSubItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.title}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other main items */}
        {mainItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
              location.pathname === item.path
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent/50"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>

      {/* Footer breathing dot */}
      <div className="px-5 py-4 border-t border-border/30 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              All is well
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
