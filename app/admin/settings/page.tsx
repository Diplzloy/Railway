"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Check } from "lucide-react";

type Setting = { key: string; label: string; value: string; type: string };

const DEFAULTS: Setting[] = [
  { key: "public_phone", label: "Телефон", value: "", type: "tel" },
  { key: "public_email", label: "Email", value: "", type: "email" },
  { key: "public_address", label: "Адрес", value: "", type: "text" },
  { key: "hero_title", label: "Заголовок Hero", value: "", type: "text" },
  { key: "hero_subtitle", label: "Подзаголовок Hero", value: "", type: "text" },
  { key: "cta_title", label: "CTA Заголовок", value: "", type: "text" },
  { key: "cta_button", label: "CTA Кнопка", value: "", type: "text" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("key, value").then(({ data }) => {
      if (!data) return;
      const map = Object.fromEntries(data.map((d: any) => [d.key, d.value]));
      setSettings(DEFAULTS.map(s => ({ ...s, value: map[s.key] || s.value })));
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const s of settings) {
      await supabase.from("settings").upsert({ key: s.key, value: s.value }, { onConflict: "key" });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-1">Основные настройки сайта</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border p-6 space-y-5">
        {settings.map((s) => (
          <div key={s.key}>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              {s.label}
            </label>
            <input
              type={s.type}
              value={s.value}
              onChange={(e) => setSettings(prev => prev.map(p => p.key === s.key ? { ...p, value: e.target.value } : p))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
        ))}

        <div className="pt-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Сохранение..." : saved ? "Сохранено!" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
