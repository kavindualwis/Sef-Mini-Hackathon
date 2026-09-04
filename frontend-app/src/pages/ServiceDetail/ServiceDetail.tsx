import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineCheck,
  HiOutlineMail,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import { serviceAPI } from '../../services/api';
import { Footer } from '../../components/Footer';
import { handleImageError } from '../../utils/imageFallback';
import './ServiceDetail.css';

declare global {
  interface Window {
    google: any;
  }
}

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (id) {
      fetchServiceDetails(id);
    }
  }, [id]);

  const fetchServiceDetails = async (serviceId: string) => {
    setLoading(true);
    try {
      const res = await serviceAPI.getById(serviceId);
      setService(res.data);
    } catch (err: any) {
      console.error('Failed to load service details:', err);
      setError('Service not found or has been removed');
    } finally {
      setLoading(false);
    }
  };

  // Render Google Map centered at service location
  useEffect(() => {
    if (!service || !service.location || !mapRef.current || !window.google) return;

    try {
      const coords = { lat: service.location.lat || 6.9271, lng: service.location.lng || 79.8612 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 14,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });

      new window.google.maps.Marker({
        position: coords,
        map: map,
        title: service.title,
      });
    } catch (err) {
      console.error('Map init error in detail view:', err);
    }
  }, [service]);

  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-error">
        <h2>Service Not Found</h2>
        <p>{error || 'The requested service gig could not be located.'}</p>
        <button onClick={() => navigate('/home')}>Return to Home Dashboard</button>
      </div>
    );
  }

  return (
    <div className="service-detail-layout">
      {/* 1. Navbar */}
      <header className="detail-navbar">
        <div className="nav-left">
          <div className="detail-logo" onClick={() => navigate('/home')}>
            Fix<span>Mate</span><span className="logo-dot">.</span>
          </div>
          <button className="btn-back-link" onClick={() => navigate('/home')}>
            <HiOutlineArrowLeft /> Back to Services
          </button>
        </div>

        <div className="nav-right">
          <button className="switch-mode-btn" onClick={() => navigate('/seller')}>
            Switch to Selling
          </button>
        </div>
      </header>

      {/* 2. Main Detail Body */}
      <div className="detail-main-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/home">Home</Link> <span>/</span> <span>{service.category}</span> <span>/</span> <span className="current">{service.title}</span>
        </div>

        <div className="detail-split-grid">
          {/* Left Column: Details */}
          <div className="detail-left-col">
            <h1 className="detail-title">{service.title}</h1>

            {/* Provider Info Row */}
            <div className="detail-provider-header">
              <div className="detail-provider-avatar">
                {service.providerName?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div className="detail-provider-info">
                <h3>{service.providerName}</h3>
                <div className="provider-badges">
                  <span className="pro-badge"><HiOutlineShieldCheck /> {service.badge || 'Verified Provider'}</span>
                  <span className="rating-badge">
                    <HiOutlineStar className="star" /> {service.rating || 5.0} ({service.reviewCount || 1} Review)
                  </span>
                </div>
              </div>
            </div>

            {/* Large Cover Image */}
            <div className="detail-image-box">
              <img
                src={service.coverImage}
                alt={service.title}
                onError={(e) => handleImageError(e, service.category)}
              />
              <div className="category-overlay-tag">{service.category}</div>
            </div>

            {/* Service Highlights */}
            <div className="highlights-row">
              <div className="highlight-item">
                <HiOutlineBriefcase />
                <div>
                  <strong>Experience</strong>
                  <p>{service.experience}</p>
                </div>
              </div>

              <div className="highlight-item">
                <HiOutlineCurrencyDollar />
                <div>
                  <strong>Service Rate</strong>
                  <p>{service.price}</p>
                </div>
              </div>

              <div className="highlight-item">
                <HiOutlineLocationMarker />
                <div>
                  <strong>Location</strong>
                  <p>{service.location?.address || 'Colombo, Sri Lanka'}</p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="detail-section">
              <h2>About This Service</h2>
              <div className="description-text">
                {service.description.split('\n').map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Google Map Section */}
            <div className="detail-section map-section">
              <h2>Service Provider Location</h2>
              <p className="map-subtitle">📍 Pinned location on Google Maps: {service.location?.address}</p>
              
              <div className="detail-google-map" ref={mapRef}></div>
              <div className="map-coords-bar">
                <span>Latitude: {service.location?.lat}</span>
                <span>Longitude: {service.location?.lng}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Box */}
          <div className="detail-right-col">
            <div className="booking-card">
              <div className="card-header">
                <span className="package-title">Standard Service Package</span>
                <div className="card-price">{service.price}</div>
              </div>

              <p className="package-summary">{service.title}</p>

              <ul className="package-features">
                <li><HiOutlineCheck /> Verified Local Service Provider</li>
                <li><HiOutlineCheck /> Flexible Scheduling in Sri Lanka</li>
                <li><HiOutlineCheck /> Includes On-Site Inspection & Quote</li>
                <li><HiOutlineCheck /> Quality & Workmanship Guarantee</li>
              </ul>

              <div className="provider-contact-box">
                <h4>Provider Contact Information</h4>
                <p><HiOutlineMail /> {service.providerEmail}</p>
                <p><HiOutlineLocationMarker /> {service.location?.address}</p>
              </div>

              {bookingSuccess ? (
                <div className="booking-success-message">
                  🎉 Booking request sent successfully! The service provider will contact you shortly.
                </div>
              ) : (
                <button
                  className="btn-order-now"
                  onClick={() => setBookingSuccess(true)}
                >
                  Order / Book Service Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ServiceDetail;
