import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

// Service categories for Sri Lanka market
const categories = [
  { icon: '🔧', name: 'Plumbing', desc: 'Pipe & fixture repairs' },
  { icon: '⚡', name: 'Electrical', desc: 'Wiring & installations' },
  { icon: '🏠', name: 'Home Cleaning', desc: 'Deep & regular cleaning' },
  { icon: '🎨', name: 'Painting', desc: 'Interior & exterior' },
  { icon: '❄️', name: 'AC Repair', desc: 'Service & maintenance' },
  { icon: '🚗', name: 'Vehicle Service', desc: 'Auto repair & detailing' },
  { icon: '📱', name: 'Tech Support', desc: 'Device & IT help' },
  { icon: '🪚', name: 'Carpentry', desc: 'Furniture & woodwork' },
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fixmate_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fixmate_token');
    localStorage.removeItem('fixmate_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h2>Fix<span>Mate</span></h2>
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <span className="navbar-greeting">Hello, <strong>{user.name}</strong></span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-cta-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>Sign In</Link>
              <Link to="/register" className="btn-cta-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <h1>
          Find Trusted Services<br />
          Across <span className="highlight">Sri Lanka</span>
        </h1>
        <p>
          Connect with skilled service providers near you. From home repairs to tech support —
          FixMate brings quality services to your doorstep.
        </p>
        {!user && (
          <div className="home-cta">
            <Link to="/register" className="btn-cta-primary">Create Account →</Link>
            <Link to="/login" className="btn-cta-secondary">Sign In</Link>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="home-categories">
        <h2>Browse Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.name} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
