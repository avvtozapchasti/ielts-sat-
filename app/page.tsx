import Link from "next/link";
import { addDays, format, isAfter, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ArrowRight, BookOpen, CalendarDays, Flame, Plus, Target } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { bestStreak, currentStreak, humanDate } from "@/lib/dates";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

function average(values: number[]) {
  return values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1) : "0";
}

export default async function DashboardPage() {
  const [tasks, sessions, habits, words, logs] = await Promise.all([
    prisma.task.findMany({ orderBy: { date: "asc" } }),
    prisma.studySession.findMany({ orderBy: { date: "desc" }, take: 8 }),
    prisma.habit.findMany({ include: { logs: true } }),
    prisma.vocabularyWord.findMany(),
    prisma.habitLog.findMany({ where: { completed: true } })
  ]);
  const todayTasks = tasks.filter((task) => isToday(task.date));
  const upcoming = tasks.filter((task) => task.deadline && isAfter(task.deadline, new Date()) && isAfter(addDays(new Date(), 8), task.deadline));
  const streakDates = [...sessions.map((session) => session.date), ...logs.map((log) => log.date)];
  const ielts = sessions.filter((session) => session.type === "IELTS");
  const sat = sessions.filter((session) => session.type === "SAT");
  const learned = words.filter((word) => word.learned).length;
  const monthDays = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

  return (
    <>
      <PageHeader title="Dashboard" description="Your daily command center for IELTS, SAT, vocabulary, habits, notes, and progress." />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/ielts" className="btn-secondary"><Plus size={16} />Add IELTS</Link>
        <Link href="/sat" className="btn-secondary"><Plus size={16} />Add SAT</Link>
        <Link href="/planner" className="btn-secondary"><Plus size={16} />Add task</Link>
        <Link href="/vocabulary" className="btn-secondary"><Plus size={16} />Add word</Link>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <section className="notion-card xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Today&apos;s tasks</h2><Link href="/planner" className="text-sm text-zinc-500">Planner <ArrowRight className="inline" size={14} /></Link></div>
          {todayTasks.length ? <div className="space-y-3">{todayTasks.map((task) => <div key={task.id} className="rounded-lg border border-border p-3"><div className="flex justify-between gap-3"><p className="font-medium">{task.title}</p><span className="badge">{task.priority}</span></div><p className="mt-1 text-sm text-zinc-500">{task.status}</p></div>)}</div> : <EmptyState title="No tasks for today" detail="Your current day is open." />}
        </section>
        <section className="notion-card">
          <div className="flex items-center gap-3"><Flame size={22} /><div><h2 className="font-semibold">Study streak</h2><p className="text-sm text-zinc-500">Current {currentStreak(streakDates)} days · best {bestStreak(streakDates)} days</p></div></div>
        </section>
        <section className="notion-card"><h2 className="mb-3 font-semibold">IELTS summary</h2><p className="text-3xl font-semibold">{average(ielts.map((session) => session.score))}</p><p className="text-sm text-zinc-500">{ielts.length} sessions recorded</p></section>
        <section className="notion-card"><h2 className="mb-3 font-semibold">SAT summary</h2><p className="text-3xl font-semibold">{average(sat.map((session) => session.score))}</p><p className="text-sm text-zinc-500">{sat.length} sessions recorded</p></section>
        <section className="notion-card"><h2 className="mb-3 flex items-center gap-2 font-semibold"><BookOpen size={18} />Vocabulary</h2><p className="text-3xl font-semibold">{learned}/{words.length}</p><p className="text-sm text-zinc-500">learned words</p></section>
        <section className="notion-card xl:col-span-2"><h2 className="mb-4 font-semibold">Upcoming deadlines</h2>{upcoming.length ? <div className="space-y-2">{upcoming.map((task) => <p key={task.id} className="rounded-md border border-border p-3 text-sm">{task.title} · {task.deadline ? humanDate(task.deadline) : ""}</p>)}</div> : <EmptyState title="No urgent deadlines" detail="Nothing is due in the next week." />}</section>
        <section className="notion-card"><h2 className="mb-4 flex items-center gap-2 font-semibold"><Target size={18} />Habits</h2><p className="text-3xl font-semibold">{habits.length}</p><p className="text-sm text-zinc-500">active habits</p></section>
        <section className="notion-card xl:col-span-2"><h2 className="mb-4 font-semibold">Recent study sessions</h2>{sessions.length ? <div className="space-y-2">{sessions.slice(0, 5).map((session) => <p key={session.id} className="rounded-md border border-border p-3 text-sm">{session.type} {session.section} · {session.score} · {humanDate(session.date)}</p>)}</div> : <EmptyState title="No sessions yet" detail="Add IELTS or SAT practice to fill this history." />}</section>
        <section className="notion-card"><h2 className="mb-4 flex items-center gap-2 font-semibold"><CalendarDays size={18} />Mini calendar</h2><div className="grid grid-cols-7 gap-1 text-center text-xs">{monthDays.map((day) => <div key={day.toISOString()} className={`rounded p-1 ${isToday(day) ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950" : "border border-border"}`}>{format(day, "d")}</div>)}</div></section>
      </div>
    </>
  );
}
