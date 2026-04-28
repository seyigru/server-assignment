'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UpdateAppliance() {
  const [serialNumber, setSerialNumber] = useState('');
  const [appliance, setAppliance] = useState(null);
  const [formData, setFormData] = useState({
    applianceType: '',
    brand: '',
    modelNumber: '',
    purchaseDate: '',
    warrantyExpirationDate: '',
    costOfAppliance: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('search'); // 'search', 'update', or 'preview'

  const applianceTypes = ['Fridge', 'Washing Machine', 'Dishwasher', 'Oven', 'Microwave'];

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
        setFormData({
          applianceType: data[0].ApplianceType,
          brand: data[0].Brand,
          modelNumber: data[0].ModelNumber,
          purchaseDate: data[0].PurchaseDate || '',
          warrantyExpirationDate: data[0].WarrantyExpirationDate || '',
          costOfAppliance: data[0].CostOfAppliance
        });
        setStep('update');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setStep('preview');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/appliances', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serialNumber: appliance.SerialNumber,
          ...formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Appliance updated successfully.');
        setTimeout(() => {
          setSerialNumber('');
          setAppliance(null);
          setFormData({
            applianceType: '',
            brand: '',
            modelNumber: '',
            purchaseDate: '',
            warrantyExpirationDate: '',
            costOfAppliance: ''
          });
          setStep('search');
          setMessage('');
        }, 2000);
      } else {
        setMessage(`Error: ${data.message || 'Failed to update appliance'}`);
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
    setStep('search');
  };

  const handleBackToEdit = () => {
    setStep('update');
  };

  return (
    <div>

      {step === 'search' && (
        <div className="form-container">
          <h1>Update Appliance</h1>
          
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

      {step === 'update' && appliance && (
        <div className="form-container">
          <h1>Update Appliance</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Serial: {appliance.SerialNumber}
          </p>

          <form onSubmit={handlePreview}>
            <div className="form-group">
              <label>Appliance Type</label>
              <select
                name="applianceType"
                value={formData.applianceType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select an appliance --</option>
                {applianceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Model Number</label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="000-000-0000"
                required
              />
            </div>

            <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Warranty Expiration Date</label>
              <input
                type="date"
                name="warrantyExpirationDate"
                value={formData.warrantyExpirationDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cost of Appliance</label>
              <input
                type="number"
                name="costOfAppliance"
                value={formData.costOfAppliance}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Preview Changes'}
            </button>

            <button 
              type="button"
              onClick={handleSearchAgain}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', background: 'var(--text-secondary)' }}
            >
              Search Different Appliance
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              <strong>{message.includes('Error') ? '⚠️' : '✓'} {message}</strong>
            </div>
          )}
        </div>
      )}

      {step === 'preview' && appliance && (
        <div className="form-container">
          <h1>Preview Changes</h1>
          
          <div className="comparison-grid">
            <div className="comparison-column">
              <h3>Current Values</h3>
              
              <div className="comparison-item">
                <label>Type</label>
                <p>{appliance.ApplianceType}</p>
              </div>
              
              <div className="comparison-item">
                <label>Brand</label>
                <p>{appliance.Brand}</p>
              </div>
              
              <div className="comparison-item">
                <label>Model</label>
                <p>{appliance.ModelNumber}</p>
              </div>
              
              <div className="comparison-item">
                <label>Purchase Date</label>
                <p>{appliance.PurchaseDate}</p>
              </div>
              
              <div className="comparison-item">
                <label>Warranty Expires</label>
                <p>{appliance.WarrantyExpirationDate}</p>
              </div>
              
              <div className="comparison-item">
                <label>Cost</label>
                <p>${appliance.CostOfAppliance}</p>
              </div>
            </div>

            <div className="comparison-column">
              <h3>New Values</h3>
              
              <div className="comparison-item">
                <label>Type</label>
                <p>{formData.applianceType}</p>
              </div>
              
              <div className="comparison-item">
                <label>Brand</label>
                <p>{formData.brand}</p>
              </div>
              
              <div className="comparison-item">
                <label>Model</label>
                <p>{formData.modelNumber}</p>
              </div>
              
              <div className="comparison-item">
                <label>Purchase Date</label>
                <p>{formData.purchaseDate}</p>
              </div>
              
              <div className="comparison-item">
                <label>Warranty Expires</label>
                <p>{formData.warrantyExpirationDate}</p>
              </div>
              
              <div className="comparison-item">
                <label>Cost</label>
                <p>${formData.costOfAppliance}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateSubmit}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Confirm Update'}
            </button>

            <button 
              type="button"
              onClick={handleBackToEdit}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', background: 'var(--text-secondary)' }}
            >
              Back to Edit
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