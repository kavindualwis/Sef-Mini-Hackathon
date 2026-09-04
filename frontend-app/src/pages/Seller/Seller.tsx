import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineLocationMarker,
  HiOutlineArrowLeft,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import { serviceAPI } from '../../services/api';
import { AddServiceModal } from '../../components/AddServiceModal';
import { Footer } from '../../components/Footer';
import './Seller.css';

export const Seller = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fixmate_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchMyServices(parsed.email);
    } else {
      navigate('/login');
    }
  }, []);

  const fetchMyServices = async (email: string) => {
    setLoading(true);
    try {
      const res = await serviceAPI.getMyServices(email);
      setMyServices(res.data);
    } catch (err) {
      console.error('Failed to fetch user services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service gig?')) return;
    try {
      await serviceAPI.delete(id);
      if (user?.email) fetchMyServices(user.email);
    } catch (err) {
      console.error('Failed to delete service:', err);
      alert('Failed to delete service gig');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fixmate_token');
    localStorage.removeItem('fixmate_user');
    navigate('/');
  };

  return (
    <div className="seller-dashboard-page">
      {/* 1. Header Navigation */}
      <header className="seller-navbar">
        <div className="nav-left">
          <div className="seller-logo" onClick={() => navigate('/home')}>
            Fix<span>Mate</span> <span className="seller-tag">SELLER HUB</span>
          </div>
        </div>

        <div className="nav-right">
          {/* Switch to Buying Button (Navigates to /home) */}
          <button className="switch-to-buying-btn" onClick={() => navigate('/home')}>
            <HiOutlineArrowLeft /> Switch to Buying
          </button>

          <div className="user-avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <button className="btn-small-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* 2. Seller Hero Header */}
      <div className="seller-hero-banner">
        <div className="hero-container">
          <div className="hero-text">
            <h1>Manage Your <span>Service Offerings</span></h1>
            <p>Publish new gigs, update service details, adjust location pins, and manage client requests.</p>
          </div>
          <button
            className="btn-create-gig-hero"
            onClick={() => {
              setEditingService(null);
              setShowModal(true);
            }}
          >
            <HiOutlinePlusCircle /> + Create New Service Gig
          </button>
        </div>
      </div>

      {/* 3. Main Services Content */}
      <main className="seller-main-body">
        <div className="seller-section-title">
          <h2>Your Published Services ({myServices.length})</h2>
          <p>Clients on FixMate can browse and book these services directly</p>
        </div>

        {loading ? (
          <div className="seller-loading-state">Loading your services...</div>
        ) : myServices.length === 0 ? (
          <div className="seller-empty-state">
            <div className="empty-icon"><HiOutlineBriefcase /></div>
            <h3>No Services Published Yet</h3>
            <p>You haven't listed any services as a provider. Add your first service gig now!</p>
            <button
              className="btn-add-first-service"
              onClick={() => {
                setEditingService(null);
                setShowModal(true);
              }}
            >
              + Create Service Gig Now
            </button>
          </div>
        ) : (
          <div className="seller-gigs-grid">
            {myServices.map((service) => (
              <div key={service._id} className="seller-gig-card">
                <div className="seller-card-image">
                  <img src={service.coverImage} alt={service.title} />
                  <span className="category-pill">{service.category}</span>
                </div>

                <div className="seller-card-body">
                  <h3 className="seller-gig-title">{service.title}</h3>
                  <p className="seller-gig-desc">{service.description}</p>

                  <div className="seller-gig-meta">
                    <span><HiOutlineBriefcase /> {service.experience}</span>
                    <span><HiOutlineCurrencyDollar /> {service.price}</span>
                  </div>

                  <div className="seller-gig-location">
                    <HiOutlineLocationMarker /> {service.location?.address || 'Colombo, Sri Lanka'}
                  </div>

                  <div className="seller-card-actions">
                    <button
                      className="btn-edit-gig"
                      onClick={() => {
                        setEditingService(service);
                        setShowModal(true);
                      }}
                    >
                      <HiOutlinePencilAlt /> Edit Details
                    </button>
                    <button
                      className="btn-delete-gig"
                      onClick={() => handleDelete(service._id)}
                    >
                      <HiOutlineTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Add / Edit Service Modal */}
      {showModal && (
        <AddServiceModal
          user={user}
          initialData={editingService}
          onClose={() => {
            setShowModal(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingService(null);
            if (user?.email) fetchMyServices(user.email);
          }}
        />
      )}
    </div>
  );
};

export default Seller;
