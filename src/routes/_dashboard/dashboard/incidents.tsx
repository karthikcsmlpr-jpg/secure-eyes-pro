import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Siren, Clock, User as UserIcon, CheckCircle2, FileText } from "lucide-react";
import { SeverityBadge } from "@/components/cyber/SeverityBadge";
import { incidents as initial, type Incident } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/dashboard/incidents")({
  component: IncidentsPage,
  head: () => ({ meta: [{ title: "Incidents — CyberShield" }] }),
});

function IncidentsPage() {
  const [list, setList] = useState<Incident[]>(initial);
  const [active, setActive] = useState<Incident>(initial[0]);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Record<string, string[]>>({});

  function resolve(id: string) {
    setList((l) => l.map((i) => (i.id === id ? { ...i, status: "Resolved" } : i)));
    setActive((a) => (a.id === id ? { ...a, status: "Resolved" } : a));
    toast.success("Incident resolved");
  }
  function addNote() {
    if (!note.trim()) return;
    setNotes((n) => ({ ...n, [active.id]: [...(n[active.id] || []), note.trim()] }));
    setNote("");
    toast("Note added");
  }

  const statusColor = (s: Incident["status"]) =>
    s === "Open" ? "bg-danger/15 text-danger border-danger/40" :
    s === "In Progress" ? "bg-warn/15 text-warn border-warn/40" :
    "bg-success/15 text-success border-success/40";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Incident Response</h1>
        <p className="text-sm text-muted-foreground mt-1">Track, assign, and resolve security incidents</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          {list.map((inc) => (
            <motion.button
              key={inc.id} onClick={() => setActive(inc)}
              whileHover={{ y: -2 }}
              className={`w-full text-left glass rounded-xl p-4 transition ${active.id === inc.id ? "glow-cyan border-cyber/50" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 rounded-lg bg-danger/10 text-danger grid place-items-center border border-danger/30">
                    <Siren className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyber">{inc.id}</div>
                    <div className="text-sm font-medium mt-0.5 line-clamp-2">{inc.title}</div>
                  </div>
                </div>
                <SeverityBadge severity={inc.priority} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${statusColor(inc.status)}`}>{inc.status}</span>
                <span className="text-muted-foreground inline-flex items-center gap-1"><UserIcon className="w-3 h-3" />{inc.assignee}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="glass rounded-xl p-5 lg:col-span-2 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-mono text-cyber">{active.id}</div>
              <h2 className="text-xl font-semibold mt-1">{active.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{active.description}</p>
            </div>
            <button
              onClick={() => resolve(active.id)}
              disabled={active.status === "Resolved"}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-success/15 text-success border border-success/40 hover:bg-success/25 disabled:opacity-40 text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4" /> {active.status === "Resolved" ? "Resolved" : "Resolve"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Meta label="Priority"><SeverityBadge severity={active.priority} /></Meta>
            <Meta label="Status"><span className={`px-2 py-0.5 rounded-full border ${statusColor(active.status)}`}>{active.status}</span></Meta>
            <Meta label="Assignee">{active.assignee}</Meta>
            <Meta label="Opened">{new Date(active.opened).toLocaleString()}</Meta>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-cyber" /> Response Timeline</h3>
            <ol className="relative border-l border-border/60 ml-2 space-y-3">
              {active.timeline.map((e, i) => (
                <li key={i} className="ml-4">
                  <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-cyber glow-cyan" />
                  <div className="text-xs text-muted-foreground font-mono">{e.time}</div>
                  <div className="text-sm">{e.event}</div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-cyber" /> Notes</h3>
            <div className="space-y-2 mb-3">
              {(notes[active.id] || []).map((n, i) => (
                <div key={i} className="text-sm bg-background/40 border border-border/40 rounded-md p-2.5">{n}</div>
              ))}
              {!(notes[active.id]?.length) && <div className="text-xs text-muted-foreground">No notes yet — add the first.</div>}
            </div>
            <div className="flex gap-2">
              <input
                value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Add a response note…"
                className="flex-1 px-3 py-2 rounded-md bg-input border border-border/60 outline-none text-sm focus:border-cyber focus:ring-2 focus:ring-cyber/30"
              />
              <button onClick={addNote} className="px-4 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium hover:opacity-90">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
