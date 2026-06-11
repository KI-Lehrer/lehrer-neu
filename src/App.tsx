import { useState } from 'react';
import { ViewTab } from './types';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './views/Dashboard';
import Stundenplan from './views/Stundenplan';
import Jahresuebersicht from './views/Jahresuebersicht';
import Wochenuebersicht from './views/Wochenuebersicht';
import Tagesuebersicht from './views/Tagesuebersicht';
import Aufgaben from './views/Aufgaben';
import { PLANNER_VERSIONS, PlannerVersion } from './data/plannerVersions';
import { PlannerProvider } from './context/PlannerContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('tagesuebersicht');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePlanner, setActivePlanner] = useState<PlannerVersion['id']>('current');
  const [selectedDates, setSelectedDates] = useState<Record<PlannerVersion['id'], Date>>({
    current: PLANNER_VERSIONS.current.initialDate,
    '2526': PLANNER_VERSIONS['2526'].initialDate,
  });
  const planner = PLANNER_VERSIONS[activePlanner];

  const navigate = (tab: ViewTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard navigate={navigate} />;
      case 'stundenplan': return <Stundenplan />;
      case 'jahresuebersicht': return <Jahresuebersicht />;
      case 'wochenuebersicht': return <Wochenuebersicht />;
      case 'tagesuebersicht': return <Tagesuebersicht />;
      case 'aufgaben': return <Aufgaben />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <PlannerProvider value={{
      planner,
      selectedDate: selectedDates[activePlanner],
      setSelectedDate: (date) => setSelectedDates((dates) => ({ ...dates, [activePlanner]: date })),
    }}>
      <div className="flex bg-background min-h-screen">
        <Topbar toggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)} navigate={navigate} activePlanner={activePlanner} setActivePlanner={setActivePlanner} />
        <Sidebar
          activeTab={activeTab}
          setActiveTab={navigate}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1 lg:ml-64 pt-16 flex flex-col min-h-screen" id="main-content">
          {renderView()}
        </main>
      </div>
    </PlannerProvider>
  );
}
