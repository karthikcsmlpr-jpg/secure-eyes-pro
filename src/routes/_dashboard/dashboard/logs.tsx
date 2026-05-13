import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { logSamples } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/dashboard/logs")({
  component: LogsPage,
  head: () => ({ meta: [{ title: "System Logs — CyberShield" }] }),
});

type Level = "ALL" | "ERROR" | "WARN" | "INFO" | "DEBUG";

interface LogEntry { ts: string; level: string; msg: string; }

function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    Array.from({ length: 30 }, (_, i) => {
      const s = logSamples[Math.floor(Math.random() * logSamples.length)];
      return { ts: new Date(Date.now() - (30 - i) * 4000).toISOString(), level: s.level, msg: s.msg };
    }),
  );
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level>("ALL");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const s = logSamples[Math.floor(Math.random() * logSamples.length)];
      setLogs((l) => [...l.slice(-300), { ts: new Date().toISOString(), level: s.level, msg: s.msg }]);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  const filtered = useMemo(() =>
    logs.filter((l) => (level === "ALL" || l.level === level) && (!q || l.msg.toLowerCase().includes(q.toLowerCase()))),
  [logs, level, q]);

  function exp() {
    const blob = new Blob([filtered.map((l) => `${l.ts} [${l.level}] ${l.msg}`).join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "logs.txt"; a.click();
    toast.success("Logs exported");
  }

  const lvlColor = (l: string) =>
    l === "ERROR" ? "text-danger" : l === "WARN" ? "text-warn" : l === "INFO" ? "text-cyber" : "text-muted-foreground";

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">System Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time stream from all sensors</p>
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
        <div ref={ref} className="font-mono text-xs leading-relaxed h-[60vh] overflow-y-auto p-4 space-y-0.5">
          {filtered.map((l, i) => (
            <div key={i} className="whitespace-nowrap">
              <span className="text-muted-foreground">{l.ts.slice(11, 19)}</span>{" "}
              <span className={`${lvlColor(l.level)} font-semibold`}>[{l.level}]</span>{" "}
              <span>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
