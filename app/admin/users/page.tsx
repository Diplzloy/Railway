"use client";

import { useEffect, useState } from "react";
import { supabase, type Profile } from "@/lib/supabase";
import { Users, Shield, User } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false); });
  }, []);

  const toggleRole = async (user: Profile) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Изменить роль ${user.email} на ${newRole}?`)) return;
    await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Пользователи</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} зарегистрированных</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-slate-50 dark:bg-slate-950">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ПОЛЬЗОВАТЕЛЬ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">РОЛЬ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ДАТА</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-4 py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                  </td>
                </tr>
              ))
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                      {u.email?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{u.full_name || u.email}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${
                    u.role === "admin"
                      ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {u.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role === "admin" ? "Администратор" : "Пользователь"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(u.created_at).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleRole(u)}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {u.role === "admin" ? "Снять права" : "Сделать админом"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
