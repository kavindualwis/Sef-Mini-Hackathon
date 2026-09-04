import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineMail,
  HiOutlineHeart,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlinePlusCircle,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import { serviceAPI } from '../../services/api';
import { AddServiceModal } from '../../components/AddServiceModal';
import './Home.css';

const CATEGORIES = [
  'Trending 🔥',
  'Plumbing',
  'Electrical',
  'Home Cleaning',
  'Painting',
  'AC Repair',
  'Vehicle Service',
  'Tech Support',
  'Carpentry',
  'Gardening',
  'Roofing',
  'Pest Control',
  'Appliance Repair',
  'Other',
];

export const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('Trending 🔥');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'buying' | 'selling'>('buying');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('fixmate_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const catParam = activeCategory.includes('Trending') ? undefined : activeCategory;
      const res = await serviceAPI.getAll({ category: catParam, search: searchQuery });
      setServices(res.data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleLogout = () => {
    localStorage.removeItem('fixmate_token');
    localStorage.removeItem('fixmate_user');
    navigate('/');
  };

  return (
    <div className="fiverr-home-layout">
      {/* 1. Main Header Navigation */}
      <header className="fiverr-navbar">
        <div className="nav-left">
          <div className="fiverr-logo" onClick={() => navigate('/home')}>
            Fix<span>Mate</span><span className="logo-dot">.</span>
          </div>

          <form className="fiverr-search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <HiOutlineSearch />
            </button>
          </form>
        </div>

        <div className="nav-right">
          <button className="icon-nav-btn" title="Notifications"><HiOutlineBell /></button>
          <button className="icon-nav-btn" title="Messages"><HiOutlineMail /></button>
          <button className="icon-nav-btn" title="Saved Favorites"><HiOutlineHeart /></button>
          <span className="nav-text-link">Orders</span>

          {/* Mode Switch Button (Switch to Selling / Offering Services) */}
          <button
            className={`switch-mode-btn ${mode === 'selling' ? 'active-selling' : ''}`}
            onClick={() => {
              if (mode === 'buying') {
                setMode('selling');
                setShowAddModal(true);
              } else {
                setMode('buying');
              }
            }}
          >
            {mode === 'buying' ? 'Switch to Selling' : 'Switch to Buying'}
          </button>

          <div className="user-profile-menu">
            <div className="user-avatar-circle">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button className="btn-small-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* 2. Sub Category Bar */}
      <nav className="fiverr-category-bar">
        <div className="category-scroll-container">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* 3. Main Dashboard Banner */}
      <main className="fiverr-content-body">
        <div className="welcome-banner">
          <h1>Welcome back, <span>{user?.name || 'Kavindu Alwis'}</span></h1>

          <div className="progress-cards-grid">
            {/* Card 1 */}
            <div className="fiverr-card">
              <div className="card-badge">RECOMMENDED FOR YOU</div>
              <div className="card-body-content">
                <div className="card-icon-box">
                  <HiOutlineDocumentText />
                </div>
                <div className="card-text-details">
                  <h3>Post a project brief</h3>
                  <p>Get tailored offers from verified service providers for your needs.</p>
                </div>
                <button className="card-action-btn" onClick={() => setShowAddModal(true)}>
                  Get started
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="fiverr-card">
              <div className="card-badge">PROFILE PROGRESS</div>
              <div className="card-body-content">
                <div className="card-icon-box">
                  <HiOutlineBriefcase />
                </div>
                <div className="card-text-details">
                  <h3>Offer a New Service</h3>
                  <p>Publish your service gig to start receiving customer orders.</p>
                </div>
                <button className="card-action-btn primary" onClick={() => setShowAddModal(true)}>
                  + Add Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Service Listings Section */}
        <section className="service-listings-section">
          <div className="section-header-row">
            <h2>Based on what you might be looking for</h2>
            <button className="btn-add-service-shortcut" onClick={() => setShowAddModal(true)}>
              <HiOutlinePlusCircle /> Create Service Gig
            </button>
          </div>

          <div className="services-layout-split">
            {/* Sidebar sub-filters */}
            <aside className="sidebar-filter-menu">
              <button className="sidebar-tab active"><HiOutlineSparkles /> Keep exploring</button>
              {CATEGORIES.slice(1, 6).map((cat) => (
                <button
                  key={cat}
                  className={`sidebar-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </aside>

            {/* Service Cards Grid */}
            <div className="gigs-grid">
              {loading ? (
                <div className="loading-gigs">Loading available services...</div>
              ) : services.length === 0 ? (
                <div className="empty-gigs-box">
                  <h3>No services added in "{activeCategory}" yet</h3>
                  <p>Be the first to offer a service in this category!</p>
                  <button className="btn-create-first" onClick={() => setShowAddModal(true)}>
                    + Post Service Gig
                  </button>
                </div>
              ) : (
                services.map((gig) => (
                  <div key={gig._id} className="gig-card">
                    <div className="gig-image-wrap">
                      <img src={gig.coverImage} alt={gig.title} />
                      <button className="gig-heart-btn"><HiOutlineHeart /></button>
                    </div>

                    <div className="gig-card-info">
                      <div className="provider-row">
                        <div className="provider-avatar">
                          {gig.providerName?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div className="provider-meta">
                          <span className="provider-name">{gig.providerName}</span>
                          <span className="provider-badge">{gig.badge || 'Pro Provider'}</span>
                        </div>
                      </div>

                      <h4 className="gig-title">{gig.title}</h4>

                      <div className="gig-location-tag">
                        <HiOutlineLocationMarker /> {gig.location?.address || 'Colombo, Sri Lanka'}
                      </div>

                      <div className="gig-rating-row">
                        <span className="star-icon"><HiOutlineStar /></span>
                        <span className="rating-score">{gig.rating || 5.0}</span>
                        <span className="review-count">({gig.reviewCount || 1})</span>
                        <span className="experience-tag">{gig.experience}</span>
                      </div>

                      <div className="gig-card-footer">
                        <span className="price-label">STARTING AT</span>
                        <span className="price-value">{gig.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Add Service Modal Component */}
      {showAddModal && (
        <AddServiceModal
          user={user}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchServices();
          }}
        />
      )}
    </div>
  );
};

export default Home;
