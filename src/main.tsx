import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ServerTimeProvider } from './lib/ServerTimeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ServerTimeProvider>
            <App />
        </ServerTimeProvider>
    </React.StrictMode>
)
