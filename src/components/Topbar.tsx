import { useState } from 'react';
import { ViewTab } from '../types';
import { PlannerVersion } from '../data/plannerVersions';
import SyncStatus from './SyncStatus';

interface TopbarProps {
  toggleMobileMenu: () => void;
  navigate: (tab: ViewTab) => void;
  activePlanner: PlannerVersion['id'];
  setActivePlanner: (planner: PlannerVersion['id']) => void;
}

const searchItems: Array<{ label: string; tab: ViewTab; keywords: string }> = [
  { label: 'Dashboard', tab: 'dashboard', keywords: 'start heute übersicht' },
  { label: 'Stundenplan', tab: 'stundenplan', keywords: 'lektion fach lehrperson' },
  { label: 'Jahresübersicht', tab: 'jahresuebersicht', keywords: 'kalender ferien schuljahr' },
  { label: 'Wochenübersicht', tab: 'wochenuebersicht', keywords: 'woche notizen' },
  { label: 'Tagesübersicht', tab: 'tagesuebersicht', keywords: 'tag kursbuch lektion' },
  { label: 'Aufgaben', tab: 'aufgaben', keywords: 'todo korrekturen vorbereitung' },
];

export default function Topbar({ toggleMobileMenu, navigate, activePlanner, setActivePlanner }: TopbarProps) {
  const [query, setQuery] = useState('');
  const matches = query.trim()
    ? searchItems.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  const select = (tab: ViewTab) => {
    navigate(tab);
    setQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-md">
          <button 
            onClick={toggleMobileMenu}
            type="button"
            className="lg:hidden p-2 rounded-full hover:bg-surface-container-low transition-colors material-symbols-outlined text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Menü öffnen"
          >
            menu
          </button>
          <span className="font-headline-lg text-headline-lg font-semibold text-primary">LehrerPlaner</span>
          <div className="flex bg-surface-container-low p-1 rounded-xl" role="group" aria-label="Planer auswählen">
            {(['current', '2526'] as const).map((id) => (
              <button key={id} type="button" onClick={() => setActivePlanner(id)} aria-pressed={activePlanner === id} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activePlanner === id ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-white'}`}>
                {id === 'current' ? 'Aktuell' : '25/26'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-md">
          <SyncStatus navigate={navigate} />
          <div className="relative hidden md:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-surface-container-low rounded-full border-none font-label-md text-label-md focus:ring-2 focus:ring-primary w-[200px] transition-all focus:w-[260px] outline-none" 
              placeholder="Suchen..." 
              type="text" 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && matches[0]) select(matches[0].tab);
              }}
              aria-label="Planer durchsuchen"
            />
            {matches.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-outline-variant rounded-2xl shadow-lg p-2">
                {matches.map((item) => (
                  <button key={item.tab} type="button" onClick={() => select(item.tab)} className="w-full px-3 py-2 rounded-xl text-left text-sm font-semibold hover:bg-surface-container">
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-sm">
            <button type="button" onClick={() => navigate('aufgaben')} aria-label="Aufgaben öffnen" className="p-2 rounded-full hover:bg-surface-container-low transition-colors material-symbols-outlined text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary">
              notifications
            </button>
            <button type="button" onClick={() => navigate('stundenplan')} aria-label="Stundenplan öffnen" className="hidden sm:block p-2 rounded-full hover:bg-surface-container-low transition-colors material-symbols-outlined text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary">
              settings
            </button>
            <img 
              alt="Lehrer Profilbild" 
              className="w-8 h-8 rounded-full ml-2 border border-outline-variant object-cover" 
              src={`${import.meta.env.BASE_URL}assets/profile.svg`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
