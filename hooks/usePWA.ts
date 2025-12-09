import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../types';

export const usePWA = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [iconData, setIconData] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check display mode
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();
    window.addEventListener('resize', checkStandalone); // Sometimes mode changes on resize in dev tools
    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  // Load Data
  useEffect(() => {
    const storedHtml = localStorage.getItem(STORAGE_KEYS.HTML_CONTENT);
    const storedIcon = localStorage.getItem(STORAGE_KEYS.ICON_DATA);

    if (storedHtml) setHtmlContent(storedHtml);
    if (storedIcon) setIconData(storedIcon);
    setIsLoaded(true);
  }, []);

  // Update Header Icons and Manifest dynamically
  useEffect(() => {
    let manifestURL: string | null = null;
    const manifestLink = document.querySelector('#app-manifest') as HTMLLinkElement;

    if (iconData) {
      // 1. Update Link Tags (Apple Touch Icon & Favicon)
      const linkTags = [
        { rel: 'icon', href: iconData },
        { rel: 'apple-touch-icon', href: iconData }
      ];

      linkTags.forEach(tagAttrs => {
        let link: HTMLLinkElement | null = document.querySelector(`link[rel="${tagAttrs.rel}"]`);
        if (!link) {
          link = document.createElement('link');
          link.rel = tagAttrs.rel;
          document.head.appendChild(link);
        }
        link.href = tagAttrs.href;
      });

      // 2. Update Manifest (For Android Add to Home Screen)
      // This forces the PWA to open in standalone mode and use the custom icon
      const manifest = {
        name: "CyberApp",
        short_name: "CyberApp",
        start_url: ".",
        display: "standalone",
        background_color: "#050505",
        theme_color: "#050505",
        icons: [
          {
            src: iconData,
            sizes: "192x192", 
            type: "image/png"
          },
          {
            src: iconData,
            sizes: "512x512",
            type: "image/png"
          }
        ]
      };

      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      manifestURL = URL.createObjectURL(blob);
      
      if (manifestLink) {
        manifestLink.href = manifestURL;
      } else {
        // Fallback if the link tag is missing from HTML for some reason
        const newLink = document.createElement('link');
        newLink.id = 'app-manifest';
        newLink.rel = 'manifest';
        newLink.href = manifestURL;
        document.head.appendChild(newLink);
      }
    } else {
      // If no icon data is present, ensure we don't have a stale manifest
      if (manifestLink) {
        manifestLink.removeAttribute('href');
      }
    }

    // Cleanup Blob URL to prevent memory leaks when component unmounts or icon changes
    return () => {
      if (manifestURL) {
        URL.revokeObjectURL(manifestURL);
      }
    };
  }, [iconData]);

  const saveData = useCallback((html: string, icon: string | null) => {
    localStorage.setItem(STORAGE_KEYS.HTML_CONTENT, html);
    setHtmlContent(html);
    
    if (icon) {
      localStorage.setItem(STORAGE_KEYS.ICON_DATA, icon);
      setIconData(icon);
    }
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.HTML_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.ICON_DATA);
    setHtmlContent('');
    setIconData(null);
    window.location.reload();
  }, []);

  return {
    isStandalone,
    htmlContent,
    iconData,
    saveData,
    resetData,
    isLoaded
  };
};