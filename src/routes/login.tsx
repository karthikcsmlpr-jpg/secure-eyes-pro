import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/cyber/Logo";
import { ParticleField } from "@/components/cyber/ParticleField";
import { Mail, Lock, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Login — CyberShield" }] }),
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Welcome back, Analyst");
      nav({ to: "/dashboard" });
    }, 900);
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-sidebar">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0"><ParticleField density={50} /></div>
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-cyber/30 blur-[120px]" />
        <div className="relative"><Logo /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber/40 bg-cyber/5 text-xs text-cyber mb-4">
            <Shield className="w-3.5 h-3.5" /> Secure Sign-In
          </div>
          <h2 className="text-3xl font-semibold leading-tight">
            Step inside the <span className="text-cyber text-glow">SOC</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Live threat telemetry, response playbooks, and forensics — already running, waiting for you.
          </p>
        </motion.div>
        <div className="relative text-xs text-muted-foreground">© CyberShield · SOC v4.2</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass rounded-2xl p-8 glow-cyan"
        >
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your security operations dashboard</p>

          <div className="mt-6 space-y-4">
            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="analyst@company.com" />
            <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-cyber" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-cyber hover:underline">Forgot password?</Link>
            </div>
            <button
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-cyber text-primary-foreground font-medium glow-cyan hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Authenticating…" : "Login"}
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
            </div>
            <button type="button" className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md border border-border/60 hover:bg-accent">
              <GoogleIcon /> Continue with Google
            </button>
            <p className="text-sm text-center text-muted-foreground">
              No account? <Link to="/register" className="text-cyber hover:underline">Create one</Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, label, type, value, onChange, placeholder }: {
  icon: typeof Mail; label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <div className="relative group">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-cyber transition" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 rounded-md bg-input border border-border/60 outline-none focus:border-cyber focus:ring-2 focus:ring-cyber/30 transition"
        />
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
