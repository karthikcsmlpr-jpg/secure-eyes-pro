import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/cyber/Logo";
import { ParticleField } from "@/components/cyber/ParticleField";
import { Mail, Lock, User, AtSign, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./login";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Create account — CyberShield" }] }),
});

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "", org: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const sc = useMemo(() => strength(form.password), [form.password]);
  const labels = ["Too short", "Weak", "Okay", "Strong", "Excellent"];
  const colors = ["bg-muted", "bg-danger", "bg-warn", "bg-cyber", "bg-success"];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) return toast.error("Fill all fields");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (sc < 2) return toast.error("Password too weak");
    setLoading(true);
    setTimeout(() => {
      toast.success("Account created — welcome to CyberShield");
      nav({ to: "/dashboard" });
    }, 900);
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-sidebar">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0"><ParticleField density={50} /></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-danger/20 blur-[120px]" />
        <div className="relative"><Logo /></div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold">Bring your team into the SOC</h2>
          <p className="mt-3 text-muted-foreground">Create your CyberShield workspace and start defending in minutes.</p>
        </div>
        <div className="relative text-xs text-muted-foreground">© CyberShield</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg glass rounded-2xl p-8 glow-cyan">
          <h1 className="text-2xl font-semibold">Create your workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">14-day free trial · no credit card required</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Field icon={User} label="Full Name" type="text" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
            <Field icon={AtSign} label="Username" type="text" value={form.username} onChange={set("username")} placeholder="janedoe" />
            <div className="sm:col-span-2"><Field icon={Mail} label="Email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" /></div>
            <div className="sm:col-span-2"><Field icon={Building2} label="Organization" type="text" value={form.org} onChange={set("org")} placeholder="Acme Corp" /></div>
            <Field icon={Lock} label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
            <Field icon={Lock} label="Confirm Password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />
          </div>
          <div className="mt-3">
            <div className="flex gap-1">
              {[0,1,2,3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded ${i < sc ? colors[sc] : "bg-muted"}`} />
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Strength: {labels[sc]}</div>
          </div>
          <button disabled={loading} className="mt-6 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-cyber text-primary-foreground font-medium glow-cyan hover:opacity-90 disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create account
          </button>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-cyber hover:underline">Sign in</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
