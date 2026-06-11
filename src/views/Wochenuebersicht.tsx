import { useState } from 'react';
import { TIMETABLE_DATA, getSubjectDetails } from '../data/timetable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addDays, formatDate, getIsoWeek, getWeekDays, startOfWeek, toDateKey } from '../utils/date';

const dayKeys = ['mondayA', 'tuesdayA', 'wednesdayA', 'thursdayA', 'fridayA'] as const;

export default function Wochenuebersicht() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('lehrerplaner.week-notes', {});
  const monday = addDays(startOfWeek(new Date()), weekOffset * 7);
  const days = getWeekDays(monday);

  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-md">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Wochenplaner</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Wochenübersicht</h1>
          <p className="font-body-md text-on-surface-variant mt-1">KW {getIsoWeek(monday)} · {formatDate(days[0], { day: 'numeric', month: 'long' })} bis {formatDate(days[4], { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-sm">
          <button type="button" onClick={() => setWeekOffset((offset) => offset - 1)} className="bg-white px-5 py-2.5 rounded-2xl font-bold border border-outline-variant">Vorherige</button>
          <button type="button" onClick={() => setWeekOffset(0)} className="bg-primary/10 text-primary px-5 py-2.5 rounded-2xl font-bold">Heute</button>
          <button type="button" onClick={() => setWeekOffset((offset) => offset + 1)} className="bg-white px-5 py-2.5 rounded-2xl font-bold border border-outline-variant">Nächste</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-gutter items-stretch">
        {days.map((day, index) => {
          const key = toDateKey(day);
          const lessons = TIMETABLE_DATA.map((row) => ({ time: row.time, cell: row[dayKeys[index]] })).filter(({ cell }) => cell.subject);
          return (
            <article key={key} className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col min-h-[620px]">
              <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl">
                <h2 className="text-lg font-extrabold text-primary capitalize">{formatDate(day, { weekday: 'long' })}</h2>
                <span className="text-xs font-bold text-on-surface-variant">{formatDate(day, { day: 'numeric', month: 'long' })}</span>
              </header>
              <div className="p-4 flex-1 flex flex-col gap-3">
                {lessons.map(({ time, cell }, lessonIndex) => {
                  const details = getSubjectDetails(cell.subject);
                  return (
                    <div key={`${time}-${lessonIndex}`} className={`p-3 border-l-4 ${details.borderClass} ${details.bgClass} rounded-r-xl`}>
                      <span className={`text-[10px] font-bold uppercase ${details.colorClass}`}>{time} · {cell.subject}</span>
                      <p className="font-semibold text-sm mt-1">{details.teacherName}</p>
                    </div>
                  );
                })}
                <textarea value={notes[key] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [key]: event.target.value }))} aria-label={`Notizen für ${formatDate(day, { weekday: 'long' })}`} className="w-full notebook-input border-none font-body-md text-sm text-on-surface-variant flex-1 min-h-[160px] resize-none outline-none bg-transparent mt-2" placeholder="Notizen für diesen Tag..." />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
