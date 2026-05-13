import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Download } from "lucide-react";
import { attackTimeline, blockedByDay, attackTypes, topSources } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/dashboard/analytics")({
  component: AnalyticsPage,
  head: () => ({ meta: [{ title: "Analytics — CyberShield" }] }),
});

const ts = {
  backgroundColor: "oklch(0.19 0.045 265 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12,
};

const detection = [
  { stage: "Recon", value: 88 },
  { stage: "Initial Access", value: 92 },
  { stage: "Execution", value: 78 },
  { stage: "Persistence", value: 70 },
  { stage: "Lateral Movement", value: 81 },
  { stage: "Exfiltration", value: 95 },
];

function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Trends, sources, and detection coverage</p>
        </div>
        <button onClick={() => toast.success("Report queued for download")} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium glow-cyan">
          <Download className="w-4 h-4" /> Download report
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2">Attack Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={attackTimeline}>
              <defs>
                <linearGradient id="a1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Area type="monotone" dataKey="attacks" stroke="var(--danger)" fill="url(#a1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-2">Detection Success Rate</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={detection}>
              <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
              <PolarAngleAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={10} />
              <PolarRadiusAxis stroke="var(--muted-foreground)" fontSize={10} />
              <Radar dataKey="value" stroke="var(--cyber)" fill="var(--cyber)" fillOpacity={0.4} />
              <Tooltip contentStyle={ts} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-2">Weekly Blocked Threats</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={blockedByDay}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="blocked" fill="var(--cyber)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-2">Threat Categories</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attackTypes} layout="vertical">
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} width={90} />
              <Tooltip contentStyle={ts} />
              <Bar dataKey="value" fill="var(--chart-5)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3">Top Attack Sources</h3>
          <ul className="space-y-2">
            {topSources.map((s, i) => {
              const max = topSources[0].attacks;
              const pct = (s.attacks / max) * 100;
              return (
                <li key={s.code}>
                  <div className="flex items-center justify-between text-sm">
                    <span><span className="text-muted-foreground mr-2">{i + 1}.</span>{s.country}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.attacks.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyber to-danger" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-2">User Activity (events / hour)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={attackTimeline}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={ts} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="blocked" name="logins" stroke="var(--success)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="attacks" name="api calls" stroke="var(--cyber)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
