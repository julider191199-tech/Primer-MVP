import React, { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { ExpenseEntry } from './views/ExpenseEntry';
import { CategoryDetail } from './views/CategoryDetail';
import { History } from './views/History';
import { Configuration } from './views/Configuration';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'entry': return <ExpenseEntry />;
      case 'details': return <CategoryDetail />;
      case 'history': return <History />;
      case 'config': return <Configuration />;
      default: return <Dashboard />;
    }
  };

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-slate-50 flex">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
          
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="font-bold text-slate-800">ObraControl</span>
            </div>
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* View Content */}
          <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {renderView()}
          </div>
          
        </main>
      </div>
    </BudgetProvider>
  );
};

export default App;
