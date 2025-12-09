import React, { useEffect, useState, useRef } from 'react';
import { CyberButton } from '../components/CyberUI';

interface RunnerProps {
  htmlContent: string;
  onReset?: () => void;
  onClosePreview?: () => void;
  isPreview?: boolean;
}

export const Runner: React.FC<RunnerProps> = ({ htmlContent, onReset, onClosePreview, isPreview = false }) => {
  const [countdown, setCountdown] = useState(5);
  const [showReset, setShowReset] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // If in preview mode, always show the button, no countdown needed
    if (isPreview) {
      setShowReset(true);
      return;
    }

    // Countdown logic for the emergency reset button (Only in Standalone mode)
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowReset(false);
    }
  }, [countdown, isPreview]);

  // Handle re-showing reset on triple tap anywhere (Standalone mode only)
  const tapCount = useRef(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleGlobalTouch = () => {
    if (isPreview) return; // Disable gesture in preview mode

    tapCount.current += 1;
    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    
    tapTimeout.current = setTimeout(() => {
      tapCount.current = 0;
    }, 500);

    if (tapCount.current >= 3) {
      setShowReset(true);
      setCountdown(5);
      tapCount.current = 0;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden z-[100]" 
      onTouchStart={handleGlobalTouch}
      onClick={handleGlobalTouch} 
    >
      <iframe
        ref={iframeRef}
        title="App Container"
        srcDoc={htmlContent}
        className="w-full h-full border-none block bg-[#050505]"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />

      {/* Control Overlay */}
      <div 
        className={`fixed top-6 right-6 z-[9999] transition-opacity duration-1000 ${showReset ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-end gap-2">
          {!isPreview && (
            <div className="text-xs font-mono text-red-500 bg-black/80 px-2 py-1 rounded border border-red-500/30">
              EMERGENCY OVERRIDE: {countdown}s
            </div>
          )}
          
          {isPreview ? (
            <CyberButton 
              variant="primary" 
              onClick={onClosePreview}
              className="text-sm py-2 px-4 !bg-black/80 backdrop-blur-md"
            >
              EXIT PREVIEW
            </CyberButton>
          ) : (
            <CyberButton 
              variant="danger" 
              onClick={onReset}
              className="text-sm py-2 px-4 shadow-[0_0_20px_rgba(255,0,0,0.5)] !border-red-600 !bg-red-900/80 !text-white"
            >
              FORCE RESET
            </CyberButton>
          )}
        </div>
      </div>
    </div>
  );
};