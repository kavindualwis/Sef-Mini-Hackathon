import { useState, useEffect, useRef } from 'react';
import {
  HiX,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { serviceAPI } from '../services/api';
import './AddServiceModal.css';

interface AddServiceModalProps {
  user: any;
  initialData?: any;
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

export const AddServiceModal = ({ user, initialData, onClose, onSuccess }: AddServiceModalProps) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [experience, setExperience] = useState(initialData?.experience || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Location state
  const [address, setAddress] = useState(initialData?.location?.address || 'Colombo, Sri Lanka');
  const [lat, setLat] = useState(initialData?.location?.lat || 6.9271);
  const [lng, setLng] = useState(initialData?.location?.lng || 79.8612);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'category':
        if (!value || !CATEGORIES.includes(value)) {
          return 'Please select a valid category';
        }
        break;
      case 'title':
        if (!value.trim()) {
          return 'Service title is required';
        }
        if (value.trim().length < 5) {
          return 'Title must be at least 5 characters long';
        }
        if (value.trim().length > 100) {
          return 'Title cannot exceed 100 characters';
        }
        break;
      case 'experience':
        if (!value.trim()) {
          return 'Experience is required';
        }
        if (value.trim().length < 2) {
          return 'Please enter valid experience (e.g. 3+ Years)';
        }
        break;
      case 'price':
        if (!value.trim()) {
          return 'Starting price or rate is required';
        }
        if (!/\d/.test(value)) {
          return 'Price must include an amount (e.g. Rs. 2,500 or Rs. 50/hr)';
        }
        break;
      case 'description':
        if (!value.trim()) {
          return 'Detailed service description is required';
        }
        if (value.trim().length < 20) {
          return `Description is too short (${value.trim().length}/20 min characters)`;
        }
        if (value.trim().length > 2000) {
          return 'Description cannot exceed 2000 characters';
        }
        break;
      case 'address':
        if (!value.trim()) {
          return 'Please specify a service location';
        }
        break;
      default:
        break;
    }
    return '';
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (field: string, value: string, setter: (val: string) => void) => {
    setter(value);
    if (touched[field] || fieldErrors[field]) {
      const errorMsg = validateField(field, value);
      setFieldErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimerRef = useRef<any>(null);

  // Perform real-time geocode search as user types
  const handleRealtimeGeocode = (searchQuery: string) => {
    setAddress(searchQuery);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!window.google || !mapInstanceRef.current || !markerRef.current || !searchQuery.trim()) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const placeLat = results[0].geometry.location.lat();
          const placeLng = results[0].geometry.location.lng();
          setLat(placeLat);
          setLng(placeLng);

          mapInstanceRef.current.setCenter({ lat: placeLat, lng: placeLng });
          mapInstanceRef.current.setZoom(13);
          markerRef.current.setPosition({ lat: placeLat, lng: placeLng });
        }
      });
    }, 400);
  };

  // Initialize Google Maps
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    try {
      const initialCenter = { lat: lat || 6.9271, lng: lng || 79.8612 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 13,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });
      mapInstanceRef.current = map;

      const marker = new window.google.maps.Marker({
        position: initialCenter,
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
      if (autocompleteInputRef.current && window.google && window.google.maps && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
          fields: ['formatted_address', 'geometry', 'name'],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.geometry && place.geometry.location) {
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

    // Run full validation across all fields
    const errors: Record<string, string> = {
      category: validateField('category', category),
      title: validateField('title', title),
      experience: validateField('experience', experience),
      price: validateField('price', price),
      description: validateField('description', description),
      address: validateField('address', address),
    };

    const activeErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors)) {
      if (v) activeErrors[k] = v;
    }

    if (Object.keys(activeErrors).length > 0) {
      setFieldErrors(activeErrors);
      setTouched({
        category: true,
        title: true,
        experience: true,
        price: true,
        description: true,
        address: true,
      });
      setError('Please resolve the highlighted errors below before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: user?.id || user?._id,
        providerName: user?.name || 'Verified Provider',
        providerEmail: user?.email || 'provider@fixmate.lk',
        title: title.trim(),
        category,
        experience: experience.trim(),
        price: price.trim(),
        description: description.trim(),
        location: {
          address: address.trim() || 'Colombo, Sri Lanka',
          lat,
          lng,
          city: address.split(',').slice(-2, -1)[0]?.trim() || 'Colombo',
        },
      };

      if (isEditing) {
        await serviceAPI.update(initialData._id, payload);
      } else {
        await serviceAPI.create(payload);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Failed to save service:', err);
      setError(err.response?.data?.message || 'Failed to save service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="add-service-modal-card">
        <button className="modal-close-btn" onClick={onClose}><HiX /></button>

        <div className="modal-top-header">
          <h2>{isEditing ? 'Edit Service Gig' : 'Create New Service Gig'}</h2>
          <p>{isEditing ? 'Update your service details and location' : 'Provide details about your expertise to start receiving clients on FixMate'}</p>
        </div>

        {error && (
          <div className="modal-error-banner">
            <HiOutlineExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-service-form" noValidate>
          <div className="form-grid-row">
            {/* Category */}
            <div className={`form-field ${touched.category && fieldErrors.category ? 'has-error' : ''}`}>
              <label>
                <HiOutlineFolder /> Select Category <span className="required-star">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleChange('category', e.target.value, setCategory)}
                onBlur={() => handleBlur('category', category)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {touched.category && fieldErrors.category && (
                <span className="field-error-msg">
                  <HiOutlineExclamationCircle /> {fieldErrors.category}
                </span>
              )}
            </div>

            {/* Experience */}
            <div className={`form-field ${touched.experience && fieldErrors.experience ? 'has-error' : ''}`}>
              <label>
                <HiOutlineBriefcase /> Experience <span className="required-star">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5+ Years Experience"
                value={experience}
                onChange={(e) => handleChange('experience', e.target.value, setExperience)}
                onBlur={() => handleBlur('experience', experience)}
              />
              {touched.experience && fieldErrors.experience && (
                <span className="field-error-msg">
                  <HiOutlineExclamationCircle /> {fieldErrors.experience}
                </span>
              )}
            </div>
          </div>

          {/* Service Title */}
          <div className={`form-field ${touched.title && fieldErrors.title ? 'has-error' : ''}`}>
            <div className="field-label-row">
              <label>
                <HiOutlineDocumentText /> Service Title <span className="required-star">*</span>
              </label>
              <span className={`char-counter ${title.length > 90 ? (title.length > 100 ? 'at-limit' : 'near-limit') : ''}`}>
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. I will repair plumbing fixtures & install pipes professionally"
              value={title}
              maxLength={120}
              onChange={(e) => handleChange('title', e.target.value, setTitle)}
              onBlur={() => handleBlur('title', title)}
            />
            {touched.title && fieldErrors.title && (
              <span className="field-error-msg">
                <HiOutlineExclamationCircle /> {fieldErrors.title}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className={`form-field ${touched.price && fieldErrors.price ? 'has-error' : ''}`}>
            <label>
              <HiOutlineCurrencyRupee /> Starting Price or Hourly Rate <span className="required-star">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rs. 50 / hr or Starting at Rs. 100"
              value={price}
              onChange={(e) => handleChange('price', e.target.value, setPrice)}
              onBlur={() => handleBlur('price', price)}
            />
            {touched.price && fieldErrors.price && (
              <span className="field-error-msg">
                <HiOutlineExclamationCircle /> {fieldErrors.price}
              </span>
            )}
          </div>

          {/* Description */}
          <div className={`form-field ${touched.description && fieldErrors.description ? 'has-error' : ''}`}>
            <div className="field-label-row">
              <label>
                <HiOutlineDocumentText /> Detailed Service Description <span className="required-star">*</span>
              </label>
              <span className={`char-counter ${description.length > 0 && description.length < 20 ? 'too-short' : (description.length > 1900 ? 'at-limit' : '')}`}>
                {description.length}/2000 (min 20)
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Describe your service scope, tools used, guarantees, and availability (minimum 20 characters)..."
              value={description}
              maxLength={2200}
              onChange={(e) => handleChange('description', e.target.value, setDescription)}
              onBlur={() => handleBlur('description', description)}
            />
            {touched.description && fieldErrors.description && (
              <span className="field-error-msg">
                <HiOutlineExclamationCircle /> {fieldErrors.description}
              </span>
            )}
          </div>

          {/* Location setup with Google Maps */}
          <div className={`form-field location-section ${touched.address && fieldErrors.address ? 'has-error' : ''}`}>
            <label>
              <HiOutlineLocationMarker /> Service Location (Real-time Google Map Search) <span className="required-star">*</span>
            </label>
            <p className="field-hint">Type city/address to update map location in real-time or drag pin on map</p>
            
            <input
              ref={autocompleteInputRef}
              type="text"
              className="location-search-input"
              placeholder="Type city or location in Sri Lanka (e.g. Kandy, Galle, Colombo)..."
              value={address}
              onChange={(e) => {
                handleRealtimeGeocode(e.target.value);
                handleChange('address', e.target.value, setAddress);
              }}
              onBlur={() => handleBlur('address', address)}
            />
            {touched.address && fieldErrors.address && (
              <span className="field-error-msg">
                <HiOutlineExclamationCircle /> {fieldErrors.address}
              </span>
            )}

            <div className="google-map-container" ref={mapRef}></div>
            <div className="location-coords">
              <span>📍 Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
              <span className="location-address-tag">{address}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-publish" disabled={loading}>
              {loading ? (isEditing ? 'Saving Changes...' : 'Publishing Service...') : (isEditing ? 'Save Changes' : 'Publish Service Gig')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
