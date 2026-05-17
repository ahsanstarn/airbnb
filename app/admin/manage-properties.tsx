'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import styles from './admin.module.css';

function getToken() {
  return localStorage.getItem('kaya_token');
}

interface Property {
  id: number;
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

export default function ManageProperties() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const checkAdmin = () => {
      const isA = localStorage.getItem('kaya_admin') === 'true';
      if (!isA) {
        router.push('/login');
      } else {
        fetchProperties();
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        setProperties(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const token = getToken();
      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setSuccess('Property deleted successfully!');
        setProperties(prev => prev.filter(p => p.id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      setSuccess('Error deleting property. Please try again.');
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Manage Properties</h1>
        
        {success && (
          <div className={success.includes('success') ? styles.success : styles.error}>
            {success}
          </div>
        )}

        <div className={styles.propertiesGrid}>
          {properties.map((property) => (
            <div key={property.id} className={styles.propertyCard}>
              <div className={styles.propertyHeader}>
                <h3>{property.title}</h3>
                <div className={styles.propertyActions}>
                  <button 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => handleEdit(property.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className={`${styles.btn} ${styles.btnDelete}`}
                    onClick={() => handleDelete(property.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className={styles.propertyDetails}>
                <p><strong>Location:</strong> {property.location}</p>
                <p><strong>Price:</strong> ₾{property.price}/night</p>
                <p><strong>Type:</strong> {property.type}</p>
                <p><strong>Rating:</strong> {property.rating} ⭐</p>
                <p><strong>Contact:</strong> {property.contact_name} ({property.contact_email})</p>
                <p><strong>Phone:</strong> {property.phone}</p>
                <p><strong>Beds:</strong> {property.beds}</p>
                <p><strong>Guests:</strong> {property.guests}</p>
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <strong>Amenities:</strong> {property.amenities.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.formActions}>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => router.push('/admin/add-property')}
          >
            Add New Property
          </button>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => router.push('/admin')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
