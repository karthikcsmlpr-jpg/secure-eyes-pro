import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Lock, KeyRound, Smartphone, Trash2, Plus, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/dashboard/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — CyberShield" }] }),
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 rounded-full transition ${checked ? "bg-cyber glow-cyan" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      {children}
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: typeof Bell; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-2 flex items-center gap-2"><Icon className="w-4 h-4 text-cyber" /> {title}</h3>
      <div className="divide-y divide-border/40">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "midnight">("dark");
  const [notif, setNotif] = useState({ email: true, push: true, sms: false, digest: true });
  const [twofa, setTwofa] = useState(true);
  const [keys, setKeys] = useState([
    { id: "k_live_3hf2…aB7", label: "Production · SIEM ingest", created: "2025-04-12" },
    { id: "k_live_8jq2…xL1", label: "Webhook · PagerDuty", created: "2025-03-02" },
  ]);
  const [sessions] = useState([
    { device: "MacBook Pro · Berlin, DE", current: true, last: "now" },
    { device: "iPhone 15 · Berlin, DE", current: false, last: "2h ago" },
    { device: "Chrome · London, UK", current: false, last: "3d ago" },
  ]);

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Workspace preferences, security, and integrations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Appearance" icon={Bell}>
          <Row title="Theme" desc="Pick your preferred color palette">
            <select value={theme} onChange={(e) => setTheme(e.target.value as "dark" | "midnight")} className="px-2 py-1.5 rounded-md bg-input border border-border/60 text-sm">
              <option value="dark">Cyber Dark</option>
              <option value="midnight">Midnight Navy</option>
            </select>
          </Row>
        </Card>

        <Card title="Notifications" icon={Bell}>
          <Row title="Email alerts" desc="Critical incidents and digests"><Toggle checked={notif.email} onChange={(v) => setNotif({ ...notif, email: v })} /></Row>
          <Row title="Push" desc="Browser push for active threats"><Toggle checked={notif.push} onChange={(v) => setNotif({ ...notif, push: v })} /></Row>
          <Row title="SMS" desc="High severity only"><Toggle checked={notif.sms} onChange={(v) => setNotif({ ...notif, sms: v })} /></Row>
          <Row title="Weekly digest" desc="Summary every Monday morning"><Toggle checked={notif.digest} onChange={(v) => setNotif({ ...notif, digest: v })} /></Row>
        </Card>

        <Card title="Security" icon={Lock}>
          <Row title="Two-factor authentication" desc="Authenticator app or hardware key"><Toggle checked={twofa} onChange={setTwofa} /></Row>
          <Row title="Sign-in alerts" desc="Notify on new device sign-in"><Toggle checked={true} onChange={() => {}} /></Row>
          <Row title="Auto-lock" desc="Lock workstation after 15 min idle"><Toggle checked={true} onChange={() => {}} /></Row>
        </Card>

        <Card title="Sessions" icon={Smartphone}>
          {sessions.map((s) => (
            <Row key={s.device} title={s.device} desc={s.current ? "This device · active now" : `Last active ${s.last}`}>
              {s.current
                ? <span className="text-xs text-success">Current</span>
                : <button onClick={() => toast("Session revoked")} className="text-xs text-danger hover:underline">Revoke</button>}
            </Row>
          ))}
        </Card>

        <div className="lg:col-span-2">
          <Card title="API Keys" icon={KeyRound}>
            <div className="py-2">
              <button onClick={() => {
                  const id = `k_live_${Math.random().toString(36).slice(2, 6)}…${Math.random().toString(36).slice(2, 5)}`;
                  setKeys((k) => [{ id, label: "New key", created: new Date().toISOString().slice(0, 10) }, ...k]);
                  toast.success("API key generated");
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium glow-cyan">
                <Plus className="w-4 h-4" /> Generate new key
              </button>
            </div>
            {keys.map((k) => (
              <div key={k.id} className="py-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium">{k.label}</div>
                  <div className="text-xs font-mono text-muted-foreground">{k.id} · created {k.created}</div>
                </div>
                <button onClick={() => { navigator.clipboard?.writeText(k.id); toast("Copied"); }} className="p-2 rounded hover:bg-accent"><Copy className="w-4 h-4" /></button>
                <button onClick={() => { setKeys((ks) => ks.filter((x) => x.id !== k.id)); toast("Key revoked"); }} className="p-2 rounded hover:bg-accent text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
