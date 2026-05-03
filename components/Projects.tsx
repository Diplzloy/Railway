"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "ТЦ «Москва-Сити»",
    slug: "tts-moscow-city",
    description: "Комплексное оснащение системы пожарной безопасности торгового центра площадью 45 000 м²",
    client: "ТЦ Москва-Сити",
    location: "Москва",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    id: 2,
    title: "Офисный центр «Ривьера»",
    slug: "ofisnyy-tsentr-rivera",
    description: "Реновация существующей системы пожарной безопасности в бизнес-центре",
    client: "ООО «Ривьера»",
    location: "Москва, Ленинградский пр-т",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    id: 3,
    title: "Складской комплекс",
    slug: "skladskoy-kompleks",
    description: "Установка системы пожаротушения водой для склада класса «В»",
    client: "ООО «Логистик Плюс»",
    location: "Московская область",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="section-label">Кейсы</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3">
              Наши проекты
            </h2>
          </div>
          <a href="/news" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
            Все проекты <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={`/projects/${project.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {project.client}
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {project.location}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* All projects link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="/projects" className="inline-flex items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Смотреть все проекты
          </a>
        </motion.div>
      </div>
    </section>
  );
}
