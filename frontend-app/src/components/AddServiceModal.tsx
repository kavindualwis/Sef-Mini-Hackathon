import { useState, useEffect, useRef } from 'react';
import { HiX, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineFolder, HiOutlineDocumentText } from 'react-icons/hi';
import { serviceAPI } from '../services/api';
import './AddServiceModal.css';

interface AddServiceModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
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

declare global {
  interface Window {
    google: any;
  }
}

export const AddServiceModal = ({ user, onClose, onSuccess }: AddServiceModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [experience, setExperience] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  // Location state
  const [address, setAddress] = useState('Colombo, Sri Lanka');
  const [lat, setLat] = useState(6.9271);
  const [lng, setLng] = useState(79.8612);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    try {
      const defaultCenter = { lat: 6.9271, lng: 79.8612 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });
      mapInstanceRef.current = map;

      const marker = new window.google.maps.Marker({
        position: defaultCenter,
        map: map,
        draggable: true,
        title: 'Drag to set service location',
      });
      markerRef.current = marker;

      // Update lat/lng on marker drag end
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (pos) {
          const newLat = pos.lat();
          const newLng = pos.lng();
          setLat(newLat);
          setLng(newLng);
          // Reverse geocode
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        }
      });

      // Autocomplete setup if available
      if (autocompleteInputRef.current && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const placeLat = place.geometry.location.lat();
            const placeLng = place.geometry.location.lng();
            setLat(placeLat);
            setLng(placeLng);
            setAddress(place.formatted_address || place.name || '');
            map.setCenter({ lat: placeLat, lng: placeLng });
            map.setZoom(14);
            marker.setPosition({ lat: placeLat, lng: placeLng });
          }
        });
      }
    } catch (err) {
      console.error('Google Maps init error:', err);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !experience.trim() || !price.trim() || !description.trim()) {
      setError('Please fill in all required service details');
      return;
    }

    setLoading(true);
    try {
      await serviceAPI.create({
        userId: user?.id || user?._id,
        providerName: user?.name || 'Verified Provider',
        providerEmail: user?.email || 'provider@fixmate.lk',
        title,
        category,
        experience,
        price,
        description,
        location: {
          address: address || 'Colombo, Sri Lanka',
          lat,
          lng,
          city: address.split(',').slice(-2, -1)[0]?.trim() || 'Colombo',
        },
      });

      onSuccess();
    } catch (err: any) {
      console.error('Failed to create service:', err);
      setError(err.response?.data?.message || 'Failed to submit service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="add-service-modal-card">
        <button className="modal-close-btn" onClick={onClose}><HiX /></button>

        <div className="modal-top-header">
          <h2>Create New Service Gig</h2>
          <p>Provide details about your expertise to start receiving clients on FixMate</p>
        </div>

        {error && <div className="modal-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="add-service-form">
          <div className="form-grid-row">
            {/* Category */}
            <div className="form-field">
              <label><HiOutlineFolder /> Select Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="form-field">
              <label><HiOutlineBriefcase /> Experience (e.g., 3 Years) *</label>
              <input
                type="text"
                placeholder="e.g. 5+ Years Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>

          {/* Service Title */}
          <div className="form-field">
            <label><HiOutlineDocumentText /> Service Title *</label>
            <input
              type="text"
              placeholder="e.g. I will repair plumbing fixtures & install pipes professionally"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Pricing */}
          <div className="form-field">
            <label><HiOutlineCurrencyDollar /> Starting Price or Hourly Rate *</label>
            <input
              type="text"
              placeholder="e.g. $50 / hr or Starting at $100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label><HiOutlineDocumentText /> Detailed Service Description *</label>
            <textarea
              rows={4}
              placeholder="Describe your service scope, tools used, guarantees, and availability..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Location setup with Google Maps */}
          <div className="form-field location-section">
            <label><HiOutlineLocationMarker /> Service Location & Google Map Setup *</label>
            <p className="field-hint">Search address or drag the pin on the map to mark your coverage location</p>
            
            <input
              ref={autocompleteInputRef}
              type="text"
              className="location-search-input"
              placeholder="Search city or address in Sri Lanka..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="google-map-container" ref={mapRef}></div>
            <div className="location-coords">
              <span>📍 Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
              <span className="location-address-tag">{address}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-publish" disabled={loading}>
              {loading ? 'Publishing Service...' : 'Publish Service Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
