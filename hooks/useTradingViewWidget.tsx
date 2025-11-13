"use client";
import { useEffect, useRef } from "react";

// reusable tradingview chart widget
const useTradingViewWidget = (
  scriptUrl: string, // URL to load TradingView script
  config: Record<string, unknown>, // chart settings
  height = 600 // default height
) => {
  const containerRef = useRef<HTMLDivElement | null>(null); // create a reference to a DOM element, attach to JSX 

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.loaded) return;
    containerRef.current.innerHTML = `
      <div class="tradingview-widget-container__widget" 
          style="width: 100%; height: ${height}px;">
      </div>
    `;

    // load TradingView script into DOM
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    // Add script to page
    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = 'true';

    // cleanup code
    return () => {
      if(containerRef.current) {
        containerRef.current.innerHTML = '';
        delete containerRef.current.dataset.loaded;
      }
    }
  }, [scriptUrl, config, height]);
  return containerRef;
};

export default useTradingViewWidget;
