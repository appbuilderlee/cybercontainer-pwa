import React, { ReactNode } from 'react';

// --- Card ---
export const CyberCard: React.FC<{ children: ReactNode; title?: string; className?: string }> = ({ children, title, className = '' }) => (
  <div className={`relative bg-cyber-glass backdrop-blur-md border border-cyber-cyan/30 rounded-lg p-6 overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.1)] ${className}`}>
    {/* Decorative corner accents */}
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan"></div>
    
    {title && (
      <h2 className="text-xl font-mono font-bold text-cyber-cyan mb-4 tracking-wider uppercase border-b border-cyber-cyan/20 pb-2 flex items-center">
        <span className="w-2 h-2 bg-cyber-purple mr-2 animate-pulse"></span>
        {title}
      </h2>
    )}
    {children}
  </div>
);

// --- Button ---
interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger';
}

export const CyberButton: React.FC<CyberButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "font-mono font-bold py-3 px-6 rounded-sm uppercase tracking-widest transition-all duration-300 relative overflow-hidden group";
  const variants = {
    primary: "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan hover:text-black shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]",
    danger: "bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-black shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      {/* Glitch effect overlay on hover */}
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
    </button>
  );
};

// --- Input/Textarea ---
interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CyberInput: React.FC<CyberInputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-mono text-cyber-cyan/80 mb-1 uppercase tracking-wider">{label}</label>
    <input 
      className={`w-full bg-black/50 border border-cyber-purple/30 text-gray-200 font-mono p-3 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all ${className}`}
      {...props} 
    />
  </div>
);

interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const CyberTextarea: React.FC<CyberTextareaProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4 flex flex-col h-full">
    <label className="block text-xs font-mono text-cyber-cyan/80 mb-1 uppercase tracking-wider">{label}</label>
    <textarea 
      className={`w-full flex-grow bg-black/50 border border-cyber-purple/30 text-gray-200 font-mono p-3 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all resize-none min-h-[200px] ${className}`}
      {...props} 
    />
  </div>
);

// --- File Upload ---
interface CyberFileUploadProps {
  label: string;
  onFileSelect: (base64: string) => void;
  accept?: string;
  preview?: string | null;
}

export const CyberFileUpload: React.FC<CyberFileUploadProps> = ({ label, onFileSelect, accept = "image/*", preview }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-xs font-mono text-cyber-cyan/80 mb-1 uppercase tracking-wider">{label}</label>
      <div className="flex items-center space-x-4">
        <label className="cursor-pointer relative group">
          <div className="w-24 h-24 border-2 border-dashed border-cyber-purple/50 flex items-center justify-center bg-black/30 hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all">
             {preview ? (
               <img src={preview} alt="Preview" className="w-full h-full object-cover" />
             ) : (
               <span className="text-4xl text-cyber-purple/50 group-hover:text-cyber-cyan">+</span>
             )}
          </div>
          <input type="file" className="hidden" accept={accept} onChange={handleFile} />
        </label>
        <div className="text-xs text-gray-400 font-mono">
          <p>Tap box to upload.</p>
          <p className="mt-1 opacity-50">Recommended: 512x512 PNG</p>
        </div>
      </div>
    </div>
  );
};
