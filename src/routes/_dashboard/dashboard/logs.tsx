import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiErrorState } from "./threats";

export const Route = createFileRoute("/_dashboard/dashboard/logs")({
  component: LogsPage,
  head: () => ({ meta: [{ title: "System Logs — CyberShield" }] }),
});

type Level = "ALL" | "ERROR" | "WARN" | "INFO" | "DEBUG";

interface LogEntry {
  ts?: string;
  timestamp?: string;
  time?: string;
  level: string;
  msg?: string;
  message?: string;
}

function normalizeList(payload: unknown): LogEntry[] {
  if (Array.isArray(payload)) return payload as LogEntry[];
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    for (const k of ["data", "logs", "items", "results"]) {
      if (Array.isArray(p[k])) return p[k] as LogEntry[];
    }
  }
  return [];
}

function tsOf(l: LogEntry) {
  return l.ts || l.timestamp || l.time || new Date().toISOString();
}
function msgOf(l: LogEntry) {
  return l.msg || l.message || "";
}

function LogsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["logs"],
    queryFn: () => api<unknown>("/logs"),
    select: normalizeList,
    refetchInterval: 5000,
  });

  const logs: LogEntry[] = data ?? [];
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level>("ALL");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  const filtered = useMemo(
    () =>
      logs.filter(
        (l) =>
          (level === "ALL" || (l.level || "").toUpperCase() === level) &&
          (!q || msgOf(l).toLowerCase().includes(q.toLowerCase())),
      ),
    [logs, level, q],
  );

  function exp() {
    const blob = new Blob(
      [filtered.map((l) => `${tsOf(l)} [${l.level}] ${msgOf(l)}`).join("\n")],
      { type: "text/plain" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "logs.txt";
    a.click();
    toast.success("Logs exported");
  }

  const lvlColor = (l: string) => {
    const u = (l || "").toUpperCase();
    return u === "ERROR" ? "text-danger" : u === "WARN" ? "text-warn" : u === "INFO" ? "text-cyber" : "text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">System Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time stream from all sensors · auto-refresh 5s</p>
        </div>
        <button onClick={exp} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium glow-cyan">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="glass rounded-xl p-3 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search logs…"
            className="w-full pl-9 pr-3 py-2 rounded-md bg-input border border-border/60 outline-none text-sm focus:border-cyber focus:ring-2 focus:ring-cyber/30" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="px-2 py-2 rounded-md bg-input border border-border/60">
            {(["ALL", "ERROR", "WARN", "INFO", "DEBUG"] as Level[]).map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden relative scanlines">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-background/40">
          <span className="w-2.5 h-2.5 rounded-full bg-danger" />
          <span className="w-2.5 h-2.5 rounded-full bg-warn" />
          <span className="w-2.5 h-2.5 rounded-full bg-success" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">soc@cybershield: ~/logs · {filtered.length} lines</span>
        </div>
        {isLoading ? (
          <div className="py-16 grid place-items-center text-sm text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyber" /> Streaming logs…
          </div>
        ) : isError ? (
          <ApiErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <div ref={ref} className="font-mono text-xs leading-relaxed h-[60vh] overflow-y-auto p-4 space-y-0.5">
            {filtered.map((l, i) => {
              const t = tsOf(l);
              return (
                <div key={i} className="whitespace-nowrap">
                  <span className="text-muted-foreground">{t.length >= 19 ? t.slice(11, 19) : t}</span>{" "}
                  <span className={`${lvlColor(l.level)} font-semibold`}>[{(l.level || "INFO").toUpperCase()}]</span>{" "}
                  <span>{msgOf(l)}</span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">No logs match your filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
