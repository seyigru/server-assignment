'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DeleteAppliance() {
  const [serialNumber, setSerialNumber] = useState('');
  const [appliance, setAppliance] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('search'); // 'search' or 'confirm'
  const [deletedItems, setDeletedItems] = useState([]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAppliance(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/appliances?serial=${serialNumber}`);
      const data = await response.json();

      if (response.ok && data.length > 0) {
        setAppliance(data[0]);
        setStep('confirm');
      } else {
        setMessage('No matching appliance found!');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/appliances', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serialNumber: appliance.SerialNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Appliance deleted successfully.');
        
        // Add to recently deleted list
        const deletedEntry = {
          type: appliance.ApplianceType,
          brand: appliance.Brand,
          serial: appliance.SerialNumber,
          owner: `${appliance.FirstName} ${appliance.LastName}`,
          deletedAt: new Date().toLocaleString()
        };
        setDeletedItems([deletedEntry, ...deletedItems]);
        
        setTimeout(() => {
          setSerialNumber('');
          setAppliance(null);
          setStep('search');
          setMessage('');
        }, 2000);
      } else {
        setMessage(`Error: ${data.message || 'Failed to delete appliance'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSerialNumber('');
    setAppliance(null);
    setMessage('');
    setStep('search');
  };

  return (
    <div>
      {step === 'search' && (
        <div className="form-container">
          <h1>Delete Appliance</h1>
          
          <form onSubmit={handleSearchSubmit}>
            <div className="form-group">
              <label>Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="0000-0000-0000"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {message && (
            <div className="message error">
              <strong>⚠️ {message}</strong>
              <br />
              <Link href="/" style={{ color: 'var(--error)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
                Back to Home
              </Link>
            </div>
          )}

          {deletedItems.length > 0 && (
            <div className="deleted-items">
              <h3>Recently Deleted</h3>
              {deletedItems.map((item, index) => (
                <div key={index} className="deleted-item">
                  <strong>{item.type}</strong> - {item.brand} (Serial: {item.serial})
                  <br />
                  <span style={{ fontSize: '0.85rem' }}>
                    Owner: {item.owner} | Deleted: {item.deletedAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'confirm' && appliance && (
        <div className="form-container">
          <h1>Delete Appliance</h1>
          
          <div className="delete-warning">
            <strong>⚠️ This action cannot be undone!</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              You are about to permanently delete this appliance record from the system.
            </p>
          </div>

          <div style={{
            background: 'rgba(78, 204, 163, 0.1)',
            border: '1px solid var(--success)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '1rem' }}>
              Owner Information
            </strong>
            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <strong>{appliance.FirstName} {appliance.LastName}</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Email: {appliance.Email}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Address: {appliance.Address} - {appliance.Eircode}
            </p>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '1rem' }}>
              Appliance Details
            </strong>
            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <strong>{appliance.ApplianceType}</strong> - {appliance.Brand}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Model: {appliance.ModelNumber}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Serial: {appliance.SerialNumber}
            </p>
          </div>

          <form onSubmit={handleDeleteSubmit}>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ background: 'var(--error)' }}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Yes, Delete Appliance'}
            </button>

            <button 
              type="button"
              onClick={handleCancel}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', background: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              <strong>{message.includes('Error') ? '⚠️' : '✓'} {message}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}