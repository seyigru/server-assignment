/**
 * API Route: POST /api/register
 *
 * Handles House Appliance Inventory form submissions.
 * Performs server-side validation, sanitizes inputs to prevent XSS,
 * and persists valid appliances to inventory.json.
 *
 * Returns either success with confirmation or error object with
 * validation messages and form data for sticky form repopulation.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { promises as fs } from "fs";
import path from "path";

// Validation patterns
const EIRCODE_REGEX = /^(?:[AC-FHKNPRTV-Y][0-9]{2}|D6W)\s?[0-9AC-FHKNPRTV-Y]{4}$/i;
const MODEL_REGEX = /^\d{3}-\d{3}-\d{4}$/;
const SERIAL_REGEX = /^\d{4}-\d{4}-\d{4}$/;
const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Allowed appliance types - prevents injection of invalid options
const ALLOWED_APPLIANCE_TYPES = ["Fridge", "Washing Machine", "Dishwasher", "Oven", "Dryer", "Microwave"];

/**
 * Sanitizes a string to prevent XSS attacks.
 * Escapes HTML special characters so user input cannot execute as script.
 * We use character-level replacement rather than a library to keep dependencies minimal.
 */
function sanitizeForOutput(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Normalises Eircode to uppercase without space for consistent storage.
 * Accepts "D00 0000" or "D000000" format.
 */
function normaliseEircode(value) {
  const cleaned = String(value).trim().replace(/\s/g, "").toUpperCase();
  return cleaned.length >= 7 ? `${cleaned.slice(0, 3)} ${cleaned.slice(3)}` : value;
}

/**
 * Parses DD/MM/YYYY string to Date. Returns null if invalid.
 */
function parseDDMMYYYY(dateStr) {
  if (!DATE_REGEX.test(dateStr)) return null;
  const [d, m, y] = dateStr.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Validates the form payload. Returns { valid: boolean, errors: object, sanitizedData: object }
 */
function validateAndSanitize(body) {
  const errors = {};
  const sanitized = {};

  // Eircode
  const eircodeRaw = (body.eircode || "").trim().replace(/\s/g, "");
  const eircodeFormatted = normaliseEircode(body.eircode || "");
  if (!eircodeRaw) {
    errors.eircode = "Eircode is required";
  } else if (!EIRCODE_REGEX.test(eircodeRaw.toUpperCase())) {
    errors.eircode = "Invalid Eircode format (e.g. D00 0000)";
  } else {
    sanitized.eircode = eircodeFormatted;
  }

  // Appliance type - must be from allowed list
  const applianceType = (body.applianceType || "").trim();
  if (!applianceType) {
    errors.applianceType = "Please select an appliance type";
  } else if (!ALLOWED_APPLIANCE_TYPES.includes(applianceType)) {
    errors.applianceType = "Invalid appliance type selected";
  } else {
    sanitized.applianceType = applianceType;
  }

  // Brand - alphanumeric and common chars only, max 50
  const brand = (body.brand || "").trim();
  if (!brand) {
    errors.brand = "Brand is required";
  } else if (brand.length > 50) {
    errors.brand = "Brand must be 50 characters or less";
  } else if (!/^[\w\s\-\.]+$/.test(brand)) {
    errors.brand = "Brand contains invalid characters";
  } else {
    sanitized.brand = brand;
  }

  // Model number
  const modelNumber = (body.modelNumber || "").trim();
  if (!modelNumber) {
    errors.modelNumber = "Model number is required";
  } else if (!MODEL_REGEX.test(modelNumber)) {
    errors.modelNumber = "Model must match format 000-000-0000";
  } else {
    sanitized.modelNumber = modelNumber;
  }

  // Serial number
  const serialNumber = (body.serialNumber || "").trim();
  if (!serialNumber) {
    errors.serialNumber = "Serial number is required";
  } else if (!SERIAL_REGEX.test(serialNumber)) {
    errors.serialNumber = "Serial must match format 0000-0000-0000";
  } else {
    sanitized.serialNumber = serialNumber;
  }

  // Purchase date
  const purchaseDateStr = (body.purchaseDate || "").trim();
  if (!purchaseDateStr) {
    errors.purchaseDate = "Purchase date is required";
  } else if (!DATE_REGEX.test(purchaseDateStr)) {
    errors.purchaseDate = "Use DD/MM/YYYY format";
  } else {
    const purchaseDate = parseDDMMYYYY(purchaseDateStr);
    if (!purchaseDate) {
      errors.purchaseDate = "Invalid purchase date";
    } else {
      sanitized.purchaseDate = purchaseDateStr;
    }
  }

  // Warranty expiration
  const warrantyDateStr = (body.warrantyDate || "").trim();
  if (!warrantyDateStr) {
    errors.warrantyDate = "Warranty expiration date is required";
  } else if (!DATE_REGEX.test(warrantyDateStr)) {
    errors.warrantyDate = "Use DD/MM/YYYY format";
  } else {
    const warrantyDate = parseDDMMYYYY(warrantyDateStr);
    if (!warrantyDate) {
      errors.warrantyDate = "Invalid warranty date";
    } else {
      const purchaseDate = parseDDMMYYYY(purchaseDateStr);
      if (purchaseDate && warrantyDate < purchaseDate) {
        errors.warrantyDate = "Warranty date cannot be earlier than purchase date";
      } else {
        sanitized.warrantyDate = warrantyDateStr;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sanitized,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { valid, errors, sanitizedData } = validateAndSanitize(body);

    if (!valid) {
      // Return errors and form data for sticky form (Part C)
      // Raw values are safe: React escapes when rendering into value attributes
      const formDataForRepopulate = {
        eircode: (body.eircode || "").trim(),
        applianceType: (body.applianceType || "").trim(),
        brand: (body.brand || "").trim(),
        modelNumber: (body.modelNumber || "").trim(),
        serialNumber: (body.serialNumber || "").trim(),
        purchaseDate: (body.purchaseDate || "").trim(),
        warrantyDate: (body.warrantyDate || "").trim(),
      };
      return NextResponse.json({
        success: false,
        errors,
        formData: formDataForRepopulate,
      });
    }

    // Persist to JSON file
    const dataPath = path.join(process.cwd(), "data", "inventory.json");
    let inventory = [];
    try {
      const content = await fs.readFile(dataPath, "utf-8");
      inventory = JSON.parse(content);
    } catch {
      inventory = [];
    }

    const entry = {
      id: Date.now().toString(),
      ...sanitizedData,
      registeredAt: new Date().toISOString(),
    };
    inventory.push(entry);
    await fs.writeFile(dataPath, JSON.stringify(inventory, null, 2), "utf-8");

    // Return success with sanitized confirmation data (XSS prevention)
    return NextResponse.json({
      success: true,
      message: "Appliance added to inventory successfully",
      data: {
        eircode: sanitizeForOutput(sanitizedData.eircode),
        applianceType: sanitizeForOutput(sanitizedData.applianceType),
        brand: sanitizeForOutput(sanitizedData.brand),
        modelNumber: sanitizeForOutput(sanitizedData.modelNumber),
        serialNumber: sanitizeForOutput(sanitizedData.serialNumber),
        purchaseDate: sanitizeForOutput(sanitizedData.purchaseDate),
        warrantyDate: sanitizeForOutput(sanitizedData.warrantyDate),
      },
    });
  } catch (err) {
    // Avoid exposing internal details to client
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
