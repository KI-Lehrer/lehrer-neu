import { SCHOOL_INFO } from '../data/timetable';
import { formatDate, toDateKey } from '../utils/date';

const EVENTS: Record<string, { label: string; type: 'holiday' | 'event' }> = {
  '2025-12-25': { label: 'Weihnachten', type: 'holiday' },
  '2026-01-01': { label: 'Neujahr', type: 'holiday' },
  '2026-05-14': { label: 'Auffahrt', type: 'holiday' },
  '2026-06-11': { label: 'Planungstag', type: 'event' },
};

export default function Jahresuebersicht() {
  const [startYear] = SCHOOL_INFO.year.split('/').map(Number);
  const months = Array.from({ length: 12 }, (_, index) => new Date(startYear, 7 + index, 1));

  return (
    <div className="p-md md:p-margin-desktop max-w-[1440px] mx-auto space-y-lg w-full">
      <header>
        <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Kalender</span>
        <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Jahresübersicht {SCHOOL_INFO.year}</h1>
        <p className="font-body-md text-sm text-on-surface-variant mt-1">Dynamischer Überblick von August bis Juli. Heute wird automatisch markiert.</p>
      </header>
      <section className="flex flex-wrap gap-md py-4 border-y border-outline-variant">
        <Legend color="bg-primary" label="Heute" />
        <Legend color="bg-rose-500" label="Feiertag" />
        <Legend color="bg-amber-500" label="Termin" />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
        {months.map((month) => <CalendarMonth key={month.toISOString()} month={month} />)}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2"><span className={`w-3.5 h-3.5 rounded-md ${color}`} /><span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</span></div>;
}

function CalendarMonth({ month }: { month: Date; key?: string }) {
  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const todayKey = toDateKey(new Date());
  const monthEvents = Object.entries(EVENTS).filter(([key]) => key.startsWith(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`));

  return (
    <article className="bg-white border border-outline-variant p-5 rounded-3xl shadow-sm">
      <h2 className="font-bold text-primary text-base mb-4 capitalize">{formatDate(month, { month: 'long', year: 'numeric' })}</h2>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((day, index) => <div key={`${day}-${index}`} className={`text-center text-[11px] font-bold py-1 ${index > 4 ? 'text-error' : 'text-on-surface-variant'}`}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;
          const key = toDateKey(new Date(month.getFullYear(), month.getMonth(), day));
          const event = EVENTS[key];
          const style = key === todayKey ? 'bg-primary text-white' : event?.type === 'holiday' ? 'bg-rose-50 text-rose-800' : event ? 'bg-amber-50 text-amber-800' : 'text-on-surface-variant';
          return <div key={key} title={event?.label} className={`py-1.5 text-center rounded-lg font-semibold ${style}`}>{day}</div>;
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 min-h-10">
        {monthEvents.map(([key, event]) => <p key={key} className="text-[11px] font-semibold text-on-surface-variant">{Number(key.slice(-2))}. {event.label}</p>)}
      </div>
    </article>
  );
}
