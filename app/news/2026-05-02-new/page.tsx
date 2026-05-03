"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NewsDetailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg-primary)" }}>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <a href="/news" className="text-sm mb-8 inline-block" style={{ color: "var(--red-primary)" }}>
            ← Назад к новостям
          </a>

          {/* Header */}
          <header className="mb-10">
            <span className="section-label">Обновления</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Новые требования к пожарной безопасности в 2026 году
            </h1>
            <div className="flex flex-wrap gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span>02.05.2026</span>
              <span>•</span>
              <span>15 мин чтения</span>
              <span>•</span>
              <span style={{ color: "var(--red-primary)" }}>Актуально</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6" style={{ color: "var(--text-secondary)" }}>
              МЧС России утвердило план нормативной работы на 2026 год. Вступают в силу новые требования к
              противопожарной безопасности организаций, правила противопожарного режима и обновляются СНиПы.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4" style={{ color: "var(--text-primary)" }}>
              🔥 Запрет на курение в опасных зонах
            </h2>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              С 2026 года введен прямой запрет на курение в местах работы с горючими материалами,
              а также в зонах погрузки/разгрузки пожароопасных веществ. Нарушение влечёт штрафы для организаций.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4" style={{ color: "var(--text-primary)" }}>
              📋 Обновление правил противопожарного режима
            </h2>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              МЧС обновило правила противопожарного режима. Ключевые изменения:
            </p>
            <ul className="list-disc pl-6 mb-4" style={{ color: "var(--text-secondary)" }}>
              <li>С 1 марта 2026 — заявление о пожаре через Госуслуги</li>
              <li>С 1 сентября 2025 — новые требования к обучению сотрудников</li>
              <li>Обновлены требования к зрелищным и учебным помещениям</li>
              <li>Изменения в перечнях индикаторов риска</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4" style={{ color: "var(--text-primary)" }}>
              🏫 Изменения в обучении по ПБ
            </h2>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              С 1 сентября 2025 года начинается новый этап в обучении по пожарной безопасности.
              Контрольные точки: 1 сентября 2025, 1 января 2026 и 1 марта 2026.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-4" style={{ color: "var(--text-primary)" }}>
              📚 Новые СНиП и ГОСТы
            </h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              ВНИИПО разработал и разместил новую редакцию СП 485.1311500.2020 с изменениями,
              вступающими в силу с 1 января 2026 года.
            </p>

            <div className="p-6 rounded-xl my-10" style={{ background: "var(--bg-secondary)" }}>
              <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Рекомендации для организаций:
              </h3>
              <ul className="list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
                <li>Обновите инструкции по пожарной безопасности</li>
                <li>Проверьте соответствие систем оповещения новым нормам</li>
                <li>Организуйте обучение сотрудников до 1 сентября 2025</li>
                <li>Настройте электронный документооборот для подачи заявлений через Госуслуги</li>
              </ul>
            </div>
          </div>

          {/* Back to news */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border-color)" }}>
            <a href="/news" className="btn-primary inline-block">
              Все новости →
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
