import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/cyber/Logo";
import { ParticleField } from "@/components/cyber/ParticleField";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "Reset password — CyberShield" }] }),
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Reset link sent");
    }, 800);
  }
  return (
    <div className="relative min-h-screen grid place-items-center p-6 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0"><ParticleField density={40} /></div>
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyber/20 blur-[140px]" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass rounded-2xl p-8 glow-cyan">
        <div className="mb-6"><Logo /></div>
        {sent ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 grid place-items-center rounded-full bg-success/15 text-success border border-success/40 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold">Check your inbox</h1>
            <p className="text-sm text-muted-foreground mt-2">We sent a reset link to <span className="text-foreground">{email}</span>.</p>
            <Link to="/login" className="inline-flex mt-6 px-4 py-2 rounded-md border border-border/60 hover:bg-accent">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1">We'll email you a secure reset link.</p>
            <div className="mt-6">
              <Field icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
            </div>
            <button disabled={loading} className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-cyber text-primary-foreground font-medium glow-cyan hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Send reset link
            </button>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Remember it? <Link to="/login" className="text-cyber hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
