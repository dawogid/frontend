import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Contexts from './contexts/Contexts.jsx'
import './index.css'
// Global date/time locale setup
import moment from 'moment'
import 'moment/locale/en-gb'
// Set 24h + DD/MM/YYYY + Monday week start
moment.locale('en-gb')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Contexts>
      <App />
    </Contexts>
  </React.StrictMode>,
)
