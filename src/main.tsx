
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
  // Ensure light mode is default
  localStorage.setItem("theme", "light");
}

createRoot(document.getElementById("root")!).render(<App />);
