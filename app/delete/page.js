'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DeleteAppliance() {
  const [serialNumber, setSerialNumber] = useState('');
  const [appliance, setAppliance] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('search'); // 'search' or 'confirm'

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
        </div>
      )}

      {step === 'confirm' && appliance && (
        <div className="form-container">
          <h1>Delete Appliance</h1>
          <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            ⚠️ This action cannot be undone!
          </p>

          <div style={{
            background: 'rgba(233, 69, 96, 0.1)',
            border: '2px solid var(--error)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Are you sure you want to delete this appliance?</strong>
            <br />
            <br />
            <strong>Appliance Details:</strong>
            <br />
            Type: {appliance.ApplianceType}
            <br />
            Brand: {appliance.Brand}
            <br />
            Model: {appliance.ModelNumber}
            <br />
            Serial: {appliance.SerialNumber}
            <br />
            Owner: {appliance.FirstName} {appliance.LastName}
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