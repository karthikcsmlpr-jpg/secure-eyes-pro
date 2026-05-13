import type { Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const styles: Record<Severity, string> = {
  Critical: "bg-danger/15 text-danger border-danger/40 shadow-[0_0_12px_-2px_var(--danger)]",
  High: "bg-warn/15 text-warn border-warn/40",
  Medium: "bg-chart-5/15 text-chart-5 border-chart-5/40",
  Low: "bg-success/15 text-success border-success/40",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        styles[severity],
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current blink" />
      {severity}
    </span>
  );
}
