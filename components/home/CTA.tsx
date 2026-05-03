"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(10, "Введите телефон"),
});

export default function CTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: data.name,
          phone: data.phone,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section bg-slate-900" id="contact">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">
              Готовы начать?
            </h2>
            <p className="text-slate-400 text-lg mb-6">
              Оставьте заявку и получите бесплатный расчёт стоимости работ.
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-red-600/30 flex items-center justify-center text-xs">1</span>
                Обсудим задачу и требования
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-red-600/30 flex items-center justify-center text-xs">2</span>
                Подготовим смету и сроки
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-red-600/30 flex items-center justify-center text-xs">3</span>
                Заключим договор и начнём работу
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="card-elevated bg-slate-800 border-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Ваше имя</label>
                  <Input
                    {...form.register("name")}
                    placeholder="Иван Иванов"
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Телефон</label>
                  <Input
                    {...form.register("phone")}
                    placeholder="+7 (999) 123-45-67"
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Отправка..." : "Получить расчёт"}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}