
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
  // Ensure light mode is default
  localStorage.setItem("theme", "light");
}

// Initialize performance monitoring
if ('performance' in window && 'mark' in performance) {
  performance.mark('app-init-start');
}

// Mount the application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Track initial render completion
if ('performance' in window && 'mark' in performance) {
  performance.mark('app-init-end');
  performance.measure('app-initialization', 'app-init-start', 'app-init-end');
  
  // Log performance for development
  if (process.env.NODE_ENV === 'development') {
    const appInitMeasure = performance.getEntriesByName('app-initialization')[0];
    console.log(`App initialization time: ${appInitMeasure.duration.toFixed(2)}ms`);
  }
}

