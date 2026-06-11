import { SCHOOL_INFO } from '../data/timetable';
import { ViewTab } from '../types';
import { formatDate, getSchoolDayProgress } from '../utils/date';

export default function Dashboard({ navigate }: { navigate: (tab: ViewTab) => void }) {
  const today = new Date();
  const weekday = formatDate(today, { weekday: 'long' });
  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg w-full">
      {/* Upper header section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Lehrplaner Dashboard</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Guten Morgen, Herr Lüscher</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant capitalize">{weekday} · Klasse {SCHOOL_INFO.class} · {SCHOOL_INFO.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white border border-outline-variant rounded-full text-sm font-semibold text-on-surface shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              Schultag {getSchoolDayProgress(today)} von 180
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        
        {/* Main Highlight Card (2x2 span inside the bento column setup) */}
        <div className="md:col-span-3 bg-primary rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden bento-glow-indigo min-h-[320px]">
          <div className="relative z-10">
            <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5 inline-block">Aktuelle Lektion</span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Regelunterricht (X) — Klasse 6B<br />Geometrie & Sachrechnen</h2>
            <p className="mt-4 text-primary-fixed/80 max-w-lg font-body-md text-body-md">
              Einführung in Winkelberechnungen an Dreiecken. Die Geometrie-Mappen sind aufgeteilt, die Konstruktionshilfen liegen bereit.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5 mt-6">
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">room</span>
                <span className="font-label-md text-white">Klassenzimmer 6B</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">schedule</span>
                <span className="font-label-md text-white">08:20 - 09:05</span>
              </div>
            </div>
            <button type="button" onClick={() => navigate('tagesuebersicht')} className="px-6 py-2.5 bg-white text-primary rounded-2xl font-bold hover:bg-primary-fixed hover:text-on-primary-container transition-all text-sm active:scale-95 shadow-sm">
              Klassenbuch öffnen
            </button>
          </div>
          {/* Decorative background visual blob */}
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-40"></div>
        </div>

        {/* Metric Card 1: Temperature (1x1) */}
        <div className="bg-white border border-outline-variant rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">device_thermostat</span>
            </div>
            <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2.5 py-0.5 rounded-full uppercase tracking-wider">Juni</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-on-surface">{SCHOOL_INFO.year}</div>
            <div className="text-sm text-on-surface-variant font-semibold mt-1">Aktuelles Schuljahr</div>
          </div>
        </div>

        {/* Metric Card 2: Units of day (1x1) */}
        <div className="bg-tertiary-fixed border border-outline-variant/40 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <span className="text-xs font-bold text-on-tertiary-fixed-variant bg-white/55 px-2.5 py-0.5 rounded-full">Heute</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-tertiary-fixed-variant">5 Lektionen</div>
            <div className="text-sm text-on-tertiary-fixed-variant/90 font-semibold mt-1 capitalize">{weekday}-Plan</div>
          </div>
        </div>

        {/* Timetable card (2x1 wide span in details) */}
        <div className="md:col-span-2 bg-white border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <span className="capitalize">{weekday} verbleibend</span>
              </h3>
              <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider font-bold bg-surface-container px-2 py-0.5 rounded">6B</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-md p-3 rounded-2xl border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="text-center min-w-[50px]">
                  <p className="font-label-sm text-on-surface-variant">09:10</p>
                  <p className="text-[11px] text-primary font-bold">3. Lekt</p>
                </div>
                <div className="w-1 self-stretch bg-primary rounded-full"></div>
                <div className="flex-grow">
                  <p className="font-label-md text-on-surface leading-tight">Regelunterricht (X) — Klasse 6B</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Deutsch • Lesetraining am PC</p>
                </div>
                <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>

              <div className="flex items-center gap-md p-3 rounded-2xl border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="text-center min-w-[50px]">
                  <p className="font-label-sm text-on-surface-variant">10:15</p>
                  <p className="text-[11px] text-primary font-bold">4. Lekt</p>
                </div>
                <div className="w-1 self-stretch bg-emerald-500 rounded-full"></div>
                <div className="flex-grow">
                  <p className="font-label-md text-on-surface leading-tight">B&S (Sport) — Philipp Achermann</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Turnhalle</p>
                </div>
                <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => navigate('stundenplan')} className="w-full mt-4 py-2 bg-surface-container-low hover:bg-surface-container text-label-md text-primary rounded-xl transition-colors font-bold text-center">
            Vollständigen Stundenplan ansehen
          </button>
        </div>

        {/* Priority card styled as deep-slate-950 high-contrast bento item */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Wichtig</span>
              <span className="material-symbols-outlined text-amber-400">notifications_active</span>
            </div>
            <h3 className="font-title-md text-title-md text-white mb-4">Top Prioritäten</h3>
            
            <div className="space-y-3.5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input className="mt-1 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900 h-4 w-4 transition-all" type="checkbox" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-100 group-hover:text-primary transition-colors">Absenzenkontrolle Suhr</span>
                  <span className="text-[10px] text-error font-bold mt-0.5">Bis 08:30 Uhr</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input className="mt-1 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900 h-4 w-4 transition-all" type="checkbox" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-100 group-hover:text-primary transition-colors">TTG Absprachen (Laura)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Gruppen-Material bereitstellen</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400 italic">
            3 Aufgaben verbleibend
          </div>
        </div>

        {/* Quick Nav Bento Row */}
        <div className="col-span-1 md:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <button type="button" onClick={() => navigate('tagesuebersicht')} className="bg-white border border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-center gap-sm hover:border-primary hover:bg-primary-fixed/20 transition-all group cursor-pointer shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform text-primary">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <span className="font-label-md text-on-surface text-center">Kursbuch</span>
          </button>

          <button type="button" onClick={() => navigate('jahresuebersicht')} className="bg-white border border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-center gap-sm hover:border-primary hover:bg-primary-fixed/20 transition-all group cursor-pointer shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center group-hover:scale-105 transition-transform text-tertiary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <span className="font-label-md text-on-surface text-center">Archiv</span>
          </button>

          <button type="button" onClick={() => navigate('aufgaben')} className="bg-white border border-outline-variant rounded-2xl p-5 col-span-2 md:col-span-1 flex flex-col items-center justify-center gap-sm hover:border-primary hover:bg-primary-fixed/20 transition-all group cursor-pointer shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform text-on-surface-variant">
              <span className="material-symbols-outlined">contact_support</span>
            </div>
            <span className="font-label-md text-on-surface text-center">Hilfe / Support</span>
          </button>
        </div>

        {/* Large Decorative Quote Bento (Mandela Quote with ultra-clean, minimal charcoal background) */}
        <div className="col-span-1 md:col-span-4 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex items-center min-h-[160px] shadow-md">
          <div className="relative z-10 max-w-2xl">
            <p className="font-body-lg text-lg italic mb-3 text-slate-100 leading-relaxed font-semibold">
              "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern."
            </p>
            <p className="font-label-md text-primary-fixed uppercase tracking-widest text-[11px]">
              — Nelson Mandela
            </p>
          </div>
          <div className="absolute right-6 bottom-0 text-white/5 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[140px]">format_quote</span>
          </div>
        </div>

      </div>
    </div>
  );
}
