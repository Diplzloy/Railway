const items = [
  { icon: "🔄", title: "Полный цикл под ключ", desc: "От проектирования до сдачи МЧС. Один подрядчик — одна ответственность." },
  { icon: "✅", title: "98% сдач с первого раза", desc: "Перед каждым объектом — внутренний аудит. Устраняем замечания до прихода инспектора." },
  { icon: "👷", title: "Только штатные инженеры", desc: "7 специалистов с лицензиями СРО и МЧС. Никаких субподрядчиков." },
  { icon: "🛡️", title: "Страхование 100 млн ₽", desc: "Каждый объект застрахован. Отвечаем деньгами, а не словами." },
];

export default function Why() {
  return (
    <section id="why" className="py-24 px-4" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="section-label mb-3">Почему НЕГОРИМ</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
              Работаем так, чтобы<br />
              <span className="text-gradient-red">не было сомнений</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              Пожарная безопасность — это не та сфера, где можно рисковать.
              Мы берём полную ответственность: юридическую, финансовую и профессиональную.
            </p>
            <a href="#contact" className="btn-primary">Обсудить проект</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(item => (
              <div key={item.title} className="card-dark p-6" style={{ background: "var(--bg-card)" }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
