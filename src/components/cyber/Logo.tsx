import { Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ to = "/", compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 rounded-lg bg-cyber/30 blur-md group-hover:bg-cyber/60 transition" />
        <div className="relative grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyber to-chart-5 text-primary-foreground">
          <Shield className="w-5 h-5" />
        </div>
      </div>
      {!compact && (
        <span className="font-semibold text-lg tracking-tight">
          Cyber<span className="text-cyber text-glow">Shield</span>
        </span>
      )}
    </Link>
  );
}
