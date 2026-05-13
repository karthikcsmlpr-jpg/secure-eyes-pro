import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SAMPLES = [
  "[INFO] cybershield-core boot OK — modules: ids, edr, waf, ti",
  "[INFO] threat-intel feed misp-public synced (12,442 IOCs)",
  "[WARN] failed login attempt user=root from 203.0.113.41",
  "[ERROR] malware signature MZ-7741 hit on EP-441",
  "[INFO] firewall_rule fw-egress-22 updated by analyst kovacs",
  "[ERROR] suspicious lateral movement detected on srv-db-07",
  "[WARN] DNS exfil suspected: cdn-update.malware-host.tk",
  "[INFO] auto-isolated host EP-441 — quarantine vlan 99",
  "[ERROR] privilege_escalation denied user=svc-deploy",
  "[INFO] WebAuthn auth user=m.singh from Berlin, DE",
  "[WARN] DDoS surge: 48,210 RPS on edge-eu-west-1",
  "[INFO] WAF rule cs-stuff-01 engaged — credential stuffing",
];

function color(line: string) {
  if (line.startsWith("[ERROR]")) return "text-danger";
  if (line.startsWith("[WARN]")) return "text-warn";
  if (line.startsWith("[INFO]")) return "text-cyber";
  return "text-muted-foreground";
}

export function LiveTerminal({ height = 320 }: { height?: number }) {
  const [lines, setLines] = useState<string[]>(() => SAMPLES.slice(0, 6));
  useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, SAMPLES[Math.floor(Math.random() * SAMPLES.length)]];
        return next.slice(-30);
      });
    }, 1100);
    return () => clearInterval(id);
  }, []);
  const now = new Date();
  return (
    <div className="glass rounded-xl overflow-hidden relative scanlines" style={{ height }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-background/40">
        <span className="w-2.5 h-2.5 rounded-full bg-danger" />
        <span className="w-2.5 h-2.5 rounded-full bg-warn" />
        <span className="w-2.5 h-2.5 rounded-full bg-success" />
        <span className="ml-3 text-xs text-muted-foreground font-mono">soc@cybershield: ~/live</span>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed h-[calc(100%-36px)] overflow-hidden">
        {lines.map((l, i) => {
          const ts = new Date(now.getTime() - (lines.length - i) * 1100);
          return (
            <motion.div
              key={i + l}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap"
            >
              <span className="text-muted-foreground">{ts.toISOString().slice(11, 19)} </span>
              <span className={color(l)}>{l}</span>
            </motion.div>
          );
        })}
        <div className="text-cyber font-mono">
          <span className="blink">▌</span>
        </div>
      </div>
    </div>
  );
}
