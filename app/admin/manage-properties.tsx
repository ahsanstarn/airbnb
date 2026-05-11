'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import styles from './admin.module.css';

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
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSuccess('Property deleted successfully!');
      setProperties(prev => prev.filter(p => p.id !== id));
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
