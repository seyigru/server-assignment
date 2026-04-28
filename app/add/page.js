'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddAppliance() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobile: '',
    email: '',
    eircode: '',
    applianceType: '',
    brand: '',
    modelNumber: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyExpirationDate: '',
    costOfAppliance: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const applianceTypes = ['Fridge', 'Washing Machine', 'Dishwasher', 'Oven', 'Microwave'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/appliances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New appliance added successfully.');
        setFormData({
          firstName: '',
          lastName: '',
          address: '',
          mobile: '',
          email: '',
          eircode: '',
          applianceType: '',
          brand: '',
          modelNumber: '',
          serialNumber: '',
          purchaseDate: '',
          warrantyExpirationDate: '',
          costOfAppliance: ''
        });
      } else {
        setMessage(`Error: ${data.message || 'Failed to add appliance'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="form-container">
        <h1>Add Appliance</h1>
        
        <form onSubmit={handleSubmit}>
          {/* User Information */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10 digits"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Eircode</label>
            <input
              type="text"
              name="eircode"
              value={formData.eircode}
              onChange={handleChange}
              placeholder="D00 0000"
              required
            />
          </div>

          {/* Appliance Information */}
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
            <label>Serial Number</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="0000-0000-0000"
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
            {loading ? 'Adding...' : 'Add Appliance'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
            {message.includes('successfully') && (
              <>
                <br />
                <Link href="/" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Back to Home
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}