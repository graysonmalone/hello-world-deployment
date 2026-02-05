import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Loading...')

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    
    fetch(`${apiUrl}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Backend not reachable'))
  }, [])

  return (
    <div className="App">
      <h1>Hello World</h1>
      <p>Frontend: React + Vite ✓</p>
      <p>Backend: {backendStatus}</p>
    </div>
  )
}

export default App