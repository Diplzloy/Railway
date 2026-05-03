"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Phone, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "/about", label: "О компании" },
  {
    label: "Услуги",
    mega: [
      { href: "/services/proektirovanie", label: "Проектирование", description: "Разработка проектной документации" },
      { href: "/services/montazh", label: "Монтаж", description: "Установка оборудования" },
      { href: "/services/obsluzhivanie", label: "Обслуживание", description: "Техническое обслуживание" },
      { href: "/services/audit", label: "Аудит", description: "Проверка соответствия требованиям" },
    ],
  },
  { href: "/documents", label: "Документы" },
  { href: "#projects", label: "Кейсы" },
  { href: "#contact", label: "Контакты" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 dark:bg-slate-900/95 shadow-md" : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-2 text-xs border-b border-border/50">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            +7 (999) 123-45-67
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Москва
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          {user ? (
            <a href="/cabinet" className="text-xs hover:text-red-500 transition-colors">
              Кабинет
            </a>
          ) : (
            <>
              <a href="/auth/login" className="text-xs hover:text-red-500 transition-colors">
                Войти
              </a>
              <a href="/auth/register" className="text-xs text-red-500 font-semibold">
                Регистрация
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main nav */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-xl">Н</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight">НЕГОРИМ</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">
                Пожарная безопасность
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href || link.label} className="relative">
                {link.mega ? (
                  <div
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors rounded-md cursor-pointer flex items-center gap-1"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-border p-4 z-50"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            {link.mega.map((item) => (
                              <a
                                key={item.href}
                                href={item.href}
                                className="block p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {item.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.description}
                                </div>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors rounded-md"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a href="#contact" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors">
              Обратный звонок
            </a>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t border-border"
          >
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <div key={link.href || link.label}>
                  {link.mega ? (
                    <>
                      <div className="px-6 py-3 text-sm font-medium text-foreground">
                        {link.label}
                      </div>
                      <div className="pl-12 space-y-1">
                        {link.mega.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-6 py-3 text-sm font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
              <div className="px-6 py-3 border-t border-border/50 mt-2">
                <a href="#contact" className="block text-center bg-red-600 text-white px-4 py-2 rounded-md font-semibold">
                  Обратный звонок
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}