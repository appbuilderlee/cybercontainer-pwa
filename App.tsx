import React from 'react';
import { usePWA } from './hooks/usePWA';
import { Configurator } from './views/Configurator';
import { Runner } from './views/Runner';
import { DEFAULT_HTML } from './types';

function App() {
  const { isStandalone, htmlContent, iconData, saveData, resetData, isLoaded } = usePWA();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center text-cyber-cyan font-mono animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  // Standalone Mode: Run the App
  if (isStandalone) {
    // If somehow content is empty in standalone, fallback to default or safe mode
    const finalHtml = htmlContent || DEFAULT_HTML;
    return <Runner htmlContent={finalHtml} onReset={resetData} />;
  }

  // Browser Mode: Configuration
  return (
    <div className="bg-grid-pattern bg-fixed min-h-screen relative">
       {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-cyber-black/80 to-cyber-black pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <Configurator 
          initialHtml={htmlContent} 
          initialIcon={iconData} 
          onSave={saveData} 
        />
      </div>
    </div>
  );
}

export default App;