import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, RefreshCw, Download, X, Loader2, AlertTriangle } from "lucide-react";
import { SeverityBadge } from "@/components/cyber/SeverityBadge";
import type { Severity, ThreatStatus } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/dashboard/threats")({
  component: ThreatsPage,
  head: () => ({ meta: [{ title: "Threat Feed — CyberShield" }] }),
});

interface Threat {
  id: string;
  type: string;
  severity: Severity;
  source: string;
  destination: string;
  time: string;
  status: ThreatStatus;
  country: string;
}

const SEVS: ("All" | Severity)[] = ["All", "Critical", "High", "Medium", "Low"];
const STATUSES: ("All" | ThreatStatus)[] = ["All", "Active", "Mitigated", "Investigating", "Blocked"];

function normalizeList(payload: unknown): Threat[] {
  if (Array.isArray(payload)) return payload as Threat[];
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    for (const k of ["data", "threats", "items", "results"]) {
      if (Array.isArray(p[k])) return p[k] as Threat[];
    }
  }
  return [];
}

function ThreatsPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["threats"],
    queryFn: () => api<unknown>("/threats"),
    select: normalizeList,
  });

  const [q, setQ] = useState("");
  const [sev, setSev] = useState<(typeof SEVS)[number]>("All");
  const [st, setSt] = useState<(typeof STATUSES)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Threat | null>(null);
  const perPage = 10;

  const list = data ?? [];
  const filtered = useMemo(() => {
    return list.filter((t) => {
      if (sev !== "All" && t.severity !== sev) return false;
      if (st !== "All" && t.status !== st) return false;
      if (q && !`${t.id} ${t.type} ${t.source} ${t.destination}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [list, q, sev, st]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  function exportCSV() {
    const header = "id,type,severity,source,destination,time,status\n";
    const body = filtered.map((t) => [t.id, t.type, t.severity, t.source, t.destination, t.time, t.status].join(",")).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "threats.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Threats exported");
  }

  async function markMitigated(t: Threat) {
    try {
      await api(`/threats/${t.id}`, { method: "PUT", body: { ...t, status: "Mitigated" } });
      toast.success("Threat marked as mitigated");
      qc.invalidateQueries({ queryKey: ["threats"] });
      setSelected(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Threat Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading…" : `${filtered.length.toLocaleString()} threats matching your filters`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} disabled={isFetching} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border/60 hover:bg-accent text-sm disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium hover:opacity-90 glow-cyan">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search by ID, type, IP…"
            className="w-full pl-9 pr-3 py-2 rounded-md bg-input border border-border/60 outline-none text-sm focus:border-cyber focus:ring-2 focus:ring-cyber/30"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select value={sev} onChange={(e) => { setSev(e.target.value as Severity | "All"); setPage(1); }} className="px-2 py-2 rounded-md bg-input border border-border/60">
            {SEVS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={st} onChange={(e) => { setSt(e.target.value as ThreatStatus | "All"); setPage(1); }} className="px-2 py-2 rounded-md bg-input border border-border/60">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 grid place-items-center text-muted-foreground text-sm gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyber" /> Loading threats from API…
          </div>
        ) : isError ? (
          <ApiErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground bg-background/40">
                <tr>
                  {["Threat ID", "Type", "Severity", "Source IP", "Destination", "Country", "Time", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => (
                  <tr key={t.id} onClick={() => setSelected(t)}
                    className="border-t border-border/30 hover:bg-accent/30 cursor-pointer transition">
                    <td className="py-2.5 px-3 font-mono text-xs text-cyber">{t.id}</td>
                    <td className="px-3">{t.type}</td>
                    <td className="px-3"><SeverityBadge severity={t.severity} /></td>
                    <td className="px-3 font-mono text-xs">{t.source}</td>
                    <td className="px-3 font-mono text-xs">{t.destination}</td>
                    <td className="px-3 text-xs">{t.country}</td>
                    <td className="px-3 text-xs text-muted-foreground">{t.time ? new Date(t.time).toLocaleString() : "—"}</td>
                    <td className="px-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${
                        t.status === "Active" ? "bg-danger/10 text-danger border-danger/30" :
                        t.status === "Blocked" ? "bg-success/10 text-success border-success/30" :
                        t.status === "Mitigated" ? "bg-cyber/10 text-cyber border-cyber/30" :
                        "bg-warn/10 text-warn border-warn/30"
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No threats match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between p-3 border-t border-border/40 text-sm">
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded border border-border/60 hover:bg-accent disabled:opacity-50">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded border border-border/60 hover:bg-accent disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl p-6 glow-cyan">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{selected.id}</div>
                  <h2 className="text-xl font-semibold mt-1">{selected.type}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-accent"><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Severity"><SeverityBadge severity={selected.severity} /></Info>
                <Info label="Status">{selected.status}</Info>
                <Info label="Source IP"><span className="font-mono">{selected.source}</span></Info>
                <Info label="Destination"><span className="font-mono">{selected.destination}</span></Info>
                <Info label="Origin">{selected.country}</Info>
                <Info label="Time">{selected.time ? new Date(selected.time).toLocaleString() : "—"}</Info>
              </div>
              <div className="mt-4 p-3 bg-background/40 rounded-md text-sm text-muted-foreground">
                Auto-mitigation playbook engaged. Forensic snapshot captured. Source ASN flagged in threat-intel feed.
              </div>
              <div className="mt-5 flex gap-2 justify-end">
                <button onClick={() => setSelected(null)} className="px-3 py-2 rounded border border-border/60 hover:bg-accent text-sm">Close</button>
                <button onClick={() => markMitigated(selected)} className="px-3 py-2 rounded bg-cyber text-primary-foreground text-sm font-medium glow-cyan">Mark mitigated</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function ApiErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const msg = error instanceof Error ? error.message : "Something went wrong";
  return (
    <div className="py-12 grid place-items-center text-center gap-3 px-4">
      <div className="w-10 h-10 rounded-full bg-danger/15 grid place-items-center text-danger border border-danger/40">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="text-sm font-medium">Couldn't load data</div>
      <div className="text-xs text-muted-foreground max-w-md">{msg}</div>
      <button onClick={onRetry} className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber text-primary-foreground text-xs font-medium glow-cyan">
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );
}
