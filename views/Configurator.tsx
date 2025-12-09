import React, { useState } from 'react';
import { CyberCard, CyberButton, CyberTextarea, CyberFileUpload } from '../components/CyberUI';
import { DEFAULT_HTML } from '../types';
import { Runner } from './Runner';

interface ConfiguratorProps {
  initialHtml: string;
  initialIcon: string | null;
  onSave: (html: string, icon: string | null) => void;
}

export const Configurator: React.FC<ConfiguratorProps> = ({ initialHtml, initialIcon, onSave }) => {
  const [html, setHtml] = useState(initialHtml || DEFAULT_HTML);
  const [icon, setIcon] = useState<string | null>(initialIcon);
  const [activeTab, setActiveTab] = useState<'setup' | 'code'>('setup');
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSave = () => {
    onSave(html, icon);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  // If in preview mode, render the Runner component on top
  if (isPreviewMode) {
    return (
      <Runner 
        htmlContent={html} 
        isPreview={true} 
        onClosePreview={() => setIsPreviewMode(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto flex flex-col gap-6">
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] tracking-tighter">
          CYBER<span className="text-white">CONTAINER</span>
        </h1>
        <p className="text-cyber-cyan/60 font-mono text-sm mt-2 tracking-widest">WEB TO PWA PROTOCOL</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-cyber-cyan/20 mb-2">
        <button 
          onClick={() => setActiveTab('setup')}
          className={`flex-1 py-3 font-mono text-sm uppercase tracking-wider transition-all ${activeTab === 'setup' ? 'text-cyber-black bg-cyber-cyan' : 'text-cyber-cyan/50 hover:text-cyber-cyan'}`}
        >
          01. Setup & Icon
        </button>
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-3 font-mono text-sm uppercase tracking-wider transition-all ${activeTab === 'code' ? 'text-cyber-black bg-cyber-purple' : 'text-cyber-purple/50 hover:text-cyber-purple'}`}
        >
          02. Source Code
        </button>
      </div>

      {activeTab === 'setup' && (
        <div className="space-y-6 animate-fade-in">
          <CyberCard title="Identity Configuration">
            <CyberFileUpload 
              label="App Icon (Tap to Upload)" 
              onFileSelect={setIcon} 
              preview={icon} 
            />
            <div className="text-xs font-mono text-gray-400 mt-4 p-3 border border-dashed border-gray-700 bg-black/40">
              <span className="text-cyber-purple font-bold">WARNING:</span> iOS Icon updates may require "Add to Home Screen" to be performed *after* uploading the icon. Android typically updates immediately.
            </div>
          </CyberCard>

          <CyberCard title="Installation Sequence">
            <ol className="list-decimal list-inside space-y-4 text-sm font-mono text-gray-300">
              <li className="pl-2">
                <span className="text-cyber-cyan">Upload Icon</span> & <span className="text-cyber-purple">Input Code</span>.
              </li>
              <li className="pl-2">
                Tap <span className="text-white bg-cyber-cyan/20 px-1 border border-cyber-cyan/50 text-xs">SAVE CONFIG</span> below.
              </li>
              <li className="pl-2">
                Open Browser Menu (Share on iOS).
              </li>
              <li className="pl-2">
                Select <span className="text-white font-bold">"Add to Home Screen"</span>.
              </li>
              <li className="pl-2">
                Launch from Home Screen to execute.
              </li>
            </ol>
          </CyberCard>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="h-full flex-grow flex flex-col animate-fade-in">
           <CyberCard title="Payload Injection" className="flex-grow flex flex-col">
             <div className="flex justify-end mb-2">
                <label className="cursor-pointer text-xs text-cyber-cyan underline hover:text-white transition-colors">
                   Load from .html file
                   <input type="file" className="hidden" accept=".html" onChange={(e) => {
                     const file = e.target.files?.[0];
                     if(file) {
                       const reader = new FileReader();
                       reader.onload = (ev) => setHtml(ev.target?.result as string);
                       reader.readAsText(file);
                     }
                   }} />
                </label>
             </div>
             <CyberTextarea 
               label="HTML Source" 
               value={html}
               onChange={(e) => setHtml(e.target.value)}
               placeholder="<html>...</html>"
               className="font-mono text-xs leading-relaxed text-green-400 min-h-[400px]"
             />
           </CyberCard>
        </div>
      )}

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-cyber-cyan/20 p-4 backdrop-blur-lg z-50">
        <div className="max-w-2xl mx-auto flex gap-4 items-center justify-between">
           <div className="text-xs font-mono text-gray-500 hidden md:block">
              STATUS: {showSavedMsg ? <span className="text-green-500 animate-pulse font-bold">SAVED</span> : <span className="text-cyber-cyan">READY</span>}
           </div>
           
           <div className="flex w-full md:w-auto gap-2">
             <button 
               onClick={() => setIsPreviewMode(true)}
               className="flex-1 md:flex-none font-mono font-bold py-3 px-6 rounded-sm uppercase tracking-widest transition-all border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-black"
             >
               Preview
             </button>
             <CyberButton onClick={handleSave} className="flex-1 md:flex-none">
               {showSavedMsg ? 'Saved!' : 'Save Config'}
             </CyberButton>
           </div>
        </div>
      </div>
    </div>
  );
};