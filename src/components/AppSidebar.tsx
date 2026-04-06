import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Shield,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/virtual-machines", label: "Virtual Machines", icon: Server },
];

export default function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Activity className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">BigBand</p>
          <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Network Monitor</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
          <Shield className="h-3.5 w-3.5" />
          <span>Powered by ntopng</span>
        </div>
      </div>
    </aside>
  );
}
