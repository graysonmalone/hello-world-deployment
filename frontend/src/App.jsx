import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' })

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

    fetch(`${apiUrl}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus({ connected: true, message: data.message }))
      .catch(() => setBackendStatus({ connected: false, message: 'Backend not reachable' }))
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'roster', label: 'Roster' },
    { id: 'coaches', label: 'Coaches' },
    { id: 'results', label: 'Results' },
    { id: 'practice', label: 'Practice' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <img src="/images/JC_Logo.jpg" alt="Jones County Cross Country Logo" className="nav-logo" />
            <div>
              <span>High School & Middle School</span>
            </div>
          </div>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={currentPage === item.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(item.id)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'schedule' && <SchedulePage />}
      {currentPage === 'roster' && <RosterPage />}
      {currentPage === 'coaches' && <CoachesPage />}
      {currentPage === 'results' && <ResultsPage />}
      {currentPage === 'practice' && <PracticePage />}
      {currentPage === 'contact' && <ContactPage />}

      {/* Footer */}
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

// Home Page Component
function HomePage() {
  return (
    <>
      <section className="hero">
        <img src="/images/JC_Logo.jpg" alt="Jones County Cross Country Logo" className="hero-logo" />
        <p className="tagline">Run with the Pack</p>
        <p>
          Welcome to the official home of Jones County High School and Middle School Cross Country.
          Our Greyhounds compete with heart, determination, and school pride.
        </p>
      </section>

      {/* Team Photo Section */}
      <section className="team-photo-section">
        <div className="team-photo-container">
          <img src="/images/2025_team.jpg" alt="2025 Jones County Cross Country Team" className="team-photo" />
          <div className="team-photo-caption">
            <h2>2025 Jones County Cross Country Team</h2>
            <p>
              Our Greyhound family - the dedicated athletes and coaches of Jones County High School
              and Middle School Cross Country. Together, we run with pride, determination, and unity.
            </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <section className="page-section">
          <h2>Welcome</h2>
          <p>
            The Jones County Cross Country program is dedicated to developing student-athletes
            who excel both on the course and in the classroom. Our high school and middle school
            runners train year-round to compete at the highest levels in Georgia athletics.
          </p>

          <div className="card-grid">
            <div className="card">
              <div className="card-icon">🏃</div>
              <h3>Our Mission</h3>
              <p>
                To develop dedicated runners who demonstrate excellence, sportsmanship,
                and teamwork while representing Jones County with pride.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">🏆</div>
              <h3>Competitive Excellence</h3>
              <p>
                Our athletes compete in region, sectional, and state championships,
                consistently representing Jones County at the highest levels.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">📚</div>
              <h3>Academic Achievement</h3>
              <p>
                We believe in the student-athlete model. Our runners maintain strong
                academic records while pursuing athletic excellence.
              </p>
            </div>
          </div>
        </section>

        <section className="page-section">
          <h2>Quick Links</h2>
          <div className="card-grid">
            <div className="card">
              <h3>Upcoming Meets</h3>
              <p>Check our schedule for upcoming competitions and events.</p>
            </div>
            <div className="card">
              <h3>Join the Team</h3>
              <p>Interested in running? Contact our coaches for tryout information.</p>
            </div>
            <div className="card">
              <h3>Support the Greyhounds</h3>
              <p>Learn how you can support our cross country program.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

// Schedule Page Component
function SchedulePage() {
  const highSchoolMeets = [
    { date: 'Aug 15, 2026', event: 'Time Trials', location: 'Jones County HS', type: 'Practice' },
    { date: 'Aug 22, 2026', event: 'Season Opener Invitational', location: 'Macon, GA', type: 'Meet' },
    { date: 'Aug 29, 2026', event: 'Greyhound Classic', location: 'Jones County HS (Home)', type: 'Home Meet' },
    { date: 'Sep 5, 2026', event: 'Middle Georgia Championship', location: 'Perry, GA', type: 'Meet' },
    { date: 'Sep 12, 2026', event: 'Panther Invitational', location: 'Stockbridge, GA', type: 'Meet' },
    { date: 'Sep 19, 2026', event: 'Region Preview Meet', location: 'Dublin, GA', type: 'Meet' },
    { date: 'Oct 3, 2026', event: 'Jones County Twilight Meet', location: 'Jones County HS (Home)', type: 'Home Meet' },
    { date: 'Oct 17, 2026', event: 'Pre-Region Championship', location: 'Warner Robins, GA', type: 'Meet' },
    { date: 'Oct 24, 2026', event: 'Region Championship', location: 'TBD', type: 'Championship' },
    { date: 'Nov 7, 2026', event: 'State Championship', location: 'Carrollton, GA', type: 'Championship' },
  ]

  const middleSchoolMeets = [
    { date: 'Aug 20, 2026', event: 'MS Time Trials', location: 'Jones County MS', type: 'Practice' },
    { date: 'Aug 27, 2026', event: 'Pup Run Invitational', location: 'Macon, GA', type: 'Meet' },
    { date: 'Sep 3, 2026', event: 'Greyhound Classic (MS Division)', location: 'Jones County (Home)', type: 'Home Meet' },
    { date: 'Sep 10, 2026', event: 'Middle Georgia MS Championship', location: 'Perry, GA', type: 'Meet' },
    { date: 'Sep 17, 2026', event: 'Falcon Flyer Invitational', location: 'Warner Robins, GA', type: 'Meet' },
    { date: 'Sep 24, 2026', event: 'Jones County MS Twilight', location: 'Jones County (Home)', type: 'Home Meet' },
    { date: 'Oct 8, 2026', event: 'County Championship', location: 'Gray, GA', type: 'Championship' },
    { date: 'Oct 22, 2026', event: 'Middle School State Meet', location: 'Carrollton, GA', type: 'Championship' },
  ]

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>2026 Schedule</h2>
        <p>View our complete schedule of meets and events for high school and middle school teams.</p>

        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 High School Schedule</h3>
        </div>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Location</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {highSchoolMeets.map((meet, index) => (
              <tr key={index}>
                <td>{meet.date}</td>
                <td><strong>{meet.event}</strong></td>
                <td>{meet.location}</td>
                <td>{meet.type}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '3rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 Middle School Schedule</h3>
        </div>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Location</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {middleSchoolMeets.map((meet, index) => (
              <tr key={index}>
                <td>{meet.date}</td>
                <td><strong>{meet.event}</strong></td>
                <td>{meet.location}</td>
                <td>{meet.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

// Roster Page Component
function RosterPage() {
  const highSchoolAthletes = {
    varsityBoys: [
      { name: 'Marcus Johnson', grade: 'Senior', event: '5K PR: 16:42' },
      { name: 'Tyler Williams', grade: 'Senior', event: '5K PR: 17:05' },
      { name: 'David Chen', grade: 'Junior', event: '5K PR: 17:23' },
      { name: 'James Rodriguez', grade: 'Junior', event: '5K PR: 17:45' },
      { name: 'Chris Thompson', grade: 'Sophomore', event: '5K PR: 18:12' },
      { name: 'Michael Davis', grade: 'Sophomore', event: '5K PR: 18:30' },
    ],
    varsityGirls: [
      { name: 'Sarah Mitchell', grade: 'Senior', event: '5K PR: 19:15' },
      { name: 'Emily Parker', grade: 'Senior', event: '5K PR: 19:45' },
      { name: 'Jessica Lee', grade: 'Junior', event: '5K PR: 20:02' },
      { name: 'Amanda White', grade: 'Junior', event: '5K PR: 20:28' },
      { name: 'Rachel Green', grade: 'Sophomore', event: '5K PR: 20:55' },
      { name: 'Olivia Brown', grade: 'Freshman', event: '5K PR: 21:15' },
    ],
  }

  const middleSchoolAthletes = {
    boys: [
      { name: 'Ethan Harris', grade: '8th Grade', event: '3K PR: 11:15' },
      { name: 'Noah Wilson', grade: '8th Grade', event: '3K PR: 11:32' },
      { name: 'Liam Anderson', grade: '7th Grade', event: '3K PR: 11:58' },
      { name: 'Mason Taylor', grade: '7th Grade', event: '3K PR: 12:10' },
      { name: 'Lucas Martinez', grade: '6th Grade', event: '3K PR: 12:45' },
    ],
    girls: [
      { name: 'Sophia Clark', grade: '8th Grade', event: '3K PR: 12:30' },
      { name: 'Isabella Moore', grade: '8th Grade', event: '3K PR: 12:48' },
      { name: 'Mia Jackson', grade: '7th Grade', event: '3K PR: 13:05' },
      { name: 'Charlotte Lewis', grade: '7th Grade', event: '3K PR: 13:22' },
      { name: 'Amelia Walker', grade: '6th Grade', event: '3K PR: 13:55' },
    ],
  }

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Team Roster</h2>
        <p>Meet the athletes who represent Jones County Cross Country.</p>

        {/* High School Section */}
        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 High School</h3>
        </div>

        <h4 style={{ marginTop: '1.5rem', color: 'var(--purple)' }}>Varsity Boys</h4>
        <div className="roster-grid">
          {highSchoolAthletes.varsityBoys.map((athlete, index) => (
            <div className="athlete-card" key={index}>
              <div className="avatar">🏃</div>
              <h4>{athlete.name}</h4>
              <p>{athlete.grade}</p>
              <p><strong>{athlete.event}</strong></p>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: '2rem', color: 'var(--purple)' }}>Varsity Girls</h4>
        <div className="roster-grid">
          {highSchoolAthletes.varsityGirls.map((athlete, index) => (
            <div className="athlete-card" key={index}>
              <div className="avatar">🏃‍♀️</div>
              <h4>{athlete.name}</h4>
              <p>{athlete.grade}</p>
              <p><strong>{athlete.event}</strong></p>
            </div>
          ))}
        </div>

        {/* Middle School Section */}
        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '3rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 Middle School</h3>
        </div>

        <h4 style={{ marginTop: '1.5rem', color: 'var(--purple)' }}>Boys Team</h4>
        <div className="roster-grid">
          {middleSchoolAthletes.boys.map((athlete, index) => (
            <div className="athlete-card" key={index}>
              <div className="avatar">🏃</div>
              <h4>{athlete.name}</h4>
              <p>{athlete.grade}</p>
              <p><strong>{athlete.event}</strong></p>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: '2rem', color: 'var(--purple)' }}>Girls Team</h4>
        <div className="roster-grid">
          {middleSchoolAthletes.girls.map((athlete, index) => (
            <div className="athlete-card" key={index}>
              <div className="avatar">🏃‍♀️</div>
              <h4>{athlete.name}</h4>
              <p>{athlete.grade}</p>
              <p><strong>{athlete.event}</strong></p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

// Coaches Page Component
function CoachesPage() {
  const highSchoolCoaches = [
    {
      name: 'Coach Mike Reynolds',
      title: 'Head Coach - High School',
      bio: 'Coach Reynolds has led the Jones County Cross Country program for 12 years, guiding multiple athletes to state championships. A former collegiate runner, he brings expertise and passion to developing young athletes.',
      email: 'mreynolds@jones.k12.ga.us'
    },
    {
      name: 'Coach Lisa Martinez',
      title: 'Assistant Coach - HS Girls Team',
      bio: 'Coach Martinez joined the program in 2019 and has been instrumental in building our girls team into a competitive force in the region. She specializes in distance training and race strategy.',
      email: 'lmartinez@jones.k12.ga.us'
    },
    {
      name: 'Coach Derek Thompson',
      title: 'Assistant Coach - HS Boys Team',
      bio: 'A Jones County alum and former Greyhound runner, Coach Thompson returned to lead the next generation. He focuses on strength training and mental preparation.',
      email: 'dthompson@jones.k12.ga.us'
    },
  ]

  const middleSchoolCoaches = [
    {
      name: 'Coach Angela Brooks',
      title: 'Head Coach - Middle School',
      bio: 'Coach Brooks has been developing young runners at Jones County Middle School for 8 years. She focuses on building a love for running and teaching proper fundamentals that prepare athletes for high school competition.',
      email: 'abrooks@jones.k12.ga.us'
    },
    {
      name: 'Coach Kevin Price',
      title: 'Assistant Coach - Middle School',
      bio: 'Coach Price brings energy and enthusiasm to the middle school program. A certified youth running coach, he emphasizes fun, fitness, and team building for our youngest Greyhounds.',
      email: 'kprice@jones.k12.ga.us'
    },
  ]

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Coaching Staff</h2>
        <p>Our dedicated coaches are committed to developing well-rounded student-athletes at both the high school and middle school levels.</p>

        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 High School Coaches</h3>
        </div>

        {highSchoolCoaches.map((coach, index) => (
          <div className="coach-card" key={index}>
            <div className="avatar">👤</div>
            <div>
              <h3>{coach.name}</h3>
              <p className="title">{coach.title}</p>
              <p>{coach.bio}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <a href={`mailto:${coach.email}`}>{coach.email}</a>
              </p>
            </div>
          </div>
        ))}

        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '3rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 Middle School Coaches</h3>
        </div>

        {middleSchoolCoaches.map((coach, index) => (
          <div className="coach-card" key={index}>
            <div className="avatar">👤</div>
            <div>
              <h3>{coach.name}</h3>
              <p className="title">{coach.title}</p>
              <p>{coach.bio}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <a href={`mailto:${coach.email}`}>{coach.email}</a>
              </p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

// Results Page Component
function ResultsPage() {
  const highSchoolResults = [
    {
      event: '2025 State Championship',
      date: 'November 8, 2025',
      boysPlace: '8th Place - Class AAAA',
      girlsPlace: '12th Place - Class AAAA',
      highlights: 'Marcus Johnson - 15th overall (16:42)'
    },
    {
      event: '2025 Region Championship',
      date: 'October 25, 2025',
      boysPlace: '2nd Place',
      girlsPlace: '3rd Place',
      highlights: 'Both teams qualified for State'
    },
    {
      event: 'Greyhound Classic 2025',
      date: 'August 30, 2025',
      boysPlace: '1st Place',
      girlsPlace: '1st Place',
      highlights: 'Home course records set in both races'
    },
  ]

  const middleSchoolResults = [
    {
      event: '2025 MS State Meet',
      date: 'October 23, 2025',
      boysPlace: '5th Place',
      girlsPlace: '7th Place',
      highlights: 'Ethan Harris - 12th overall (11:15)'
    },
    {
      event: '2025 County Championship',
      date: 'October 9, 2025',
      boysPlace: '1st Place',
      girlsPlace: '2nd Place',
      highlights: 'Boys team undefeated in county competition'
    },
    {
      event: 'Greyhound Classic MS Division 2025',
      date: 'September 4, 2025',
      boysPlace: '1st Place',
      girlsPlace: '1st Place',
      highlights: 'Swept all age group divisions'
    },
  ]

  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Results</h2>
        <p>View recent meet results and team achievements for both high school and middle school.</p>

        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 High School Results</h3>
        </div>

        {highSchoolResults.map((result, index) => (
          <div className="results-card" key={index}>
            <h3>{result.event}</h3>
            <p className="date">{result.date}</p>
            <p><strong>Boys:</strong> {result.boysPlace}</p>
            <p><strong>Girls:</strong> {result.girlsPlace}</p>
            <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{result.highlights}</p>
          </div>
        ))}

        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '3rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 Middle School Results</h3>
        </div>

        {middleSchoolResults.map((result, index) => (
          <div className="results-card" key={index}>
            <h3>{result.event}</h3>
            <p className="date">{result.date}</p>
            <p><strong>Boys:</strong> {result.boysPlace}</p>
            <p><strong>Girls:</strong> {result.girlsPlace}</p>
            <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{result.highlights}</p>
          </div>
        ))}

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Course Records</h3>
          <p><strong>HS Boys 5K:</strong> 15:58 | <strong>HS Girls 5K:</strong> 18:45</p>
          <p><strong>MS Boys 3K:</strong> 10:42 | <strong>MS Girls 3K:</strong> 11:58</p>
        </div>
      </section>
    </main>
  )
}

// Practice Page Component
function PracticePage() {
  return (
    <main className="main-content">
      <section className="page-section">
        <h2>Practice Information</h2>
        <p>Everything you need to know about practices and training for both high school and middle school.</p>

        {/* High School Practice */}
        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 High School Practice</h3>
        </div>

        <div className="practice-info">
          <h3>📅 HS Practice Schedule</h3>
          <ul className="practice-list">
            <li>🏃 <strong>Monday:</strong> Distance run (5-7 miles) - 3:30 PM</li>
            <li>🏃 <strong>Tuesday:</strong> Speed work / Intervals - 3:30 PM</li>
            <li>🏃 <strong>Wednesday:</strong> Easy recovery run + strength training - 3:30 PM</li>
            <li>🏃 <strong>Thursday:</strong> Tempo run / Race pace work - 3:30 PM</li>
            <li>🏃 <strong>Friday:</strong> Pre-meet shakeout or easy run - 3:30 PM</li>
            <li>🏃 <strong>Saturday:</strong> Meet day or long run (7-10 miles) - 8:00 AM</li>
          </ul>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-icon">📍</div>
          <h3>HS Practice Location</h3>
          <p>Jones County High School - Track and surrounding trails</p>
          <p>Gray, GA 31032</p>
        </div>

        {/* Middle School Practice */}
        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '3rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 Middle School Practice</h3>
        </div>

        <div className="practice-info">
          <h3>📅 MS Practice Schedule</h3>
          <ul className="practice-list">
            <li>🏃 <strong>Monday:</strong> Easy run (2-3 miles) + drills - 3:45 PM</li>
            <li>🏃 <strong>Tuesday:</strong> Speed development / Short intervals - 3:45 PM</li>
            <li>🏃 <strong>Wednesday:</strong> Fun run + team games - 3:45 PM</li>
            <li>🏃 <strong>Thursday:</strong> Moderate distance (2-4 miles) - 3:45 PM</li>
            <li>🏃 <strong>Friday:</strong> Pre-meet prep or easy run - 3:45 PM</li>
            <li>🏃 <strong>Saturday:</strong> Meet day (as scheduled)</li>
          </ul>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-icon">📍</div>
          <h3>MS Practice Location</h3>
          <p>Jones County Middle School - Track and campus trails</p>
          <p>Gray, GA 31032</p>
        </div>

        {/* General Info */}
        <div className="card-grid" style={{ marginTop: '3rem' }}>
          <div className="card">
            <div className="card-icon">🎒</div>
            <h3>What to Bring</h3>
            <p>Running shoes, water bottle, weather-appropriate clothing, positive attitude!</p>
          </div>
          <div className="card">
            <div className="card-icon">⚠️</div>
            <h3>Important Notes</h3>
            <p>All athletes must have a current physical on file. Practice attendance is mandatory for meet participation.</p>
          </div>
        </div>

        <div className="practice-info" style={{ marginTop: '2rem' }}>
          <h3>🌡️ Weather Policy</h3>
          <p>
            Practice may be modified or cancelled due to severe weather, extreme heat (heat index above 105°F),
            or lightning. Athletes will be notified via team group chat. When in doubt, check with coaches.
          </p>
        </div>
      </section>
    </main>
  )
}

// Contact Page Component
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
            <div className="icon">🐦</div>
            <div>
              <h4>Social Media</h4>
              <p>Follow us for updates and meet results!</p>
              <p>@JCGreyhoundXC</p>
            </div>
          </div>
        </div>

        {/* High School Contact */}
        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 High School</h3>
        </div>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>(478) 986-3000</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>Jones County High School Main Office</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>Jones County High School</p>
              <p>167 Greyhound Way</p>
              <p>Gray, GA 31032</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon">👤</div>
            <div>
              <h4>Head Coach</h4>
              <p>Coach Mike Reynolds</p>
              <p style={{ fontSize: '0.85rem' }}>mreynolds@jones.k12.ga.us</p>
            </div>
          </div>
        </div>

        {/* Middle School Contact */}
        <div style={{ background: 'var(--gold)', padding: '1rem 1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--purple-dark)', margin: 0 }}>🏫 Middle School</h3>
        </div>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>(478) 986-3100</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>Jones County Middle School Main Office</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>Jones County Middle School</p>
              <p>123 Greyhound Drive</p>
              <p>Gray, GA 31032</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon">👤</div>
            <div>
              <h4>Head Coach</h4>
              <p>Coach Angela Brooks</p>
              <p style={{ fontSize: '0.85rem' }}>abrooks@jones.k12.ga.us</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Interested in Joining?</h3>
          <p>
            Cross country is open to all students at Jones County High School and Middle School. No experience necessary!
            Contact the appropriate coach or come to any practice to learn more.
          </p>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Parents & Boosters</h3>
          <p>
            Want to support the team? Join the Jones County Cross Country Booster Club!
            We rely on parent volunteers for meet support, transportation, and fundraising.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
