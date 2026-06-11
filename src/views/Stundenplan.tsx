import React, { useState } from 'react';
import { 
  TEACHERS, 
  GROUPS, 
  getSubjectDetails 
} from '../data/timetable';
import { usePlanner } from '../context/PlannerContext';

type FilterType = 'all' | 'groupA' | 'groupB';

export default function Stundenplan() {
  const { planner } = usePlanner();
  const { timetable, schoolInfo } = planner;
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  return (
    <div className="p-margin-mobile md:px-margin-desktop py-lg w-full max-w-[1440px] mx-auto min-h-screen space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant pb-6 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block">Stundenplan</span>
            <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Klasse {schoolInfo.class}</span>
          </div>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">{schoolInfo.name} • Suhr</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5 font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
            {schoolInfo.address} • Schuljahr {schoolInfo.year} ({schoolInfo.level})
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface-variant rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all text-sm active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">print</span> Drucken
          </button>
        </div>
      </div>

      {/* Notice Alert Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <span className="material-symbols-outlined text-amber-600">info</span>
        <div className="text-sm font-semibold text-amber-900">
          <span className="font-extrabold uppercase text-xs tracking-wider bg-amber-200/50 px-1.5 py-0.5 rounded mr-1">Heißer Tipp:</span>
          {schoolInfo.notice}
        </div>
      </div>

      {/* Filter Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">filter_list</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ansicht filtern:</span>
        </div>
        <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Gesamtansicht (A & B)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('groupA')}
            aria-pressed={activeFilter === 'groupA'}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'groupA' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Nur Gruppe A
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('groupB')}
            aria-pressed={activeFilter === 'groupB'}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'groupB' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Nur Gruppe B
          </button>
        </div>
      </div>

      {/* Responsive Timetable Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="p-4 text-center font-bold text-xs text-slate-500 uppercase tracking-wider border-r border-slate-200/60 w-[110px]">
                  Zeit
                </th>
                
                {/* Monday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Montag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>
                
                {/* Tuesday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Dienstag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>

                {/* Wednesday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Mittwoch
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>

                {/* Thursday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider border-r border-slate-200/60" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Donnerstag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>

                {/* Friday */}
                <th className="p-4 text-center font-extrabold text-sm text-primary uppercase tracking-wider" colSpan={activeFilter === 'all' ? 2 : 1}>
                  Freitag
                  {activeFilter === 'all' && (
                    <div className="flex gap-1 text-[9px] mt-1 font-bold justify-center text-slate-400">
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">A</span>
                      <span className="w-full bg-slate-200/60 py-0.5 rounded">B</span>
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((row, rowIndex) => {
                return (
                  <React.Fragment key={rowIndex}>
                    <tr className="border-b border-slate-200/65 hover:bg-slate-50/30 transition-colors">
                      {/* Time Slot column */}
                      <td className="p-3 text-center border-r border-slate-200/60 font-medium text-xs text-slate-500 bg-slate-50/40">
                        <div className="font-extrabold text-slate-700">{rowIndex + 1}. Lektion</div>
                        <div className="font-mono text-[10px] mt-1 bg-slate-100 px-1.5 py-0.5 rounded">{row.time}</div>
                      </td>

                      {/* Monday Cell(s) */}
                      {activeFilter === 'all' ? (
                        <>
                          <Cell cell={row.mondayA} />
                          <Cell cell={row.mondayB} />
                        </>
                      ) : activeFilter === 'groupA' ? (
                        <Cell cell={row.mondayA} />
                      ) : (
                        <Cell cell={row.mondayB} />
                      )}

                      {/* Tuesday Cell(s) */}
                      {activeFilter === 'all' ? (
                        <>
                          <Cell cell={row.tuesdayA} />
                          <Cell cell={row.tuesdayB} />
                        </>
                      ) : activeFilter === 'groupA' ? (
                        <Cell cell={row.tuesdayA} />
                      ) : (
                        <Cell cell={row.tuesdayB} />
                      )}

                      {/* Wednesday Cell(s) */}
                      {activeFilter === 'all' ? (
                        <>
                          <Cell cell={row.wednesdayA} />
                          <Cell cell={row.wednesdayB} />
                        </>
                      ) : activeFilter === 'groupA' ? (
                        <Cell cell={row.wednesdayA} />
                      ) : (
                        <Cell cell={row.wednesdayB} />
                      )}

                      {/* Thursday Cell(s) */}
                      {activeFilter === 'all' ? (
                        <>
                          <Cell cell={row.thursdayA} />
                          <Cell cell={row.thursdayB} />
                        </>
                      ) : activeFilter === 'groupA' ? (
                        <Cell cell={row.thursdayA} />
                      ) : (
                        <Cell cell={row.thursdayB} />
                      )}

                      {/* Friday Cell(s) */}
                      {activeFilter === 'all' ? (
                        <>
                          <Cell cell={row.fridayA} />
                          <Cell cell={row.fridayB} />
                        </>
                      ) : activeFilter === 'groupA' ? (
                        <Cell cell={row.fridayA} />
                      ) : (
                        <Cell cell={row.fridayB} />
                      )}
                    </tr>

                    {/* Inject beautifully styled break rows */}
                    {rowIndex === 2 && (
                      <tr className="bg-slate-100/70 border-b border-slate-200">
                        <td className="p-2 text-center text-[10px] uppercase tracking-widest text-primary font-bold bg-slate-100 border-r border-slate-200">
                          Pause
                        </td>
                        <td className="p-2 text-center text-[11px] font-bold text-slate-500 italic" colSpan={activeFilter === 'all' ? 10 : 5}>
                          Grosse Pause (09:55 – 10:15 Uhr)
                        </td>
                      </tr>
                    )}
                    {rowIndex === 4 && (
                      <tr className="bg-slate-100/70 border-b border-slate-200">
                        <td className="p-2 text-center text-[10px] uppercase tracking-widest text-primary font-bold bg-slate-100 border-r border-slate-200">
                          Mittag
                        </td>
                        <td className="p-2 text-center text-[11px] font-bold text-slate-500 italic" colSpan={activeFilter === 'all' ? 10 : 5}>
                          Mittagspause (11:50 – 13:30 Uhr)
                        </td>
                      </tr>
                    )}
                    {rowIndex === 6 && (
                      <tr className="bg-slate-100/70 border-b border-slate-200">
                        <td className="p-2 text-center text-[10px] uppercase tracking-widest text-primary font-bold bg-slate-100 border-r border-slate-200">
                          Pause
                        </td>
                        <td className="p-2 text-center text-[11px] font-bold text-slate-500 italic" colSpan={activeFilter === 'all' ? 10 : 5}>
                          Kurzpause (15:05 – 15:20 Uhr)
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Teachers Contacts & Class Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter font-sans">
        
        {/* Left Card: Teachers Contacts */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">diversity_3</span>
              Lehrpersonen & Kontakt
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Schule Suhr</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {TEACHERS.map((teacher) => (
              <button
                type="button"
                key={teacher.code}
                onClick={() => setSelectedTeacher(selectedTeacher === teacher.code ? null : teacher.code)}
                aria-expanded={selectedTeacher === teacher.code}
                className={`w-full text-left py-3 flex items-start justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-all ${selectedTeacher === teacher.code ? 'bg-primary/5 border border-primary/20' : ''}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono uppercase">
                      {teacher.code}
                    </span>
                    <span className="font-bold text-sm text-on-surface">{teacher.name}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">{teacher.subject}</p>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant font-bold bg-slate-100 px-2.5 py-1 rounded-xl">
                    Kontakt geschützt
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Card: Class Groups & Students */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span>
              Klasseneinteilung (Gruppen)
            </h3>
            <span className="text-[10px] uppercase font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">6B</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GROUPS.map((grp) => (
              <div key={grp.name} className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-primary border-b border-primary/20 pb-1.5 flex justify-between items-center">
                    <span>{grp.name}</span>
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-mono">{grp.size} Lernende</span>
                  </h4>
                  <p className="mt-3 text-xs font-semibold text-slate-500">Namen werden aus Datenschutzgründen nicht im Frontend gespeichert.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-sky-100 bg-sky-50 rounded-2xl p-4 text-xs font-semibold text-sky-800 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-sky-600 text-[18px] shrink-0 mt-0.5">help</span>
            <p className="leading-relaxed">
              Die Klassengruppen A und B werden für Fächer mit geteilten Lektionen verwendet (wie zum Beispiel <strong>Französisch</strong> oder <strong>Textiles Werken (TTG)</strong>). Beachten Sie Ihren jeweiligen Spaltenplan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Singular Cell representing a single lesson
function Cell({ cell }: { cell: { subject: string; teacherCode: string } }) {
  if (!cell.subject) {
    return (
      <td 
        className="p-2 border-r border-slate-200/60 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDAgTDIwIDIwIE0yMCAyMCBMNDAgMCBNMCAyMCBMMjAgMCBNMjAgNDAgTDQwIDIwIiBzdHJva2U9IiNmMThmMmYiIiNzdHJva2Utd2lkdGg9IjAuNyIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] overflow-hidden opacity-40 min-h-[90px]"
      />
    );
  }

  const { colorClass, borderClass, bgClass, room, teacherName } = getSubjectDetails(cell.subject);

  return (
    <td className="p-1.5 border-r border-slate-200/60 min-w-[70px]">
      <div className={`rounded-xl border-l-4 ${borderClass} ${bgClass} p-2 flex flex-col justify-between hover:scale-[1.03] transition-all duration-150 cursor-pointer shadow-xs min-h-[84px] h-full`}>
        <div className="flex flex-col">
          <span className={`font-extrabold text-[13px] ${colorClass}`}>{cell.subject}</span>
          <span className="text-[10px] text-slate-500 font-semibold truncate" title={teacherName}>{teacherName}</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 self-end uppercase tracking-wider">{room}</span>
      </div>
    </td>
  );
}
