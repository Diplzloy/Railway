"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 320, label: "объектов сдано" },
  { value: 98, label: "с первого раза" },
  { value: 9, label: "лет на рынке" },
  { value: 100, label: "млн ₽ страхование" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      stats.forEach((stat, index) => {
        let current = 0;
        const increment = stat.value / steps;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(timer);
          }
          setCounts((prev) => {
            const next = [...prev];
            next[index] = Math.round(current);
            return next;
          });
        }, interval);
      });
    }
  }, [isInView]);

  return (
    <section className="section bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="container-xl">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                {counts[index]}
                {stat.value === 98 ? "%" : ""}
                {stat.value === 100 ? "M" : ""}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}