"use client";
import { useEffect, useRef, useState } from "react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let cur = 0;
          const timer = setInterval(() => {
            cur = Math.min(cur + Math.ceil(to / 50), to);
            setVal(cur);
            if (cur >= to) clearInterval(timer);
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return <div ref={ref} className="text-5xl font-black text-white mb-2">{val}{suffix}</div>;
}

const items = [
  { to: 320, suffix: "+", label: "реализованных объектов", desc: "ТЦ, склады, бизнес-центры" },
  { to: 98, suffix: "%", label: "сдач МЧС с первого раза", desc: "Внутренний аудит перед каждым проектом" },
  { to: 7, suffix: "", label: "инженеров в штате", desc: "Со всеми допусками СРО" },
  { to: 10, suffix: "+", label: "лет в отрасли", desc: "На рынке с 2014 года" },
];

export default function Stats() {
  return (
    <section className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <div key={item.label} className="card-dark p-8">
              <CountUp to={item.to} suffix={item.suffix} />
              <div className="font-semibold text-white text-sm mb-1">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
