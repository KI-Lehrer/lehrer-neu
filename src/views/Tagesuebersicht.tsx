import { useState } from 'react';
import { SCHOOL_INFO, TIMETABLE_DATA, TimetableCell, getSubjectDetails } from '../data/timetable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LessonPlan } from '../types';
import { formatLongDate, getSchoolDayProgress, toDateKey } from '../utils/date';

const dayColumns = {
  1: 'mondayA',
  2: 'tuesdayA',
  3: 'wednesdayA',
  4: 'thursdayA',
  5: 'fridayA',
} as const;

const emptyPlan: LessonPlan = { topic: '', homework: '', notes: '' };

export default function Tagesuebersicht() {
  const today = new Date();
  const dateKey = toDateKey(today);
  const column = dayColumns[today.getDay() as keyof typeof dayColumns];
  const lessons = column
    ? TIMETABLE_DATA.map((row, index) => ({ index, time: row.time, cell: row[column] as TimetableCell })).filter(({ cell }) => cell.subject)
    : [];
  const [dailyNotes, setDailyNotes] = useLocalStorage<Record<string, string>>('lehrerplaner.daily-notes', {});
  const [plans, setPlans] = useLocalStorage<Record<string, LessonPlan>>('lehrerplaner.lesson-plans', {});
  const [savedMessage, setSavedMessage] = useState('Automatisch gespeichert');

  const planKey = (lessonIndex: number) => `${dateKey}-${lessonIndex}`;
  const updatePlan = (lessonIndex: number, update: Partial<LessonPlan>) => {
    const key = planKey(lessonIndex);
    setPlans((current) => ({ ...current, [key]: { ...(current[key] ?? emptyPlan), ...update } }));
    setSavedMessage('Automatisch gespeichert');
  };

  const exportDay = () => {
    const content = JSON.stringify({
      date: dateKey,
      notes: dailyNotes[dateKey] ?? '',
      lessons: lessons.map((lesson) => ({ ...lesson, plan: plans[planKey(lesson.index)] ?? emptyPlan })),
    }, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `lehrerplaner-${dateKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg w-full">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <span className="font-label-md text-xs font-extrabold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-2 inline-block">Heutige Übersicht</span>
          <h1 className="font-display-lg text-4xl font-extrabold text-on-surface mt-1 mb-1 capitalize">{formatLongDate(today)}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Schultag {getSchoolDayProgress(today)} · Klasse {SCHOOL_INFO.class} · {SCHOOL_INFO.name}</p>
        </div>
        <div className="flex items-center gap-sm w-full md:w-auto">
          <span className="text-xs font-bold text-secondary">{savedMessage}</span>
          <button type="button" onClick={exportDay} className="flex-1 md:flex-none px-6 py-2.5 border border-primary text-primary rounded-2xl font-bold bg-white">Exportieren</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <aside className="md:col-span-4 flex flex-col gap-gutter">
          <section className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm">
            <h2 className="font-title-md text-title-md text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span> Tagesnotizen
            </h2>
            <textarea value={dailyNotes[dateKey] ?? ''} onChange={(event) => setDailyNotes((current) => ({ ...current, [dateKey]: event.target.value }))} className="w-full min-h-[240px] p-2 font-body-md text-sm text-on-surface-variant border-none bg-transparent resize-none outline-none notebook-input" placeholder="Was gibt es heute zu beachten?" aria-label="Tagesnotizen" />
          </section>
          <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
            <h2 className="font-bold text-primary">Datenschutz</h2>
            <p className="text-sm text-on-surface-variant mt-2">Notizen werden nur lokal in diesem Browser gespeichert. Verwende keine besonders schützenswerten Personendaten.</p>
          </section>
        </aside>

        <div className="md:col-span-8 flex flex-col gap-gutter">
          {lessons.length === 0 && (
            <div className="bg-white border border-outline-variant rounded-3xl p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-outline">weekend</span>
              <h2 className="font-bold text-on-surface mt-3">Heute sind keine Lektionen eingetragen.</h2>
            </div>
          )}
          {lessons.map(({ index, time, cell }, position) => {
            const details = getSubjectDetails(cell.subject);
            const plan = plans[planKey(index)] ?? emptyPlan;
            return (
              <article key={`${time}-${cell.subject}`} className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
                <header className={`${details.bgClass} px-6 py-4 flex flex-wrap gap-3 justify-between items-center border-b border-outline-variant/60`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{position + 1}</div>
                    <h2 className={`font-label-md text-sm font-bold uppercase tracking-wider ${details.colorClass}`}>{cell.subject} · {details.teacherName}</h2>
                  </div>
                  <span className="px-3 py-1 bg-white border border-outline-variant rounded-full text-xs font-bold">{time}</span>
                </header>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Thema der Stunde
                    <input value={plan.topic} onChange={(event) => updatePlan(index, { topic: event.target.value })} className="w-full py-2 mt-2 bg-transparent text-on-surface font-semibold text-sm border-b border-outline-variant outline-none focus:border-primary" placeholder="Thema eintragen" />
                  </label>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Hausaufgaben
                    <input value={plan.homework} onChange={(event) => updatePlan(index, { homework: event.target.value })} className="w-full py-2 mt-2 bg-transparent text-on-surface text-sm border-b border-outline-variant outline-none focus:border-primary" placeholder="Hausaufgaben eintragen" />
                  </label>
                  <div className="text-xs font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">room</span> {details.room}
                  </div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Reflexion / Notizen
                    <textarea value={plan.notes} onChange={(event) => updatePlan(index, { notes: event.target.value })} className="w-full py-2 mt-2 min-h-[70px] text-sm border-b border-outline-variant bg-transparent resize-none outline-none focus:border-primary" placeholder="Beobachtungen und nächste Schritte..." />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
