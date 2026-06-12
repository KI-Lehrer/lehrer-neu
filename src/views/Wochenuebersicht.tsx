import { getSubjectDetails } from '../data/timetable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addDays, formatDate, getIsoWeek, getWeekDays, startOfWeek, toDateKey } from '../utils/date';
import { usePlanner } from '../context/PlannerContext';
import { LessonPlan } from '../types';

const dayKeys = ['mondayA', 'tuesdayA', 'wednesdayA', 'thursdayA', 'fridayA'] as const;
const emptyPlan: LessonPlan = { topic: '', homework: '', notes: '' };

export default function Wochenuebersicht() {
  const { planner, selectedDate, setSelectedDate, timetable, events } = usePlanner();
  const [notes, setNotes] = useLocalStorage<Record<string, string>>(`${planner.storagePrefix}.week-notes`, {});
  const [plans, setPlans] = useLocalStorage<Record<string, LessonPlan>>(`${planner.storagePrefix}.lesson-plans`, {});
  const monday = startOfWeek(selectedDate);
  const days = getWeekDays(monday);
  const previousWeek = addDays(selectedDate, -7);
  const nextWeek = addDays(selectedDate, 7);
  const canGoPrevious = !planner.minDate || previousWeek >= planner.minDate;
  const canGoNext = !planner.maxDate || nextWeek <= planner.maxDate;

  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-md">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Wochenplaner</span>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Wochenübersicht</h1>
          <p className="font-body-md text-on-surface-variant mt-1">KW {getIsoWeek(monday)} · {formatDate(days[0], { day: 'numeric', month: 'long' })} bis {formatDate(days[4], { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-sm">
          <button type="button" disabled={!canGoPrevious} onClick={() => setSelectedDate(previousWeek)} className="bg-white px-5 py-2.5 rounded-2xl font-bold border border-outline-variant disabled:opacity-30">Vorherige</button>
          <button type="button" onClick={() => setSelectedDate(planner.initialDate)} className="bg-primary/10 text-primary px-5 py-2.5 rounded-2xl font-bold">{planner.id === '2526' ? 'Start' : 'Heute'}</button>
          <button type="button" disabled={!canGoNext} onClick={() => setSelectedDate(nextWeek)} className="bg-white px-5 py-2.5 rounded-2xl font-bold border border-outline-variant disabled:opacity-30">Nächste</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-gutter items-stretch">
        {days.map((day, index) => {
          const key = toDateKey(day);
          const inRange = (!planner.minDate || day >= planner.minDate) && (!planner.maxDate || day <= planner.maxDate);
          const dayEvents = events.filter((event) => event.startDate <= key && event.endDate >= key);
          const isDayOff = dayEvents.some((event) => event.type !== 'event');
          const lessons = inRange && !isDayOff ? timetable.map((row, lessonIndex) => ({ index: lessonIndex, time: row.time, cell: row[dayKeys[index]] })).filter(({ cell }) => cell.subject) : [];
          return (
            <article key={key} className="bg-white border border-outline-variant rounded-3xl shadow-sm flex flex-col min-h-[620px]">
              <header className="p-5 border-b border-outline-variant bg-slate-50 rounded-t-3xl">
                <h2 className="text-lg font-extrabold text-primary capitalize">{formatDate(day, { weekday: 'long' })}</h2>
                <span className="text-xs font-bold text-on-surface-variant">{formatDate(day, { day: 'numeric', month: 'long' })}</span>
              </header>
              <div className="p-4 flex-1 flex flex-col gap-3">
                {!inRange && <p className="text-xs font-bold text-outline text-center py-6">Ausserhalb des Planungszeitraums</p>}
                {dayEvents.map((event) => <p key={event.id} className={`p-2 rounded-xl text-xs font-bold ${event.type === 'event' ? 'bg-amber-50 text-amber-900' : 'bg-rose-50 text-rose-900'}`}>{event.title}</p>)}
                {lessons.map(({ index: lessonIndex, time, cell }) => {
                  const details = getSubjectDetails(cell.subject, cell.room, cell.teacherCode);
                  const planKey = `${key}-${lessonIndex}`;
                  const plan = plans[planKey] ?? emptyPlan;
                  const updatePlan = (update: Partial<LessonPlan>) => setPlans((current) => ({ ...current, [planKey]: { ...plan, ...update } }));
                  return (
                    <div key={`${time}-${lessonIndex}`} className={`p-3 border-l-4 ${details.borderClass} ${details.bgClass} rounded-r-xl`}>
                      <span className={`text-[10px] font-bold uppercase ${details.colorClass}`}>{time} · {cell.subject}</span>
                      <p className="font-semibold text-sm mt-1">{details.teacherName}</p>
                      <input value={plan.topic} onChange={(event) => updatePlan({ topic: event.target.value })} className="w-full mt-2 px-2 py-1.5 rounded-lg border border-white/80 bg-white/75 text-xs outline-none focus:border-primary" placeholder="Thema der Stunde" aria-label={`Thema ${formatDate(day, { weekday: 'long' })} ${time}`} />
                      <input value={plan.homework} onChange={(event) => updatePlan({ homework: event.target.value })} className="w-full mt-1.5 px-2 py-1.5 rounded-lg border border-white/80 bg-white/75 text-xs outline-none focus:border-primary" placeholder="Hausaufgaben" aria-label={`Hausaufgaben ${formatDate(day, { weekday: 'long' })} ${time}`} />
                      <textarea value={plan.notes} onChange={(event) => updatePlan({ notes: event.target.value })} className="w-full mt-1.5 px-2 py-1.5 min-h-[56px] rounded-lg border border-white/80 bg-white/75 text-xs outline-none resize-y focus:border-primary" placeholder="Notizen / Reflexion" aria-label={`Notizen ${formatDate(day, { weekday: 'long' })} ${time}`} />
                    </div>
                  );
                })}
                {inRange && <textarea value={notes[key] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [key]: event.target.value }))} aria-label={`Notizen für ${formatDate(day, { weekday: 'long' })}`} className="w-full notebook-input border-none font-body-md text-sm text-on-surface-variant flex-1 min-h-[160px] resize-none outline-none bg-transparent mt-2" placeholder="Notizen für diesen Tag..." />}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
