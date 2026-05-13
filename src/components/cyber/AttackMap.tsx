import { attackArcs, sevColor } from "@/lib/mock-data";
import { motion } from "framer-motion";

// Simplified world silhouette via a soft ellipse + grid; arcs animate over it.
export function AttackMap() {
  return (
    <div className="glass rounded-xl p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Global Attack Map</h3>
        <span className="text-xs text-muted-foreground">live · 7 active routes</span>
      </div>
      <div className="relative">
        <svg viewBox="0 0 1000 500" className="w-full h-[340px]">
          <defs>
            <radialGradient id="globe" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="oklch(0.32 0.08 260 / 0.6)" />
              <stop offset="100%" stopColor="oklch(0.16 0.04 265 / 0)" />
            </radialGradient>
            <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1" fill="oklch(0.72 0.18 235 / 0.25)" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="1000" height="500" fill="url(#globe)" />
          <ellipse cx="500" cy="260" rx="460" ry="200" fill="url(#dots)" opacity="0.55" />
          {/* lat/long lines */}
          {[100, 200, 300, 400].map((y) => (
            <line key={y} x1="40" x2="960" y1={y} y2={y} stroke="oklch(1 0 0 / 0.05)" />
          ))}
          {[200, 400, 600, 800].map((x) => (
            <line key={x} y1="40" y2="460" x1={x} x2={x} stroke="oklch(1 0 0 / 0.05)" />
          ))}
          {attackArcs.map((a, i) => {
            const mx = (a.from.x + a.to.x) / 2;
            const my = Math.min(a.from.y, a.to.y) - 80;
            const path = `M ${a.from.x} ${a.from.y} Q ${mx} ${my} ${a.to.x} ${a.to.y}`;
            const color = sevColor[a.severity];
            return (
              <g key={i}>
                <path d={path} fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
                <motion.circle
                  r="3.5"
                  fill={color}
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  style={{ offsetPath: `path("${path}")` } as React.CSSProperties}
                />
                <circle cx={a.from.x} cy={a.from.y} r="4" fill={color}>
                  <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={a.to.x} cy={a.to.y} r="3" fill="oklch(0.78 0.2 220)" />
                <text x={a.from.x + 6} y={a.from.y - 6} fontSize="10" fill="oklch(0.85 0.02 240)">{a.from.label}</text>
                <text x={a.to.x + 6} y={a.to.y - 6} fontSize="10" fill="oklch(0.7 0.03 250)">{a.to.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
