'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchAppliance() {
  const [serialNumber, setSerialNumber] = useState('');
  const [appliance, setAppliance] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAppliance(null);
    setLoading(true);
    setExpandedDetails(false);

    try {
      const response = await fetch(`/api/appliances?serial=${serialNumber}`);
      const data = await response.json();

      if (response.ok && data.length > 0) {
        setAppliance(data[0]);
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

  const handleSearchAgain = () => {
    setSerialNumber('');
    setAppliance(null);
    setMessage('');
    setExpandedDetails(false);
  };

  return (
    <div>
      
      {!appliance && !message && (
        <div className="form-container">
          <h1>Search Appliance</h1>
          
          <form onSubmit={handleSubmit}>
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
        </div>
      )}

      {message && (
        <div className="form-container">
          <div className="message error">
            <strong>⚠️ {message}</strong>
            <br />
            <br />
            <button 
              onClick={handleSearchAgain}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Search Another Appliance
            </button>
            <br />
            <Link href="/" style={{ color: 'var(--error)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {appliance && (
        <div className="form-container">
          <h1>Search Results</h1>
          
          <div className="search-result-card">
            <div className="result-header">
              <strong>{appliance.ApplianceType}</strong>
              <p>{appliance.Brand} - {appliance.ModelNumber}</p>
            </div>

            <div className="result-grid">
              <div>
                <p>Serial Number</p>
                <p>{appliance.SerialNumber}</p>
              </div>
              <div>
                <p>Cost</p>
                <p>${appliance.CostOfAppliance}</p>
              </div>
            </div>

            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              className="btn btn-primary"
              style={{ marginBottom: '1rem' }}
            >
              {expandedDetails ? '▼ Hide Details' : '▶ View Full Details'}
            </button>

            {expandedDetails && (
              <div className="expanded-details">
                <strong>Owner Information:</strong>
                <p style={{ color: 'var(--text-primary)' }}>
                  {appliance.FirstName} {appliance.LastName}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {appliance.Email}
                </p>
                
                <br />
                
                <strong>Dates:</strong>
                <p style={{ color: 'var(--text-primary)' }}>
                  Warranty Expires: {new Date(appliance.WarrantyExpirationDate).toLocaleDateString()}
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
                  Warranty Expires: {new Date(appliance.WarrantyExpirationDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={handleSearchAgain}
            className="btn btn-primary"
          >
            Search Another Appliance
          </button>
          <br />
          <Link href="/" style={{ color: 'var(--success)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}