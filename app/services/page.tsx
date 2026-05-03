import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Wrench, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: ClipboardList,
    title: "Проектирование",
    description: "Разработка проектной документации для систем АПС, СОУЭ, АУПТ. Полный комплект для согласования в МЧС.",
    link: "/services/proektirovanie",
    price: "от 15 000 ₽",
  },
  {
    icon: Wrench,
    title: "Монтаж",
    description: "Установка оборудования ведущих производителей. Соблюдаем СНиП и требования МЧС.",
    link: "/services/montazh",
    price: "от 50 000 ₽",
  },
  {
    icon: ShieldCheck,
    title: "Обслуживание",
    description: "Техническое обслуживание, ремонт, поверка приборов. Гарантируем работоспособность систем.",
    link: "/services/obsluzhivanie",
    price: "договорная",
  },
  {
    icon: Search,
    title: "Аудит",
    description: "Проверка соответствия систем требованиям МЧС. Выдача заключения и рекомендаций.",
    link: "/services/audit",
    price: "от 10 000 ₽",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-slate-900 py-16">
          <div className="container-xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Услуги пожарной безопасности
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Полный цикл работ: от проектирования до обслуживания. Согласовали более 200 сту.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container-xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Link key={service.title} href={service.link} className="card-elevated group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <service.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="heading-md text-slate-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="text-red-600 font-semibold mb-2">{service.price}</div>
                  <div className="flex items-center text-red-600 text-sm font-medium group-hover:gap-2 transition-all">
                    Подробнее
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
          <div className="container-xl text-center">
            <h2 className="heading-lg text-slate-900 dark:text-white mb-4">
              Нужна консультация?
            </h2>
            <p className="text-muted mb-6 max-w-xl mx-auto">
              Наши специалисты помогут выбрать оптимальное решение для вашего объекта.
            </p>
            <a href="#contact" className="btn-primary inline-flex items-center gap-2">
              Получить консультацию
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}