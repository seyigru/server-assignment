import pool from '@/lib/db';

// CREATE - Add new appliance with user data
export async function POST(req) {
  try {
    const { 
      firstName, 
      lastName, 
      address, 
      mobile, 
      email, 
      eircode,
      applianceType, 
      brand, 
      modelNumber, 
      serialNumber, 
      purchaseDate, 
      warrantyExpirationDate, 
      costOfAppliance 
    } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !address || !mobile || !email || !eircode || 
        !applianceType || !brand || !modelNumber || !serialNumber || 
        !purchaseDate || !warrantyExpirationDate || !costOfAppliance) {
      return Response.json({ message: 'All fields required' }, { status: 400 });
    }

    // Check if user exists, if not create them
    const [existingUser] = await pool.query(
      'SELECT UserID FROM User WHERE Email = ?',
      [email]
    );

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].UserID;
    } else {
      const [userResult] = await pool.query(
        'INSERT INTO User (FirstName, LastName, Address, Mobile, Email, Eircode) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, address, mobile, email, eircode]
      );
      userId = userResult.insertId;
    }

    // Insert appliance
    await pool.query(
      'INSERT INTO Appliance (UserID, ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpirationDate, CostOfAppliance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, applianceType, brand, modelNumber, serialNumber, purchaseDate, warrantyExpirationDate, costOfAppliance]
    );

    return Response.json({ message: 'New appliance added successfully' }, { status: 201 });
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
