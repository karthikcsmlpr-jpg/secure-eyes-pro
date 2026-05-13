import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  ShieldAlert, ShieldCheck, Flame, HeartPulse, Network, Cpu,
  TrendingUp, TrendingDown, ArrowRight,
} from "lucide-react";
import { AnimatedCounter } from "@/components/cyber/AnimatedCounter";
import { LiveTerminal } from "@/components/cyber/LiveTerminal";
import { AttackMap } from "@/components/cyber/AttackMap";
import { SeverityBadge } from "@/components/cyber/SeverityBadge";
import { threats, attackTimeline, attackTypes, blockedByDay, trafficArea } from "@/lib/mock-data";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: DashboardOverview,
  head: () => ({ meta: [{ title: "Dashboard — CyberShield SOC" }] }),
});

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const tooltipStyle = {
  backgroundColor: "oklch(0.19 0.045 265 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 8,
  fontSize: 12,
};

function StatCard({
  title, value, icon: Icon, trend, tone = "cyber", suffix = "",
}: { title: string; value: number; icon: typeof ShieldAlert; trend: number; tone?: "cyber" | "danger" | "warn" | "success"; suffix?: string }) {
  const toneClass = { cyber: "text-cyber", danger: "text-danger", warn: "text-warn", success: "text-success" }[tone];
  const glow = tone === "danger" ? "glow-red" : "glow-cyan";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-5 hover:${glow} transition relative overflow-hidden`}
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-cyber/10 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{title}</span>
        <Icon className={`w-4 h-4 ${toneClass}`} />
      </div>
      <div className={`mt-3 text-3xl font-semibold ${toneClass}`}>
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs">
        {trend >= 0 ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-danger" />}
        <span className={trend >= 0 ? "text-success" : "text-danger"}>{trend > 0 ? "+" : ""}{trend}%</span>
        <span className="text-muted-foreground">vs last 24h</span>
      </div>
    </motion.div>
  );
}

function DashboardOverview() {
  const recent = threats.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Security Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">Live overview of your environment · last 24 hours</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Active Threats" value={42} trend={8} icon={ShieldAlert} tone="danger" />
        <StatCard title="Threats Blocked" value={18247} trend={12} icon={ShieldCheck} tone="success" />
        <StatCard title="Critical Incidents" value={3} trend={-25} icon={Flame} tone="warn" />
        <StatCard title="System Health" value={99} trend={1} suffix="%" icon={HeartPulse} tone="success" />
        <StatCard title="Network Status" value={1240} trend={4} suffix=" Mbps" icon={Network} tone="cyber" />
        <StatCard title="CPU Usage" value={37} trend={-3} suffix="%" icon={Cpu} tone="cyber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Attacks vs Blocked (24h)</h3>
            <span className="text-xs text-muted-foreground">per hour</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={attackTimeline}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="attacks" stroke="var(--danger)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="blocked" stroke="var(--cyber)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-2">Attack Types</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Pie data={attackTypes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {attackTypes.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-2">Blocked by Day</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={blockedByDay}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="blocked" fill="var(--cyber)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2">Network Traffic</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficArea}>
              <defs>
                <linearGradient id="ai" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyber)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--cyber)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ao" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="in" stroke="var(--cyber)" fill="url(#ai)" />
              <Area type="monotone" dataKey="out" stroke="var(--chart-5)" fill="url(#ao)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AttackMap />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Threats</h3>
            <a href="/dashboard/threats" className="text-xs text-cyber inline-flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="text-left py-2 pr-3">ID</th>
                  <th className="text-left pr-3">Type</th>
                  <th className="text-left pr-3">Severity</th>
                  <th className="text-left pr-3">Source</th>
                  <th className="text-left pr-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t) => (
                  <tr key={t.id} className="border-b border-border/30 hover:bg-accent/30 transition">
                    <td className="py-2 pr-3 font-mono text-xs text-cyber">{t.id}</td>
                    <td className="pr-3">{t.type}</td>
                    <td className="pr-3"><SeverityBadge severity={t.severity} /></td>
                    <td className="pr-3 font-mono text-xs">{t.source}</td>
                    <td className="pr-3 text-xs text-muted-foreground">{new Date(t.time).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-4">
          <SystemHealth />
          <LiveTerminal height={260} />
        </div>
      </div>
    </div>
  );
}

function HealthBar({ label, value, tone = "cyber" }: { label: string; value: number; tone?: "cyber" | "warn" | "success" | "danger" }) {
  const color = { cyber: "var(--cyber)", warn: "var(--warn)", success: "var(--success)", danger: "var(--danger)" }[tone];
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} style={{ background: color }} className="h-full rounded-full" />
      </div>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="glass rounded-xl p-4">
      <h3 className="font-semibold mb-3">System Health</h3>
      <div className="space-y-3">
        <HealthBar label="CPU Usage" value={37} />
        <HealthBar label="Memory" value={62} tone="warn" />
        <HealthBar label="Bandwidth" value={48} />
        <HealthBar label="Disk I/O" value={21} tone="success" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-success/10 text-success border border-success/30">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Firewall · OK
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-success/10 text-success border border-success/30">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> IDS · OK
        </div>
      </div>
    </div>
  );
}
