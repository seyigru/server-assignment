/**
 * API Route: GET /api/inventory
 *
 * Retrieves appliances from the inventory for a given Eircode.
 * Used for display of registered appliances. Output is sanitized to prevent XSS.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { promises as fs } from "fs";
import path from "path";

function sanitizeForOutput(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eircode = searchParams.get("eircode");

    if (!eircode || !eircode.trim()) {
      return NextResponse.json(
        { success: false, error: "Eircode is required" },
        { status: 400 }
      );
    }

    const dataPath = path.join(process.cwd(), "data", "inventory.json");
    let inventory = [];
    try {
      const content = await fs.readFile(dataPath, "utf-8");
      inventory = JSON.parse(content);
    } catch {
      inventory = [];
    }

    const normalised = eircode.trim().replace(/\s/g, "").toUpperCase();
    const filtered = inventory.filter((item) => {
      const itemCode = (item.eircode || "").replace(/\s/g, "").toUpperCase();
      return itemCode === normalised;
    });

    // Sanitize all output to prevent XSS
    const safe = filtered.map((item) => ({
      id: item.id,
      eircode: sanitizeForOutput(item.eircode),
      applianceType: sanitizeForOutput(item.applianceType),
      brand: sanitizeForOutput(item.brand),
      modelNumber: sanitizeForOutput(item.modelNumber),
      serialNumber: sanitizeForOutput(item.serialNumber),
      purchaseDate: sanitizeForOutput(item.purchaseDate),
      warrantyDate: sanitizeForOutput(item.warrantyDate),
    }));

    return NextResponse.json({
      success: true,
      appliances: safe,
    });
  } catch (err) {
    console.error("Inventory API error:", err);
    return NextResponse.json(
      { success: false, error: "An error occurred." },
      { status: 500 }
    );
  }
}
