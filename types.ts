export const STORAGE_KEYS = {
  HTML_CONTENT: 'cyber_pwa_html',
  ICON_DATA: 'cyber_pwa_icon',
  IS_INSTALLED: 'cyber_pwa_installed'
};

export interface AppState {
  htmlContent: string;
  iconData: string | null;
  isStandalone: boolean;
}

export const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  body { 
    background: #000; 
    color: #00f3ff; 
    font-family: monospace; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    margin: 0;
    text-align: center;
  }
  h1 { font-size: 2rem; text-shadow: 0 0 10px #00f3ff; }
</style>
</head>
<body>
  <div>
    <h1>SYSTEM ONLINE</h1>
    <p>Welcome to your PWA.</p>
  </div>
</body>
</html>`;
