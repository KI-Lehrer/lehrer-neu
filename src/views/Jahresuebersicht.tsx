import { formatDate, toDateKey } from '../utils/date';
import { usePlanner } from '../context/PlannerContext';
import { CalendarEvent } from '../types';
import CloudSyncPanel from '../components/CloudSyncPanel';

export default function Jahresuebersicht() {
  const { planner, events, setEvents } = usePlanner();
  const [startYear] = planner.schoolInfo.year.split('/').map(Number);
  const months = Array.from({ length: 12 }, (_, index) => new Date(startYear, 7 + index, 1));
  const addEvent = (form: FormData) => {
    const title = String(form.get('title') ?? '').trim();
    const startDate = String(form.get('startDate') ?? '');
    const endDate = String(form.get('endDate') ?? startDate);
    if (!title || !startDate) return;
    setEvents((current) => [...current, {
      id: crypto.randomUUID(),
      title,
      type: String(form.get('type')) as CalendarEvent['type'],
      startDate,
      endDate: endDate || startDate,
    }].sort((a, b) => a.startDate.localeCompare(b.startDate)));
  };

  return (
    <div className="p-md md:p-margin-desktop max-w-[1440px] mx-auto space-y-lg w-full">
      <header>
        <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Kalender</span>
        <h1 className="font-display-lg text-3xl font-extrabold text-on-surface">Jahresübersicht {planner.schoolInfo.year}</h1>
        {planner.minDate && planner.maxDate && <p className="text-sm font-bold text-primary mt-2">Aktiver Planungszeitraum: {formatDate(planner.minDate, { day: '2-digit', month: '2-digit', year: 'numeric' })} bis {formatDate(planner.maxDate, { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>}
        <p className="font-body-md text-sm text-on-surface-variant mt-1">Dynamischer Überblick von August bis Juli. Heute wird automatisch markiert.</p>
      </header>
      <section className="flex flex-wrap gap-md py-4 border-y border-outline-variant">
        <Legend color="bg-primary" label="Heute" />
        <Legend color="bg-rose-500" label="Ferien / Feiertag" />
        <Legend color="bg-amber-500" label="Termin" />
      </section>
      <CloudSyncPanel />
      <section className="bg-white border border-outline-variant rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-on-surface">Ferien, Feiertage und Termine verwalten</h2>
            <p className="text-sm text-on-surface-variant">Datumsbereiche werden direkt im Jahreskalender markiert und synchronisiert.</p>
          </div>
          <span className="material-symbols-outlined text-primary">event_available</span>
        </div>
        <form action={addEvent} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input name="title" required placeholder="Bezeichnung, z. B. Herbstferien" className="md:col-span-2 px-3 py-2.5 rounded-xl border border-outline-variant" />
          <select name="type" className="px-3 py-2.5 rounded-xl border border-outline-variant bg-white">
            <option value="holiday">Ferien</option>
            <option value="public-holiday">Feiertag</option>
            <option value="event">Termin</option>
          </select>
          <input name="startDate" type="date" required className="px-3 py-2.5 rounded-xl border border-outline-variant" aria-label="Startdatum" />
          <input name="endDate" type="date" className="px-3 py-2.5 rounded-xl border border-outline-variant" aria-label="Enddatum" />
          <button type="submit" className="md:col-span-5 justify-self-start px-5 py-2.5 rounded-xl bg-primary text-white font-bold">Eintrag hinzufügen</button>
        </form>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant">
              <div>
                <p className="font-bold text-sm text-on-surface">{event.title}</p>
                <p className="text-xs text-on-surface-variant">{formatDate(new Date(`${event.startDate}T12:00:00`), { day: '2-digit', month: '2-digit', year: 'numeric' })}{event.endDate !== event.startDate ? ` bis ${formatDate(new Date(`${event.endDate}T12:00:00`), { day: '2-digit', month: '2-digit', year: 'numeric' })}` : ''}</p>
              </div>
              <button type="button" onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))} className="p-2 rounded-full text-error hover:bg-error/10 material-symbols-outlined" aria-label={`${event.title} löschen`}>delete</button>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
        {months.map((month) => <CalendarMonth key={month.toISOString()} month={month} events={events} />)}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2"><span className={`w-3.5 h-3.5 rounded-md ${color}`} /><span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</span></div>;
}

function CalendarMonth({ month, events }: { month: Date; events: CalendarEvent[]; key?: string }) {
  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const todayKey = toDateKey(new Date());
  const monthStart = toDateKey(month);
  const monthEnd = toDateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0));
  const monthEvents = events.filter((event) => event.startDate <= monthEnd && event.endDate >= monthStart);

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
          const event = events.find((item) => item.startDate <= key && item.endDate >= key);
          const style = key === todayKey ? 'bg-primary text-white' : event && event.type !== 'event' ? 'bg-rose-50 text-rose-800' : event ? 'bg-amber-50 text-amber-800' : 'text-on-surface-variant';
          return <div key={key} title={event?.title} className={`py-1.5 text-center rounded-lg font-semibold ${style}`}>{day}</div>;
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 min-h-10">
        {monthEvents.map((event) => <p key={event.id} className="text-[11px] font-semibold text-on-surface-variant">{Number(event.startDate.slice(-2))}. {event.title}</p>)}
      </div>
    </article>
  );
}
