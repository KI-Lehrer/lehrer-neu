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

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('tagesuebersicht');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex bg-background min-h-screen">
      <Topbar toggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)} navigate={navigate} />
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
  );
}
