"use client";

/**
 * Part B & C: House Appliance Inventory Form
 *
 * Allows users to register electrical appliances with Eircode identification.
 * Implements server-side validation via /api/register, XSS-safe output,
 * and sticky form behaviour so valid data persists when validation fails.
 *
 * Server-side delivery: Page is served from Next.js; form submits to API route
 * which performs backend validation and persistence.
 */

import { useState } from "react";
import Link from "next/link";

// Client-side regex for immediate feedback (matches server validation)
const EIRCODE_PATTERN = "(?:[AC-FHKNPRTV-Ya-ac-fhknprtv-y][0-9]{2}|D6W)[ -]?[0-9AC-FHKNPRTV-Ya-ac-fhknprtv-y]{4}";
const MODEL_PATTERN = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
const SERIAL_PATTERN = "[0-9]{4}-[0-9]{4}-[0-9]{4}";
const DATE_PATTERN = "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}";

const APPLIANCE_OPTIONS = ["Fridge", "Washing Machine", "Dishwasher", "Oven", "Dryer", "Microwave"];

export default function PartBCPage() {
  const [formData, setFormData] = useState({
    eircode: "",
    applianceType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyDate: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setSuccess(null);
  };

  /**
   * Submits form to /api/register.
   * On success: displays confirmation.
   * On validation error: repopulates form with submitted data (sticky behaviour).
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data);
        setFormData({
          eircode: "",
          applianceType: "",
          brand: "",
          modelNumber: "",
          serialNumber: "",
          purchaseDate: "",
          warrantyDate: "",
        });
      } else {
        setErrors(data.errors || {});
        if (data.formData) {
          setFormData(data.formData);
        }
      }
    } catch (err) {
      setErrors({ submit: "Unable to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-container">
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/part-a">Part A - Cinema Booking</Link></li>
          <li><Link href="/part-b-c">Part B & C - Appliance Inventory</Link></li>
        </ul>
      </nav>

      <h1>House Appliance Inventory</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eircode">Eircode</label>
          <input
            id="eircode"
            type="text"
            value={formData.eircode}
            onChange={(e) => updateField("eircode", e.target.value)}
            placeholder="D00 0000"
            maxLength={9}
            pattern={EIRCODE_PATTERN}
            title="Eircode format: D00 0000 (e.g. D02 X285)"
            required
            className={errors.eircode ? "error" : ""}
          />
          {errors.eircode && <p className="error-message">{errors.eircode}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="applianceType">Appliance Type</label>
          <select
            id="applianceType"
            value={formData.applianceType}
            onChange={(e) => updateField("applianceType", e.target.value)}
            required
            className={errors.applianceType ? "error" : ""}
          >
            <option value="">Select appliance type</option>
            {APPLIANCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.applianceType && <p className="error-message">{errors.applianceType}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            type="text"
            value={formData.brand}
            onChange={(e) => updateField("brand", e.target.value)}
            placeholder="e.g. Samsung"
            maxLength={50}
            required
            className={errors.brand ? "error" : ""}
          />
          {errors.brand && <p className="error-message">{errors.brand}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="modelNumber">Model Number</label>
          <input
            id="modelNumber"
            type="text"
            value={formData.modelNumber}
            onChange={(e) => updateField("modelNumber", e.target.value)}
            placeholder="000-000-0000"
            maxLength={14}
            pattern={MODEL_PATTERN}
            title="Format: 000-000-0000"
            required
            className={errors.modelNumber ? "error" : ""}
          />
          {errors.modelNumber && <p className="error-message">{errors.modelNumber}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            id="serialNumber"
            type="text"
            value={formData.serialNumber}
            onChange={(e) => updateField("serialNumber", e.target.value)}
            placeholder="0000-0000-0000"
            maxLength={16}
            pattern={SERIAL_PATTERN}
            title="Format: 0000-0000-0000"
            required
            className={errors.serialNumber ? "error" : ""}
          />
          {errors.serialNumber && <p className="error-message">{errors.serialNumber}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date</label>
          <input
            id="purchaseDate"
            type="text"
            value={formData.purchaseDate}
            onChange={(e) => updateField("purchaseDate", e.target.value)}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            pattern={DATE_PATTERN}
            title="Format: DD/MM/YYYY"
            required
            className={errors.purchaseDate ? "error" : ""}
          />
          {errors.purchaseDate && <p className="error-message">{errors.purchaseDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="warrantyDate">Warranty Expiration Date</label>
          <input
            id="warrantyDate"
            type="text"
            value={formData.warrantyDate}
            onChange={(e) => updateField("warrantyDate", e.target.value)}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            pattern={DATE_PATTERN}
            title="Format: DD/MM/YYYY"
            required
            className={errors.warrantyDate ? "error" : ""}
          />
          {errors.warrantyDate && <p className="error-message">{errors.warrantyDate}</p>}
        </div>

        {errors.submit && <p className="error-message">{errors.submit}</p>}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add to Inventory"}
        </button>
      </form>

      {success && (
        <div className="message success">
          <p>{success.message}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
            Eircode: {success.data?.eircode} | {success.data?.applianceType} - {success.data?.brand}{" "}
            {success.data?.modelNumber}
          </p>
        </div>
      )}
    </div>
  );
}
