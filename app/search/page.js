'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchAppliance() {
  const [serialNumber, setSerialNumber] = useState('');
  const [appliance, setAppliance] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAppliance(null);
    setLoading(true);
    setSearched(true);

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
    setSearched(false);
  };

  return (
    <div>
      <Link href="/" className="home-button">
         ⌂
      </Link>

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
          <div className="message success">
            <strong>✓ Appliance Found!</strong>
            <br />
            <br />
            <strong>User Information:</strong>
            <br />
            Name: {appliance.FirstName} {appliance.LastName}
            <br />
            Email: {appliance.Email}
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
            Purchase Date: {appliance.PurchaseDate}
            <br />
            Warranty Expires: {appliance.WarrantyExpirationDate}
            <br />
            Cost: ${appliance.CostOfAppliance}
            <br />
            <br />
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
        </div>
      )}
    </div>
  );
}