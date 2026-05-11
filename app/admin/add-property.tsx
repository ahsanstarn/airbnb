'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import styles from './admin.module.css';

interface Property {
  id?: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  type: 'Hotel' | 'Apartment' | 'Villa' | 'Guesthouse' | 'Lodge' | 'Unique';
  phone: string;
  contact_email: string;
  contact_name: string;
  description: string;
  amenities: string[];
  images: string[];
  beds: number;
  guests: number;
  lat: number;
  lng: number;
}

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<Property>({
    title: '',
    location: '',
    price: 0,
    rating: 0,
    type: 'Hotel',
    phone: '',
    contact_email: '',
    contact_name: '',
    description: '',
    amenities: [],
    images: [],
    beds: 1,
    guests: 2,
    lat: 41.7151,
    lng: 44.8271
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([{
          ...formData,
          img: formData.images[0] || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop'
        }])
        .select();

      if (error) {
        throw error;
      }

      setSuccess('Property added successfully!');
      setFormData({
        title: '',
        location: '',
        price: 0,
        rating: 0,
        type: 'Hotel',
        phone: '',
        contact_email: '',
        contact_name: '',
        description: '',
        amenities: [],
        images: [],
        beds: 1,
        guests: 2,
        lat: 41.7151,
        lng: 44.8271
      });
    } catch (error) {
      setSuccess('Error adding property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...formData.amenities];
    if (value) {
      newAmenities[index] = value;
    } else {
      newAmenities.splice(index, 1);
    }
    setFormData(prev => ({ ...prev, amenities: newAmenities }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    if (value) {
      newImages[index] = value;
    } else {
      newImages.splice(index, 1);
    }
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Add New Property</h1>
        
        {success && (
          <div className={success.includes('success') ? styles.success : styles.error}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.propertyForm}>
          <div className={styles.formGrid}>
            {/* Basic Information */}
            <div className={styles.formSection}>
              <h3>Basic Information</h3>
              <div className={styles.formRow}>
                <label>Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Enter property title"
                />
              </div>
              <div className={styles.formRow}>
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className={styles.input}
                  placeholder="City, Region, Country"
                />
              </div>
              <div className={styles.formRow}>
                <label>Price per Night (₾)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  required
                  className={styles.input}
                  placeholder="100"
                />
              </div>
              <div className={styles.formRow}>
                <label>Property Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={styles.select}
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Guesthouse">Guesthouse</option>
                  <option value="Lodge">Lodge</option>
                  <option value="Unique">Unique</option>
                </select>
              </div>
              <div className={styles.formRow}>
                <label>Rating</label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                  min="1"
                  max="5"
                  step="0.1"
                  className={styles.input}
                  placeholder="4.5"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles.formSection}>
              <h3>Contact Information</h3>
              <div className={styles.formRow}>
                <label>Contact Name</label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange('contact_name', e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Property manager name"
                />
              </div>
              <div className={styles.formRow}>
                <label>Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  required
                  className={styles.input}
                  placeholder="contact@property.com"
                />
              </div>
              <div className={styles.formRow}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className={styles.input}
                  placeholder="+995 555 12 34"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className={styles.formSection}>
              <h3>Property Details</h3>
              <div className={styles.formRow}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  className={styles.textarea}
                  rows={4}
                  placeholder="Describe the property, amenities, and nearby attractions..."
                />
              </div>
              <div className={styles.formRow}>
                <label>Number of Beds</label>
                <input
                  type="number"
                  value={formData.beds}
                  onChange={(e) => handleInputChange('beds', Number(e.target.value))}
                  min="1"
                  className={styles.input}
                  placeholder="2"
                />
              </div>
              <div className={styles.formRow}>
                <label>Max Guests</label>
                <input
                  type="number"
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                  min="1"
                  className={styles.input}
                  placeholder="4"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className={styles.formSection}>
              <h3>Amenities</h3>
              <div className={styles.amenitiesGrid}>
                {['WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Pet Friendly', 'Air Conditioning', 'Kitchen'].map((amenity, index) => (
                  <label key={amenity} className={styles.amenityLabel}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => handleAmenityChange(index, e.target.checked ? amenity : '')}
                      className={styles.checkbox}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className={styles.formSection}>
              <h3>Property Images</h3>
              <div className={styles.imagesGrid}>
                {[0, 1, 2].map((index) => (
                  <div key={index} className={styles.imageInput}>
                    <label>Image URL {index + 1}</label>
                    <input
                      type="url"
                      value={formData.images[index] || ''}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className={styles.input}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Location Coordinates */}
            <div className={styles.formSection}>
              <h3>Location Coordinates</h3>
              <div className={styles.formRow}>
                <label>Latitude</label>
                <input
                  type="number"
                  value={formData.lat}
                  onChange={(e) => handleInputChange('lat', Number(e.target.value))}
                  step="0.0001"
                  className={styles.input}
                  placeholder="41.7151"
                />
              </div>
              <div className={styles.formRow}>
                <label>Longitude</label>
                <input
                  type="number"
                  value={formData.lng}
                  onChange={(e) => handleInputChange('lng', Number(e.target.value))}
                  step="0.0001"
                  className={styles.input}
                  placeholder="44.8271"
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={loading}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              {loading ? 'Adding Property...' : 'Add Property'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
