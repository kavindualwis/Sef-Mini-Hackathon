import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="fixmate-footer">
      <div className="footer-top-container">
        <div className="footer-brand-col">
          <div className="footer-logo">
            Fix<span>Mate</span><span className="logo-dot">.</span> 🇱🇰
          </div>
          <p className="footer-tagline">
            Sri Lanka's trusted service marketplace. Connecting customers with verified, top-rated local professionals for repairs, maintenance, and expert assistance.
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Popular Services</h4>
          <ul>
            <li><Link to="/home">Plumbing Services</Link></li>
            <li><Link to="/home">Electrical Installations</Link></li>
            <li><Link to="/home">Home & Deep Cleaning</Link></li>
            <li><Link to="/home">Painting & Decorating</Link></li>
            <li><Link to="/home">AC Maintenance & Repair</Link></li>
            <li><Link to="/home">IT & Tech Support</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>For Providers & Clients</h4>
          <ul>
            <li><Link to="/seller">Switch to Offering Services</Link></li>
            <li><Link to="/home">Browse All Services</Link></li>
            <li><Link to="/home">How FixMate Works</Link></li>
            <li><Link to="/home">Safety & Verification</Link></li>
            <li><Link to="/home">Help Center / Support</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Contact & Location</h4>
          <p className="footer-contact-info">📍 Colombo & Islandwide Coverage, Sri Lanka</p>
          <p className="footer-contact-info">✉️ support@fixmate.lk</p>
          <p className="footer-contact-info">📞 +94 77 689 2127</p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p>© 2026 FixMate LK. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
