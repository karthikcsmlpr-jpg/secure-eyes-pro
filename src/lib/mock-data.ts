export type Severity = "Critical" | "High" | "Medium" | "Low";
export type ThreatStatus = "Active" | "Mitigated" | "Investigating" | "Blocked";

export interface Threat {
  id: string;
  type: string;
  severity: Severity;
  source: string;
  destination: string;
  time: string;
  status: ThreatStatus;
  country: string;
}

const types = [
  "DDoS Attack", "SQL Injection", "Brute Force", "Malware", "Phishing",
  "Ransomware", "XSS", "Port Scan", "Privilege Escalation", "Zero-Day Exploit",
];
const countries = ["RU", "CN", "US", "BR", "IR", "KP", "DE", "IN", "FR", "NG"];
const statuses: ThreatStatus[] = ["Active", "Mitigated", "Investigating", "Blocked"];
const sevs: Severity[] = ["Critical", "High", "Medium", "Low"];

function rand<T>(a: T[]) { return a[Math.floor(Math.random() * a.length)]; }
function ip() {
  return `${1 + ((Math.random() * 254) | 0)}.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}`;
}

export const threats: Threat[] = Array.from({ length: 48 }, (_, i) => {
  const d = new Date(Date.now() - i * 1000 * 60 * (3 + Math.random() * 30));
  return {
    id: `THR-${(10000 + i).toString()}`,
    type: rand(types),
    severity: rand(sevs),
    source: ip(),
    destination: ip(),
    time: d.toISOString(),
    status: rand(statuses),
    country: rand(countries),
  };
});

export interface Incident {
  id: string;
  title: string;
  priority: Severity;
  status: "Open" | "In Progress" | "Resolved";
  assignee: string;
  opened: string;
  description: string;
  timeline: { time: string; event: string }[];
}

export const incidents: Incident[] = [
  {
    id: "INC-2041",
    title: "Suspicious lateral movement on prod cluster",
    priority: "Critical",
    status: "In Progress",
    assignee: "A. Kovacs",
    opened: "2025-05-13T08:42:00Z",
    description: "Unusual SMB traffic detected between staging and production database nodes.",
    timeline: [
      { time: "08:42", event: "Detection: anomalous SMB packets" },
      { time: "08:44", event: "Auto-isolation of node srv-db-07" },
      { time: "09:01", event: "Analyst Kovacs assigned" },
      { time: "09:18", event: "Forensic snapshot captured" },
    ],
  },
  {
    id: "INC-2040",
    title: "Credential stuffing attempt against /login",
    priority: "High",
    status: "Open",
    assignee: "M. Singh",
    opened: "2025-05-13T07:05:00Z",
    description: "12,400 failed logins from rotating residential proxies in 9 minutes.",
    timeline: [
      { time: "07:05", event: "Rate threshold exceeded" },
      { time: "07:06", event: "WAF rule cs-stuff-01 engaged" },
    ],
  },
  {
    id: "INC-2039",
    title: "Outbound connection to known C2 server",
    priority: "Critical",
    status: "Resolved",
    assignee: "L. Park",
    opened: "2025-05-12T22:11:00Z",
    description: "Endpoint EP-441 reached out to a flagged command-and-control IP.",
    timeline: [
      { time: "22:11", event: "C2 IP match (TI feed: misp-public)" },
      { time: "22:12", event: "Endpoint quarantined" },
      { time: "22:55", event: "Reimaged and returned to service" },
    ],
  },
  {
    id: "INC-2038",
    title: "Privilege escalation attempt — IAM",
    priority: "Medium",
    status: "In Progress",
    assignee: "J. Okafor",
    opened: "2025-05-12T18:30:00Z",
    description: "User svc-deploy attempted to assume admin role outside change window.",
    timeline: [{ time: "18:30", event: "AssumeRole denied" }],
  },
  {
    id: "INC-2037",
    title: "Phishing campaign targeting finance team",
    priority: "High",
    status: "Open",
    assignee: "R. Fernández",
    opened: "2025-05-12T14:02:00Z",
    description: "47 emails impersonating CFO sent from look-alike domain.",
    timeline: [{ time: "14:02", event: "Email gateway flagged sender" }],
  },
];

export const attackTimeline = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h.toString().padStart(2, "0")}:00`,
  attacks: 200 + Math.round(Math.sin(h / 3) * 120 + Math.random() * 180),
  blocked: 180 + Math.round(Math.sin(h / 3) * 110 + Math.random() * 160),
}));

export const attackTypes = [
  { name: "DDoS", value: 32 },
  { name: "Malware", value: 24 },
  { name: "Phishing", value: 18 },
  { name: "Brute Force", value: 14 },
  { name: "SQLi / XSS", value: 12 },
];

export const blockedByDay = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  blocked: 1200 + Math.round(Math.random() * 1800),
}));

export const trafficArea = Array.from({ length: 30 }, (_, i) => ({
  t: i,
  in: 400 + Math.round(Math.sin(i / 2) * 120 + Math.random() * 200),
  out: 320 + Math.round(Math.cos(i / 2) * 100 + Math.random() * 180),
}));

export const topSources = [
  { country: "Russia", code: "RU", attacks: 14820 },
  { country: "China", code: "CN", attacks: 12340 },
  { country: "Iran", code: "IR", attacks: 6210 },
  { country: "North Korea", code: "KP", attacks: 4890 },
  { country: "Brazil", code: "BR", attacks: 3120 },
  { country: "United States", code: "US", attacks: 2710 },
];

export const logSamples = [
  { level: "ERROR", msg: "Unauthorized access attempt on /api/admin from 203.0.113.41" },
  { level: "WARN", msg: "Multiple failed login attempts for user 'root'" },
  { level: "INFO", msg: "Firewall rule fw-egress-22 updated by analyst kovacs" },
  { level: "ERROR", msg: "Malware signature MZ-7741 detected on endpoint EP-441" },
  { level: "WARN", msg: "Suspicious outbound DNS query: cdn-update.malware-host.tk" },
  { level: "INFO", msg: "IDS heartbeat OK — 0 dropped packets in last 60s" },
  { level: "ERROR", msg: "TLS handshake failure with peer 198.51.100.7 (cipher mismatch)" },
  { level: "DEBUG", msg: "Threat intel feed misp-public refreshed (12,442 indicators)" },
  { level: "WARN", msg: "Privilege escalation attempt by svc-deploy denied" },
  { level: "INFO", msg: "Backup completed for cluster prod-eu-west-1" },
  { level: "ERROR", msg: "Ransomware behavior detected — process isolated" },
  { level: "INFO", msg: "User m.singh authenticated via WebAuthn from Berlin, DE" },
];

export interface AttackArc {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
  severity: Severity;
}

// Coordinates are SVG % within a 1000x500 viewBox
export const attackArcs: AttackArc[] = [
  { from: { x: 760, y: 180, label: "Moscow" }, to: { x: 480, y: 230, label: "Frankfurt" }, severity: "Critical" },
  { from: { x: 850, y: 220, label: "Beijing" }, to: { x: 250, y: 240, label: "New York" }, severity: "High" },
  { from: { x: 720, y: 260, label: "Tehran" }, to: { x: 470, y: 250, label: "Paris" }, severity: "Medium" },
  { from: { x: 870, y: 230, label: "Pyongyang" }, to: { x: 200, y: 230, label: "Toronto" }, severity: "Critical" },
  { from: { x: 320, y: 360, label: "São Paulo" }, to: { x: 240, y: 240, label: "Dallas" }, severity: "Low" },
  { from: { x: 540, y: 280, label: "Lagos" }, to: { x: 470, y: 230, label: "London" }, severity: "High" },
  { from: { x: 800, y: 290, label: "Mumbai" }, to: { x: 880, y: 360, label: "Sydney" }, severity: "Medium" },
];

export const sevColor: Record<Severity, string> = {
  Critical: "var(--danger)",
  High: "var(--warn)",
  Medium: "var(--chart-5)",
  Low: "var(--success)",
};
