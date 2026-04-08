import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Auth context
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
  }, [])

  const login = (password) => {
    if (password === 'greyhounds2026') {
      localStorage.setItem('authToken', 'authenticated')
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setIsLoggedIn(false)
  }

  return { isLoggedIn, login, logout }
}

function App() {
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' })
  const { isLoggedIn, logout } = useAuth()

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus({ connected: true, message: data.message }))
      .catch(() => setBackendStatus({ connected: false, message: 'Backend not reachable' }))
  }, [])

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/">
              <img src="/images/JC_Logo.jpg" alt="Jones County Cross Country Logo" className="nav-logo" />
            </Link>
            <div>
              <span>High School & Middle School</span>
            </div>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/athletes">Athletes</Link></li>
            <li><Link to="/schedule">Schedule</Link></li>
            <li><Link to="/results">Results</Link></li>
            <li><Link to="/coaches">Coaches</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link to="/admin" className="admin-link">Admin</Link></li>
                <li><button onClick={logout} className="logout-btn">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="login-link">Login</Link></li>
            )}
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      <footer className="footer">
        <img src="/images/JC_Logo.jpg" alt="Jones County Cross Country Logo" className="footer-logo" />
        <p style={{ marginTop: '1rem' }}>
          <span className="gold">Jones County Greyhounds</span> Cross Country
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          High School & Middle School | Gray, Georgia | Go Greyhounds!
        </p>
        <div className={`backend-status ${backendStatus.connected ? 'connected' : 'disconnected'}`}
             style={{ marginTop: '1rem', display: 'inline-block' }}>
          Backend: {backendStatus.message}
        </div>
      </footer>
    </div>
  )
}

// Home Page
function HomePage() {
  return (
    <>
      <section className="hero">
        <img src="/images/JC_Logo.jpg" alt="Jones County Cross Country Logo" className="hero-logo" />
        <p className="tagline">Run with the Pack</p>
        <p>Welcome to the official home of Jones County High School and Middle School Cross Country.</p>
      </section>

      <section className="team-photo-section">
        <div className="team-photo-container">
          <img src="/images/2025_team.jpg" alt="2025 Jones County Cross Country Team" className="team-photo" />
          <div className="team-photo-caption">
            <h2>2025 Jones County Cross Country Team</h2>
            <p>Our Greyhound family - dedicated athletes and coaches running with pride and unity.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <section className="page-section">
          <h2>Welcome</h2>
          <p>The Jones County Cross Country program develops student-athletes who excel on the course and in the classroom.</p>
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">🏃</div>
              <h3>Our Mission</h3>
              <p>To develop dedicated runners who demonstrate excellence, sportsmanship, and teamwork.</p>
            </div>
            <div className="card">
              <div className="card-icon">🏆</div>
              <h3>Competitive Excellence</h3>
              <p>Our athletes compete at region, sectional, and state championships.</p>
            </div>
            <div className="card">
              <div className="card-icon">📚</div>
              <h3>Academic Achievement</h3>
              <p>We believe in the student-athlete model with strong academics.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

// Athletes Page - Fetches from API
function AthletesPage() {
  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch(`${API_URL}/api/athletes`).then(res => res.json())
  })

  if (isLoading) return <main className="main-content"><p>Loading athletes...</p></main>
  if (error) return <main className="main-content"><p>Error loading athletes</p></main>

  const highSchool = athletes?.filter(a => a.school_level === 'high_school') || []
  const middleSchool = athletes?.filter(a => a.school_level === 'middle_school') || []

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Team Roster</h2>
        <p>Meet the athletes who represent Jones County Cross Country.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>🏫 High School</h3>
        <div className="roster-grid">
          {highSchool.map(athlete => (
            <div className="athlete-card" key={athlete.id}>
              <div className="avatar">🏃</div>
              <h4>{athlete.name}</h4>
              <p>{athlete.grade}</p>
              <p><strong>PR: {athlete.personal_record || 'N/A'}</strong></p>
            </div>
          ))}
        </div>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>🏫 Middle School</h3>
        <div className="roster-grid">
          {middleSchool.map(athlete => (
            <div className="athlete-card" key={athlete.id}>
              <div className="avatar">🏃</div>
              <h4>{athlete.name}</h4>
              <p>{athlete.grade}</p>
              <p><strong>PR: {athlete.personal_record || 'N/A'}</strong></p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

// Schedule Page - Fetches from API
function SchedulePage() {
  const { data: meets, isLoading, error } = useQuery({
    queryKey: ['meets'],
    queryFn: () => fetch(`${API_URL}/api/meets`).then(res => res.json())
  })

  if (isLoading) return <main className="main-content"><p>Loading schedule...</p></main>
  if (error) return <main className="main-content"><p>Error loading schedule</p></main>

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>2026 Schedule</h2>
        <p>View our complete schedule of meets and events.</p>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {meets?.map(meet => (
              <tr key={meet.id}>
                <td>{meet.date}</td>
                <td><strong>{meet.name}</strong></td>
                <td>{meet.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

// Results Page - Fetches from API
function ResultsPage() {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['results'],
    queryFn: () => fetch(`${API_URL}/api/results`).then(res => res.json())
  })

  if (isLoading) return <main className="main-content"><p>Loading results...</p></main>
  if (error) return <main className="main-content"><p>Error loading results</p></main>

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Race Results</h2>
        <p>View recent meet results and individual performances.</p>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>Athlete</th>
              <th>Meet</th>
              <th>Time</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {results?.map(result => (
              <tr key={result.id}>
                <td><strong>{result.athlete_name}</strong></td>
                <td>{result.meet_name}</td>
                <td>{result.time}</td>
                <td>{result.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

// Coaches Page
function CoachesPage() {
  const coaches = [
    { name: 'Coach Mike Reynolds', title: 'Head Coach - High School', email: 'mreynolds@jones.k12.ga.us' },
    { name: 'Coach Lisa Martinez', title: 'Assistant Coach - HS Girls', email: 'lmartinez@jones.k12.ga.us' },
    { name: 'Coach Angela Brooks', title: 'Head Coach - Middle School', email: 'abrooks@jones.k12.ga.us' },
  ]

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Coaching Staff</h2>
        <p>Our dedicated coaches develop well-rounded student-athletes.</p>

        {coaches.map((coach, index) => (
          <div className="coach-card" key={index}>
            <div className="avatar">👤</div>
            <div>
              <h3>{coach.name}</h3>
              <p className="title">{coach.title}</p>
              <p><a href={`mailto:${coach.email}`}>{coach.email}</a></p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

// Contact Page
function ContactPage() {
  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Contact Us</h2>
        <p>Get in touch with the Jones County Cross Country program.</p>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="icon">📧</div>
            <div>
              <h4>Email</h4>
              <p>crosscountry@jones.k12.ga.us</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>(478) 986-3000</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>Jones County High School</p>
              <p>167 Greyhound Way, Gray, GA 31032</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Login Page
function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const testPassword = 'greyhounds2026'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin')
    } else {
      setError('Invalid password')
    }
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(testPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Admin Login</h2>
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-primary">Login</button>
          </form>
          <div className="test-password-box">
            <p className="test-label">For Testing Purposes Only</p>
            <div className="test-password-row">
              <code>{testPassword}</code>
              <button onClick={copyPassword} className="btn-copy">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Admin Dashboard
function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState(null)
  const [formData, setFormData] = useState({ name: '', grade: '', school_level: 'high_school', personal_record: '' })

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [navigate])

  const { data: athletes, isLoading } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch(`${API_URL}/api/athletes`).then(res => res.json()),
    enabled: isLoggedIn
  })

  const createMutation = useMutation({
    mutationFn: (newAthlete) => fetch(`${API_URL}/api/athletes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAthlete)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['athletes'])
      setShowAddForm(false)
      setFormData({ name: '', grade: '', school_level: 'high_school', personal_record: '' })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (athlete) => fetch(`${API_URL}/api/athletes/${athlete.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(athlete)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['athletes'])
      setEditingAthlete(null)
      setFormData({ name: '', grade: '', school_level: 'high_school', personal_record: '' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`${API_URL}/api/athletes/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries(['athletes'])
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAthlete) {
      updateMutation.mutate({ ...formData, id: editingAthlete.id })
    } else {
      createMutation.mutate(formData)
    }
  }

  const startEdit = (athlete) => {
    setEditingAthlete(athlete)
    setFormData({
      name: athlete.name,
      grade: athlete.grade,
      school_level: athlete.school_level,
      personal_record: athlete.personal_record || ''
    })
    setShowAddForm(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  if (!isLoggedIn) return null
  if (isLoading) return <main className="main-content"><p>Loading...</p></main>

  return (
    <main className="main-content">
      <section className="page-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: 0 }}>Admin Dashboard</h2>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
        <p>Manage athletes, meets, and results.</p>

        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => { setShowAddForm(!showAddForm); setEditingAthlete(null); setFormData({ name: '', grade: '', school_level: 'high_school', personal_record: '' }) }} className="btn-primary" style={{ width: 'auto' }}>
            {showAddForm ? 'Cancel' : 'Add New Athlete'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h3>{editingAthlete ? 'Edit Athlete' : 'Add New Athlete'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Grade</label>
                <input type="text" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>School Level</label>
                <select value={formData.school_level} onChange={(e) => setFormData({...formData, school_level: e.target.value})}>
                  <option value="high_school">High School</option>
                  <option value="middle_school">Middle School</option>
                </select>
              </div>
              <div className="form-group">
                <label>Personal Record</label>
                <input type="text" value={formData.personal_record} onChange={(e) => setFormData({...formData, personal_record: e.target.value})} placeholder="e.g., 16:42" />
              </div>
              <button type="submit" className="btn-primary">{editingAthlete ? 'Update' : 'Add'} Athlete</button>
            </form>
          </div>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>School</th>
              <th>PR</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {athletes?.map(athlete => (
              <tr key={athlete.id}>
                <td>{athlete.name}</td>
                <td>{athlete.grade}</td>
                <td>{athlete.school_level === 'high_school' ? 'HS' : 'MS'}</td>
                <td>{athlete.personal_record || '-'}</td>
                <td>
                  <button onClick={() => startEdit(athlete)} className="btn-edit">Edit</button>
                  <button onClick={() => { if(confirm('Delete this athlete?')) deleteMutation.mutate(athlete.id) }} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default App
