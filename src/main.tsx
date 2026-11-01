import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "katex/dist/katex.min.css";
import './assets/styles/style.css';

console.log("version 1.0");

createRoot(document.getElementById('root')!).render(
  <App />
)