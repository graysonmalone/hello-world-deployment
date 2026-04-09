import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import './App.css'

// Shadcn Components
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Auth context
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
  }, [])

  const login = (username, password) => {
    if (username === 'admin' && password === 'greyhounds2026') {
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
                <li><Button variant="outline" size="sm" onClick={logout} className="text-purple-dark border-purple-dark hover:bg-purple hover:text-white">Logout</Button></li>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-t-4 border-t-gold">
              <CardHeader>
                <div className="text-4xl mb-2">🏃</div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>To develop dedicated runners who demonstrate excellence, sportsmanship, and teamwork.</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-gold">
              <CardHeader>
                <div className="text-4xl mb-2">🏆</div>
                <CardTitle>Competitive Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Our athletes compete at region, sectional, and state championships.</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-gold">
              <CardHeader>
                <div className="text-4xl mb-2">📚</div>
                <CardTitle>Academic Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>We believe in the student-athlete model with strong academics.</CardDescription>
              </CardContent>
            </Card>
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

  if (isLoading) return <main className="main-content"><p className="text-white p-8">Loading athletes...</p></main>
  if (error) return <main className="main-content"><p className="text-white p-8">Error loading athletes</p></main>

  const highSchool = athletes?.filter(a => a.school_level === 'high_school') || []
  const middleSchool = athletes?.filter(a => a.school_level === 'middle_school') || []

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Team Roster</h2>
        <p>Meet the athletes who represent Jones County Cross Country.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>🏫 High School</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {highSchool.map(athlete => (
            <Card key={athlete.id} className="border-l-4 border-l-gold">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple to-purple-light rounded-full mx-auto flex items-center justify-center text-2xl text-white mb-2">🏃</div>
                <CardTitle className="text-lg">{athlete.name}</CardTitle>
                <CardDescription>{athlete.grade}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-purple">PR: {athlete.personal_record || 'N/A'}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>🏫 Middle School</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {middleSchool.map(athlete => (
            <Card key={athlete.id} className="border-l-4 border-l-gold">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple to-purple-light rounded-full mx-auto flex items-center justify-center text-2xl text-white mb-2">🏃</div>
                <CardTitle className="text-lg">{athlete.name}</CardTitle>
                <CardDescription>{athlete.grade}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-purple">PR: {athlete.personal_record || 'N/A'}</p>
              </CardContent>
            </Card>
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

  if (isLoading) return <main className="main-content"><p className="text-white p-8">Loading schedule...</p></main>
  if (error) return <main className="main-content"><p className="text-white p-8">Error loading schedule</p></main>

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>2026 Schedule</h2>
        <p>View our complete schedule of meets and events.</p>

        <Card className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meets?.map(meet => (
                <TableRow key={meet.id}>
                  <TableCell>{meet.date}</TableCell>
                  <TableCell className="font-semibold">{meet.name}</TableCell>
                  <TableCell>{meet.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
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

  if (isLoading) return <main className="main-content"><p className="text-white p-8">Loading results...</p></main>
  if (error) return <main className="main-content"><p className="text-white p-8">Error loading results</p></main>

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Race Results</h2>
        <p>View recent meet results and individual performances.</p>

        <Card className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Athlete</TableHead>
                <TableHead>Meet</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Place</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.map(result => (
                <TableRow key={result.id}>
                  <TableCell className="font-semibold">{result.athlete_name}</TableCell>
                  <TableCell>{result.meet_name}</TableCell>
                  <TableCell>{result.time}</TableCell>
                  <TableCell>{result.place}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
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

        <div className="space-y-4 mt-6">
          {coaches.map((coach, index) => (
            <Card key={index} className="flex flex-row items-center gap-6 p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-3xl flex-shrink-0">👤</div>
              <div>
                <CardTitle className="text-xl mb-1">{coach.name}</CardTitle>
                <p className="text-purple font-semibold mb-1">{coach.title}</p>
                <a href={`mailto:${coach.email}`} className="text-gray-600 hover:text-purple">{coach.email}</a>
              </div>
            </Card>
          ))}
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-xl flex-shrink-0">📧</div>
              <div>
                <CardTitle className="text-lg mb-1">Email</CardTitle>
                <CardDescription>crosscountry@jones.k12.ga.us</CardDescription>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-xl flex-shrink-0">📞</div>
              <div>
                <CardTitle className="text-lg mb-1">Phone</CardTitle>
                <CardDescription>(478) 986-3000</CardDescription>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-xl flex-shrink-0">📍</div>
              <div>
                <CardTitle className="text-lg mb-1">Address</CardTitle>
                <CardDescription>Jones County High School<br />167 Greyhound Way, Gray, GA 31032</CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

// Login Page
function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(username, password)) {
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Admin Login</h2>
        <div className="flex justify-center mt-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </CardContent>
          </Card>
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

  const [dialogOpen, setDialogOpen] = useState(false)
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
      setDialogOpen(false)
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
      setDialogOpen(false)
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
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingAthlete(null)
    setFormData({ name: '', grade: '', school_level: 'high_school', personal_record: '' })
    setDialogOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  if (!isLoggedIn) return null
  if (isLoading) return <main className="main-content"><p className="text-white p-8">Loading...</p></main>

  return (
    <main className="main-content">
      <section className="page-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-0">Admin Dashboard</h2>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
        <p>Manage athletes, meets, and results.</p>

        <div className="my-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>Add New Athlete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAthlete ? 'Edit Athlete' : 'Add New Athlete'}</DialogTitle>
                <DialogDescription>
                  {editingAthlete ? 'Update the athlete information below.' : 'Fill in the details to add a new athlete.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school_level">School Level</Label>
                  <Select value={formData.school_level} onValueChange={(value) => setFormData({...formData, school_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="middle_school">Middle School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pr">Personal Record</Label>
                  <Input id="pr" value={formData.personal_record} onChange={(e) => setFormData({...formData, personal_record: e.target.value})} placeholder="e.g., 16:42" />
                </div>
                <DialogFooter>
                  <Button type="submit">{editingAthlete ? 'Update' : 'Add'} Athlete</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>School</TableHead>
                <TableHead>PR</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes?.map(athlete => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-semibold">{athlete.name}</TableCell>
                  <TableCell>{athlete.grade}</TableCell>
                  <TableCell>{athlete.school_level === 'high_school' ? 'HS' : 'MS'}</TableCell>
                  <TableCell>{athlete.personal_record || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(athlete)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => { if(confirm('Delete this athlete?')) deleteMutation.mutate(athlete.id) }}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </main>
  )
}

export default App
