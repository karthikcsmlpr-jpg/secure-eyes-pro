import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShieldAlert, Siren, BarChart3, Terminal as TerminalIcon,
  User, Settings as SettingsIcon, LogOut, Menu, Bell, Search, Sun, Moon, ChevronLeft,
} from "lucide-react";
import { Logo } from "@/components/cyber/Logo";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
  beforeLoad: () => {
    // Redirect bare "/dashboard" parent to overview if needed; but we use "/dashboard" as index.
  },
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/threats", label: "Threat Feed", icon: ShieldAlert },
  { to: "/dashboard/incidents", label: "Incidents", icon: Siren },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/logs", label: "System Logs", icon: TerminalIcon },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [path]);

  return (
    <div className="min-h-screen flex bg-background relative">
      <div className="absolute inset-0 cyber-grid opacity-[0.15] pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300
          ${collapsed ? "w-[76px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {collapsed ? <Logo compact /> : <Logo />}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:grid place-items-center w-8 h-8 rounded-md hover:bg-sidebar-accent text-muted-foreground"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition relative
                  ${active ? "bg-cyber/15 text-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyber glow-cyan" />}
                <item.icon className={`w-4 h-4 ${active ? "text-cyber" : ""}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-3 left-3 right-3">
          <button
            onClick={() => { toast("Signed out"); nav({ to: "/" }); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-danger transition"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-background/70 backdrop-blur-xl border-b border-border/60">
          <div className="h-full px-4 flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-accent">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search threats, incidents, IPs…"
                className="w-full pl-9 pr-3 py-2 rounded-md bg-input border border-border/60 outline-none text-sm focus:border-cyber focus:ring-2 focus:ring-cyber/30"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden md:inline text-xs font-mono text-muted-foreground">
                {time.toUTCString().slice(17, 25)} UTC
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border border-success/30 bg-success/10 text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online
              </span>
              <button className="p-2 rounded-md hover:bg-accent" aria-label="Toggle theme">
                <Moon className="w-4 h-4 hidden dark:inline" /><Sun className="w-4 h-4 dark:hidden" />
              </button>
              <button className="relative p-2 rounded-md hover:bg-accent" aria-label="Notifications">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger glow-red" />
              </button>
              <div className="ml-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber to-chart-5 grid place-items-center text-xs font-semibold text-primary-foreground">AK</div>
                <div className="hidden md:block leading-tight">
                  <div className="text-xs font-medium">A. Kovacs</div>
                  <div className="text-[10px] text-muted-foreground">Lead Analyst</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          key={path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
