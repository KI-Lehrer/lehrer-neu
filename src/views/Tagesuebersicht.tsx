import { useLayoutEffect, useRef, useState } from 'react';
import { TimetableCell, getSubjectDetails } from '../data/timetable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LessonPlan } from '../types';
import { addDays, formatDate, formatLongDate, getSchoolDayProgress, toDateKey } from '../utils/date';
import { usePlanner } from '../context/PlannerContext';
import { createDailyPlanPdf } from '../utils/pdf';

const dayColumns = {
  1: 'mondayA',
  2: 'tuesdayA',
  3: 'wednesdayA',
  4: 'thursdayA',
  5: 'fridayA',
} as const;

const emptyPlan: LessonPlan = { topic: '', homework: '', notes: '' };

function AutoGrowingTextarea({
  value,
  onChange,
  placeholder,
  minHeight = 64,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
  }, [minHeight, value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full py-2 mt-2 bg-transparent text-on-surface text-sm leading-relaxed border-b border-outline-variant outline-none focus:border-primary resize-y overflow-hidden normal-case whitespace-pre-wrap"
      placeholder={placeholder}
      style={{ minHeight }}
    />
  );
}

export default function Tagesuebersicht() {
  const { planner, selectedDate: today, setSelectedDate } = usePlanner();
  const dateKey = toDateKey(today);
  const column = dayColumns[today.getDay() as keyof typeof dayColumns];
  const lessons = column
    ? planner.timetable.map((row, index) => ({ index, time: row.time, cell: row[column] as TimetableCell })).filter(({ cell }) => cell.subject)
    : [];
  const [dailyNotes, setDailyNotes] = useLocalStorage<Record<string, string>>(`${planner.storagePrefix}.daily-notes`, {});
  const [plans, setPlans] = useLocalStorage<Record<string, LessonPlan>>(`${planner.storagePrefix}.lesson-plans`, {});
  const [savedMessage, setSavedMessage] = useState('Automatisch gespeichert');
  const canGoBack = !planner.minDate || today > planner.minDate;
  const canGoForward = !planner.maxDate || today < planner.maxDate;

  const planKey = (lessonIndex: number) => `${dateKey}-${lessonIndex}`;
  const updatePlan = (lessonIndex: number, update: Partial<LessonPlan>) => {
    const key = planKey(lessonIndex);
    setPlans((current) => ({ ...current, [key]: { ...(current[key] ?? emptyPlan), ...update } }));
    setSavedMessage('Automatisch gespeichert');
  };

  const exportDay = () => {
    const pdf = createDailyPlanPdf({
      date: formatLongDate(today),
      school: planner.schoolInfo.name,
      schoolClass: planner.schoolInfo.class,
      dailyNotes: dailyNotes[dateKey] ?? '',
      lessons: lessons.map((lesson, index) => {
        const details = getSubjectDetails(lesson.cell.subject);
        return {
          number: index + 1,
          time: lesson.time,
          subject: lesson.cell.subject,
          teacher: details.teacherName,
          room: details.room,
          plan: plans[planKey(lesson.index)] ?? emptyPlan,
        };
      }),
    });
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tagesplanung-${dateKey}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg w-full">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <span className="font-label-md text-xs font-extrabold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-2 inline-block">{planner.id === '2526' ? 'Planer 25/26' : 'Heutige Übersicht'}</span>
          <h1 className="font-display-lg text-4xl font-extrabold text-on-surface mt-1 mb-1 capitalize">{formatLongDate(today)}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Schultag {getSchoolDayProgress(today)} · Klasse {planner.schoolInfo.class} · {planner.schoolInfo.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
          {planner.id === '2526' && (
            <>
              <button type="button" disabled={!canGoBack} onClick={() => setSelectedDate(addDays(today, -1))} className="px-3 py-2 rounded-xl border border-outline-variant bg-white disabled:opacity-30" aria-label="Vorheriger Tag">←</button>
              <input type="date" min="2026-06-12" max="2026-07-03" value={dateKey} onChange={(event) => setSelectedDate(new Date(`${event.target.value}T12:00:00`))} aria-label="Datum auswählen" className="px-3 py-2 rounded-xl border border-outline-variant bg-white font-bold text-sm" />
              <button type="button" disabled={!canGoForward} onClick={() => setSelectedDate(addDays(today, 1))} className="px-3 py-2 rounded-xl border border-outline-variant bg-white disabled:opacity-30" aria-label="Nächster Tag">→</button>
            </>
          )}
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
            <h2 className="font-bold text-primary">{planner.id === '2526' ? 'Planungszeitraum' : 'Datenschutz'}</h2>
            {planner.minDate && planner.maxDate && <p className="text-sm font-bold text-on-surface mt-2">{formatDate(planner.minDate, { day: '2-digit', month: '2-digit', year: 'numeric' })} bis {formatDate(planner.maxDate, { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>}
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
                    <AutoGrowingTextarea value={plan.topic} onChange={(topic) => updatePlan(index, { topic })} placeholder="Thema eintragen" />
                  </label>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Hausaufgaben
                    <AutoGrowingTextarea value={plan.homework} onChange={(homework) => updatePlan(index, { homework })} placeholder="Hausaufgaben eintragen" />
                  </label>
                  <div className="text-xs font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">room</span> {details.room}
                  </div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Reflexion / Notizen
                    <AutoGrowingTextarea value={plan.notes} onChange={(notes) => updatePlan(index, { notes })} placeholder="Beobachtungen und nächste Schritte..." minHeight={70} />
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
