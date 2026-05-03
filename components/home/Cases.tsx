"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";

const cases = [
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    client: "Торговый центр «Горизонт»",
    location: "Москва, ул. Примерная, д. 1",
    type: "Монтаж АПС и СОУЭ",
    result: "Сдано с первого раза",
  },
  {
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    client: "Бизнес-центр «Небоскрёб»",
    location: "Санкт-Петербург, пр. Примерный, д. 10",
    type: "Проектирование и монтаж",
    result: "Срок — 10 дней",
  },
  {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    client: "Фабрика «Технопром»",
    location: "Екатеринбург, ул. Промышленная, д. 5",
    type: "Обслуживание и аудит",
    result: "Гарантия 3 года",
  },
];

export default function Cases() {
  return (
    <section className="section bg-slate-50 dark:bg-slate-950" id="projects">
      <div className="container-xl">
        <div className="text-center mb-12">
          <div className="badge mb-4">Кейсы</div>
          <h2 className="heading-lg text-slate-900 dark:text-white mb-4">
            Наши проекты
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Реализовали более 320 объектов. От небольших офисов до крупных промышленных предприятий.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((project, index) => (
            <motion.div
              key={project.client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.client}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-semibold">{project.client}</div>
                  <div className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-2">
                  <Building2 className="w-4 h-4" />
                  {project.type}
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {project.result}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all">
            Все проекты
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}