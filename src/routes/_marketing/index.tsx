import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldAlert, Brain, Activity, Lock, Siren, ScrollText, BarChart3, Gauge,
  ArrowRight, Play, Check,
} from "lucide-react";
import { ParticleField } from "@/components/cyber/ParticleField";
import { LiveTerminal } from "@/components/cyber/LiveTerminal";
import { AttackMap } from "@/components/cyber/AttackMap";
import { AnimatedCounter } from "@/components/cyber/AnimatedCounter";

export const Route = createFileRoute("/_marketing/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "CyberShield — Real-Time Threat Monitoring & Incident Response" },
      { name: "description", content: "Monitor cyber threats, detect suspicious activity, analyze attacks and respond instantly with CyberShield SOC." },
    ],
  }),
});

const FEATURES = [
  { icon: ShieldAlert, title: "Threat Detection", desc: "Multi-vector detection across network, endpoint, identity & cloud." },
  { icon: Brain, title: "AI Threat Analysis", desc: "Behavioral models surface unknown attacks before they escalate." },
  { icon: Activity, title: "Real-Time Monitoring", desc: "Sub-second telemetry from every asset in your environment." },
  { icon: Lock, title: "Secure Authentication", desc: "WebAuthn, SSO, and adaptive MFA built-in." },
  { icon: Siren, title: "Incident Response", desc: "Automated playbooks with full timeline and forensics." },
  { icon: ScrollText, title: "Log Analysis", desc: "Petabyte-scale search across logs, packets, and events." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Executive and analyst views, ready out of the box." },
  { icon: Gauge, title: "Risk Assessment", desc: "Continuous scoring tied to MITRE ATT&CK coverage." },
];

const STATS = [
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
  { value: 500000, suffix: "+", label: "Threats Blocked" },
  { value: 120, suffix: "+", label: "Enterprise Clients" },
  { value: 24, suffix: "/7", label: "SOC Coverage" },
];

const TESTIMONIALS = [
  { quote: "CyberShield cut our MTTR from hours to minutes. Our analysts finally focus on real threats.", name: "Mira Adler", role: "CISO, Northwind Bank" },
  { quote: "The clearest SOC platform we've deployed. The map and timeline alone changed how we triage.", name: "Daniel Park", role: "Head of SecOps, Helix Health" },
  { quote: "Detection coverage doubled in 3 weeks and our auditors love the evidence trail.", name: "Sara Okafor", role: "Director of Security, Atlas Pay" },
];

function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-40" />
        <div className="absolute inset-0">
          <ParticleField density={70} />
        </div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-cyber/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/40 bg-cyber/5 text-xs text-cyber mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber blink" />
              SOC v4.2 — Live Operations Online
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Real-Time <span className="text-cyber text-glow">Threat Monitoring</span> &<br />
              <span className="text-glow-red text-danger">Incident Response</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Monitor cyber threats, detect suspicious activity, analyze attacks and respond instantly using an advanced security operations platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-cyber text-primary-foreground font-medium glow-cyan hover:opacity-90 transition">
                Start Monitoring <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#demo" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border/60 hover:bg-accent transition">
                <Play className="w-4 h-4" /> Live Demo
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              {["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"].map((b) => (
                <span key={b} className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success" />{b}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
            id="demo"
          >
            <div className="absolute -inset-6 bg-cyber/20 blur-3xl rounded-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="col-span-2 glass rounded-xl p-4 glow-cyan">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Threat Activity · last 24h</span>
                  <span className="text-cyber">+12.4%</span>
                </div>
                <Sparkline />
              </div>
              <FloatingCard delay={0.1} icon={ShieldAlert} title="Active Threats" value="42" tone="danger" />
              <FloatingCard delay={0.25} icon={Activity} title="Events / sec" value="18.2k" tone="cyber" />
              <div className="col-span-2">
                <LiveTerminal height={220} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold">An entire SOC, in one platform</h2>
            <p className="mt-3 text-muted-foreground">Everything your security team needs to detect, investigate, and respond — with the polish of a modern product.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group glass rounded-xl p-5 hover:border-cyber/40 hover:glow-cyan transition relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cyber/10 blur-2xl group-hover:bg-cyber/30 transition" />
                <div className="relative">
                  <div className="w-10 h-10 grid place-items-center rounded-lg bg-cyber/10 text-cyber border border-cyber/30 mb-4">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP / SOLUTIONS */}
      <section id="solutions" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">See every attack, the moment it happens</h2>
            <p className="mt-3 text-muted-foreground max-w-lg">
              Our global telemetry mesh streams attacks from edges in 38 regions into a single, beautifully calm SOC view. Less noise, more signal.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "MITRE ATT&CK-mapped detections",
                "Auto-isolation playbooks",
                "Threat intel from 70+ feeds",
                "Forensic snapshots on every incident",
              ].map((p) => (
                <li key={p} className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> {p}</li>
              ))}
            </ul>
          </div>
          <AttackMap />
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 border-y border-border/60 bg-background/40">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-cyber text-glow">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Simple, scalable pricing</h2>
            <p className="mt-3 text-muted-foreground">From growing teams to global SOCs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Team", price: "$499", per: "/mo", features: ["Up to 50 assets", "8x5 monitoring", "Email alerts"] },
              { name: "Business", price: "$1,899", per: "/mo", featured: true, features: ["Up to 500 assets", "24/7 monitoring", "Playbooks & API"] },
              { name: "Enterprise", price: "Custom", per: "", features: ["Unlimited", "Dedicated SOC", "On-prem option"] },
            ].map((p) => (
              <div key={p.name} className={`glass rounded-2xl p-6 relative ${p.featured ? "border-cyber/50 glow-cyan" : ""}`}>
                {p.featured && <span className="absolute -top-3 left-6 text-[10px] uppercase tracking-widest bg-cyber text-primary-foreground px-2 py-0.5 rounded">Most popular</span>}
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-3xl font-semibold">{p.price}</span>
                  <span className="text-muted-foreground text-sm pb-1">{p.per}</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {p.features.map((f) => (<li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-success" />{f}</li>))}
                </ul>
                <Link to="/register" className="mt-6 inline-flex w-full justify-center px-4 py-2 rounded-md bg-cyber text-primary-foreground font-medium hover:opacity-90">Get started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">Trusted by security leaders</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass rounded-xl p-6">
                <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber to-chart-5" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="glass rounded-2xl p-10 text-center relative overflow-hidden glow-cyan">
            <div className="absolute inset-0 cyber-grid opacity-20" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold">Bring your SOC online in days</h2>
              <p className="mt-3 text-muted-foreground">Start a free trial or talk to our security team about a custom deployment.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/register" className="px-5 py-3 rounded-md bg-cyber text-primary-foreground font-medium hover:opacity-90">Start free trial</Link>
                <a href="mailto:sales@cybershield.test" className="px-5 py-3 rounded-md border border-border/60 hover:bg-accent">Contact sales</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FloatingCard({
  icon: Icon, title, value, tone, delay = 0,
}: { icon: typeof ShieldAlert; title: string; value: string; tone: "danger" | "cyber"; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass rounded-xl p-4 animate-float ${tone === "danger" ? "glow-red" : "glow-cyan"}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{title}</div>
        <Icon className={`w-4 h-4 ${tone === "danger" ? "text-danger" : "text-cyber"}`} />
      </div>
      <div className={`mt-2 text-2xl font-semibold ${tone === "danger" ? "text-danger text-glow-red" : "text-cyber text-glow"}`}>{value}</div>
    </motion.div>
  );
}

function Sparkline() {
  const pts = Array.from({ length: 40 }, (_, i) => 30 + Math.sin(i / 3) * 14 + Math.random() * 10);
  const w = 600, h = 90;
  const max = Math.max(...pts), min = Math.min(...pts);
  const path = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.18 235 / 0.5)" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 235 / 0)" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#sg)" />
      <path d={path} fill="none" stroke="oklch(0.78 0.2 220)" strokeWidth="2" />
    </svg>
  );
}
