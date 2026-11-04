import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';

function App() {
  return <h1>React Demo</h1>;
}

createRoot(document.getElementById('root')).render(<App />);
