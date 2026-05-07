"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, CalendarDays, ClipboardList, Dumbbell, FileText, GraduationCap, LayoutDashboard, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ielts", label: "IELTS", icon: GraduationCap },
  { href: "/sat", label: "SAT", icon: BarChart3 },
  { href: "/planner", label: "Planner", icon: ClipboardList },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/habits", label: "Habits", icon: Dumbbell },
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/notes", label: "Notes", icon: FileText }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(saved ? saved === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-border bg-white/70 backdrop-blur dark:bg-zinc-950/70 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-4 lg:block">
          <Link href="/" className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"><GraduationCap size={22} /></div><div><p className="text-sm font-semibold">Study OS</p><p className="text-xs text-zinc-500">IELTS + SAT</p></div></Link>
          <button className="icon-btn lg:hidden" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"}`}><Icon size={17} />{item.label}</Link>;
          })}
        </nav>
        <div className="hidden p-4 lg:block"><button className="btn-secondary w-full" onClick={() => setDark((value) => !value)}>{dark ? <Sun size={16} /> : <Moon size={16} />}{dark ? "Light mode" : "Dark mode"}</button></div>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">{children}</div></main>
    </div>
  );
}
