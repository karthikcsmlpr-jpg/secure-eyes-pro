import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Building2, Shield, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboard/dashboard/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — CyberShield" }] }),
});

function ProfilePage() {
  const [name, setName] = useState("Anna Kovacs");
  const [email, setEmail] = useState("anna.kovacs@cybershield.test");
  const [org, setOrg] = useState("CyberShield Inc.");
  const [role] = useState("Lead Security Analyst");

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information and credentials</p>
      </div>

      <div className="glass rounded-xl p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber to-chart-5 grid place-items-center text-2xl font-semibold text-primary-foreground glow-cyan">AK</div>
          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-success border-2 border-background" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{role} · {org}</p>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-cyber/15 text-cyber border border-cyber/40">Admin</span>
            <span className="px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/40">2FA Enabled</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}
        className="glass rounded-xl p-6 space-y-4"
      >
        <h3 className="font-semibold">Personal information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full name" icon={Shield} value={name} onChange={setName} />
          <Input label="Role" icon={Shield} value={role} onChange={() => {}} disabled />
          <Input label="Email" icon={Mail} value={email} onChange={setEmail} type="email" />
          <Input label="Organization" icon={Building2} value={org} onChange={setOrg} />
        </div>
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium glow-cyan">
            <Save className="w-4 h-4" /> Save changes
          </button>
        </div>
      </form>

      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}
        className="glass rounded-xl p-6 space-y-4"
      >
        <h3 className="font-semibold flex items-center gap-2"><KeyRound className="w-4 h-4 text-cyber" /> Change password</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Current" icon={KeyRound} type="password" value="" onChange={() => {}} />
          <Input label="New" icon={KeyRound} type="password" value="" onChange={() => {}} />
          <Input label="Confirm" icon={KeyRound} type="password" value="" onChange={() => {}} />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-md bg-cyber text-primary-foreground text-sm font-medium glow-cyan">Update password</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, icon: Icon, value, onChange, type = "text", disabled }: {
  label: string; icon: typeof Mail; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type={type} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-md bg-input border border-border/60 outline-none focus:border-cyber focus:ring-2 focus:ring-cyber/30 disabled:opacity-60" />
      </div>
    </label>
  );
}
