import React from 'react';
import { ViewTab } from '../types';
import { usePlanner } from '../context/PlannerContext';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const navItems: { id: ViewTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'stundenplan', label: 'Stundenplan', icon: 'calendar_view_week' },
  { id: 'jahresuebersicht', label: 'Jahresübersicht', icon: 'calendar_month' },
  { id: 'wochenuebersicht', label: 'Wochenübersicht', icon: 'view_week' },
  { id: 'tagesuebersicht', label: 'Tagesübersicht', icon: 'event_note' },
  { id: 'aufgaben', label: 'Aufgaben', icon: 'check_circle' },
];

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { planner } = usePlanner();
  const handleNavClick = (id: ViewTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant pt-20 flex flex-col py-md z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="px-md pb-lg border-b border-outline-variant mb-md hidden lg:block h-[72px] invisible">
          {/* Spacer to align with topbar visually if needed, but topbar is fixed */}
        </div>

        <div className="px-md mb-md">
          <h2 className="font-headline-lg text-headline-lg text-primary">Mein Planer</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Schuljahr {planner.schoolInfo.year}</p>
          {planner.id === '2526' && <p className="text-xs font-bold text-primary mt-1">12.06.–03.07.2026</p>}
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center gap-sm px-4 py-3 mx-2 my-1 rounded-2xl transition-all text-left group
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-bold opacity-100 scale-100' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                  }
                `}
              >
                <span 
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mb-md pt-4">
          <button type="button" onClick={() => handleNavClick('tagesuebersicht')} className="w-full bg-primary text-on-primary py-3 rounded-full font-label-md flex items-center justify-center gap-xs hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">add</span>
            Neue Notiz
          </button>
        </div>

        <div className="border-t border-outline-variant pt-2">
          <button type="button" onClick={() => handleNavClick('dashboard')} className="w-full text-left text-on-surface-variant px-4 py-3 mx-2 my-1 hover:bg-surface-container-high rounded-full flex items-center gap-sm transition-all">
            <span className="material-symbols-outlined">home</span>
            <span className="font-label-md text-label-md">Zur Startseite</span>
          </button>
        </div>
      </aside>
    </>
  );
}
