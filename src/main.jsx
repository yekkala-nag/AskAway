import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './AppNew.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
// Auto-mark dirty on any sync-relevant localStorage write so progress sync
// can batch server pushes (debounced ≥ 5s). No-op in Node/test (no window).
import { enableAutoDirty } from './services/sync.js';
enableAutoDirty();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

