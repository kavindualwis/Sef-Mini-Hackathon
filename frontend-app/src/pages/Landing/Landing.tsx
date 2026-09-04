import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiX,
} from 'react-icons/hi';
import { authAPI } from '../../services/api';
import './Landing.css';

// Service categories
const categories = [
  { icon: '🔧', name: 'Plumbing', desc: 'Pipe & fixture repairs' },
  { icon: '⚡', name: 'Electrical', desc: 'Wiring & installations' },
  { icon: '🏠', name: 'Home Cleaning', desc: 'Deep & regular cleaning' },
  { icon: '🎨', name: 'Painting', desc: 'Interior & exterior work' },
  { icon: '❄️', name: 'AC Repair', desc: 'Service & maintenance' },
  { icon: '🚗', name: 'Vehicle Service', desc: 'Auto repair & detailing' },
  { icon: '📱', name: 'Tech Support', desc: 'Device & IT assistance' },
  { icon: '🪚', name: 'Carpentry', desc: 'Furniture & woodwork' },
];

// Wrench icon SVG used in brand logos
const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

interface LandingProps {
  authModal: 'login' | 'register' | null;
  setAuthModal: (modal: 'login' | 'register' | null) => void;
}

const Landing = ({ authModal, setAuthModal }: LandingProps) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Track scroll for navbar style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Check login state
  useEffect(() => {
    const stored = localStorage.getItem('fixmate_user');
    if (stored) setUser(JSON.parse(stored));
  }, [authModal]);

  const handleLogout = () => {
    localStorage.removeItem('fixmate_token');
    localStorage.removeItem('fixmate_user');
    setUser(null);
  };

  // Close modal on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAuthModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setAuthModal]);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <div className="nav-logo"><WrenchIcon /></div>
          <h2>Fix<span>Mate</span></h2>
        </div>
        <div className="nav-links">
          {user ? (
            <div className="nav-user-info">
              <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="nav-greeting">Hi, <strong>{user.name?.split(' ')[0]}</strong></span>
              <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="nav-btn nav-btn-ghost" onClick={() => setAuthModal('login')}>Sign In</button>
              <button className="nav-btn nav-btn-primary" onClick={() => setAuthModal('register')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80&auto=format&fit=crop"
            alt="Professional service worker"
            loading="eager"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Sri Lanka's Service Marketplace
          </div>
          <h1>
            Quality Services<br />
            At Your <span className="gradient-text">Doorstep</span>
          </h1>
          <p className="hero-subtitle">
            Connect with verified professionals across Sri Lanka.
            From home repairs to tech support — get it done right with FixMate.
          </p>
          {!user ? (
            <div className="hero-cta">
              <button className="btn-hero-primary" onClick={() => setAuthModal('register')}>
                Get Started Free →
              </button>
              <button className="btn-hero-secondary" onClick={() => setAuthModal('login')}>
                Sign In
              </button>
            </div>
          ) : (
            <div className="hero-cta">
              <button className="btn-hero-primary">Browse Services →</button>
            </div>
          )}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">2,500+</div>
              <div className="hero-stat-label">Service Providers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">15K+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">25+</div>
              <div className="hero-stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <span className="section-tag">Services</span>
          <h2>What Do You Need?</h2>
          <p>Browse through our wide range of professional services available near you</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.name} className="cat-card">
              <span className="cat-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2>Simple & Easy</h2>
          <p>Get professional help in just 3 simple steps</p>
        </div>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds with your email and phone number. Quick verification keeps everyone safe.</p>
          </div>
          <div className="how-step">
            <div className="how-step-number">2</div>
            <h3>Find a Service</h3>
            <p>Browse categories or search for the specific service you need. Compare providers and ratings.</p>
          </div>
          <div className="how-step">
            <div className="how-step-number">3</div>
            <h3>Book & Relax</h3>
            <p>Book your preferred provider and track the service in real-time. Pay securely after completion.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {!user && (
        <section className="cta-banner">
          <div className="cta-inner">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of Sri Lankans who trust FixMate for their service needs</p>
            <button className="btn-cta-white" onClick={() => setAuthModal('register')}>Create Free Account</button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">
          Fix<span>Mate</span> 🇱🇰
        </div>
        <p>© 2026 FixMate LK. All rights reserved.</p>
      </footer>

      {/* Auth Modals */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(mode) => setAuthModal(mode)}
          onVerify={(email, name) => {
            setAuthModal(null);
            navigate('/verify', { state: { email, name } });
          }}
          onLoginSuccess={(userData) => {
            setUser(userData);
            setAuthModal(null);
            navigate('/home');
          }}
        />
      )}
    </div>
  );
};

// Auth Modal Component
interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
  onVerify: (email: string, name: string) => void;
  onLoginSuccess: (user: any) => void;
}

const AuthModal = ({ mode, onClose, onSwitch, onVerify, onLoginSuccess }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register form state
  const [regData, setRegData] = useState({ name: '', email: '', phone: '', password: '' });
  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regData.name || !regData.email || !regData.phone || !regData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register(regData);
      onVerify(regData.email, regData.name);
    } catch (err: any) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to server. Ensure backend is running on port 5001' : err.message) || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.login(loginData);
      localStorage.setItem('fixmate_token', response.data.token);
      localStorage.setItem('fixmate_user', JSON.stringify(response.data.user));
      onLoginSuccess(response.data.user);
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.response?.data?.needsVerification) {
        onVerify(err.response.data.email, '');
        return;
      }
      const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to server. Ensure backend is running on port 5001' : err.message) || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}><HiX /></button>

        <div className="modal-header">
          <div className="modal-logo"><WrenchIcon /></div>
          <h2>{mode === 'register' ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{mode === 'register' ? 'Join FixMate and find services near you' : 'Sign in to your FixMate account'}</p>
        </div>

        {error && <div className="alert alert-error"><span>⚠</span><span>{error}</span></div>}

        {mode === 'register' ? (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-wrapper">
                <input id="reg-name" name="name" type="text" placeholder="Enter your full name" value={regData.name} onChange={handleRegChange} autoComplete="name" />
                <HiOutlineUser className="input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-wrapper">
                <input id="reg-email" name="email" type="email" placeholder="you@example.com" value={regData.email} onChange={handleRegChange} autoComplete="email" />
                <HiOutlineMail className="input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <div className="phone-input-row">
                <span className="phone-prefix">🇱🇰 +94</span>
                <div className="input-wrapper">
                  <input id="reg-phone" name="phone" type="tel" placeholder="7X XXX XXXX" value={regData.phone} onChange={handleRegChange} autoComplete="tel" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={regData.password} onChange={handleRegChange} autoComplete="new-password" />
                <HiOutlineLockClosed className="input-icon" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="btn-loading"><span className="spinner" />Creating Account...</span> : 'Create Account'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <input id="login-email" name="email" type="email" placeholder="you@example.com" value={loginData.email} onChange={handleLoginChange} autoComplete="email" />
                <HiOutlineMail className="input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={loginData.password} onChange={handleLoginChange} autoComplete="current-password" />
                <HiOutlineLockClosed className="input-icon" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="btn-loading"><span className="spinner" />Signing in...</span> : 'Sign In'}
            </button>
          </form>
        )}

        <div className="modal-footer">
          {mode === 'register' ? (
            <>Already have an account? <button onClick={() => { onSwitch('login'); setError(''); }}>Sign in</button></>
          ) : (
            <>Don't have an account? <button onClick={() => { onSwitch('register'); setError(''); }}>Create one</button></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
