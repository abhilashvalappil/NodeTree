import React from 'react';
import ReactDOM from 'react-dom/client';
import { NodeTreeApp } from './pages/NodeTreeApp';
import './style.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <NodeTreeApp />
  </React.StrictMode>
);
