import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { LoginScreen } from './screens/LoginScreen';
import { Dashboard } from './screens/Dashboard';
import './styles.css';

const AppContent = () => {
  const { isAuthenticated } = useApp();

  return (
    <div className="w-[400px] h-[600px] bg-gradient-to-br from-primary via-[#0f172a] to-primary text-white overflow-hidden relative font-sans selection:bg-accent-blue/30 selection:text-white flex flex-col">
      {/* Background Mesh Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col">
        {isAuthenticated ? <Dashboard /> : <LoginScreen />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
