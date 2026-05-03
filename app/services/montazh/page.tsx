import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle, ArrowRight, Wrench, Clock } from "lucide-react";

export default function MontazhPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 py-20">
          <div className="container-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="badge mb-4">Услуга</div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                  Монтаж систем пожарной безопасности
                </h1>
                <p className="text-slate-300 text-lg mb-6">
                  Установка оборудования ведущих производителей.
                  Соблюдаем СНиП и требования МЧС.
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Монтаж АПС (автоматическая пожарная сигнализация)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Монтаж СОУЭ (система оповещения и управления эвакуацией)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Монтаж АУПТ (автоматическая установка пожаротушения)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Монтаж видеонаблюдения и контроля доступа
                  </li>
                </ul>
              </div>
              <div className="hidden lg:block">
                <div className="card-elevated bg-white/10 border-white/20">
                  <div className="text-center py-8">
                    <Wrench className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-white mb-2">Сроки</div>
                    <div className="text-slate-300">от 5 дней</div>
                    <div className="text-2xl font-bold text-white mt-6 mb-2">Стоимость</div>
                    <div className="text-slate-300">от 50 000 ₽</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container-xl">
            <h2 className="heading-lg text-slate-900 dark:text-white text-center mb-12">
              Что входит в монтаж
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Демонтаж старого оборудования (при необходимости)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Монтаж пожарных извещателей</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Прокладка кабельных трасс</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Монтаж шкафов управления</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Подключение оборудования к электросети</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Настройка и пусконаладка</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Тестирование системы</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Инструктаж персонала</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Подготовка акта выполненных работ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Сдача в МЧС (при необходимости)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stages */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
          <div className="container-xl">
            <h2 className="heading-lg text-slate-900 dark:text-white text-center mb-12">
              Этапы работ
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { num: "1", title: "Подготовка", desc: "Доставка оборудования, подготовка помещения" },
                { num: "2", title: "Монтаж", desc: "Установка оборудования и прокладка кабелей" },
                { num: "3", title: "Пусконаладка", desc: "Настройка и тестирование системы" },
                { num: "4", title: "Сдача", desc: "Подписание акта, инструктаж персонала" },
              ].map((stage) => (
                <div key={stage.num} className="card-elevated text-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold mx-auto mb-3">
                    {stage.num}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-red-600">
          <div className="container-xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Закажите монтаж сегодня
            </h2>
            <p className="text-red-100 mb-6 max-w-xl mx-auto">
              Получите бесплатную консультацию и расчёт стоимости.
            </p>
            <a href="#contact" className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-flex items-center gap-2">
              Получить расчёт
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}