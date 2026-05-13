import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedCounter({ value, duration = 1.4, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {v.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
