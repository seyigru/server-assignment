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

// READ - Get all appliances or search by serial number
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchSerial = url.searchParams.get('serial');

    if (searchSerial) {
      // Search by serial number
      const [appliances] = await pool.query(
        'SELECT a.*, u.FirstName, u.LastName, u.Email FROM Appliance a JOIN User u ON a.UserID = u.UserID WHERE a.SerialNumber = ?',
        [searchSerial]
      );
      
      if (appliances.length === 0) {
        return Response.json({ message: 'No matching appliance found!' }, { status: 404 });
      }
      
      return Response.json(appliances);
    }

    // Get all appliances
    const [appliances] = await pool.query(
      'SELECT a.*, u.FirstName, u.LastName, u.Email FROM Appliance a JOIN User u ON a.UserID = u.UserID'
    );

    return Response.json(appliances);
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

// UPDATE - Update appliance details by serial number
export async function PUT(req) {
  try {
    const { 
      serialNumber,
      applianceType, 
      brand, 
      modelNumber, 
      purchaseDate, 
      warrantyExpirationDate, 
      costOfAppliance 
    } = await req.json();

    if (!serialNumber) {
      return Response.json({ message: 'Serial number required' }, { status: 400 });
    }

    // Update appliance by serial number
    await pool.query(
      'UPDATE Appliance SET ApplianceType = ?, Brand = ?, ModelNumber = ?, PurchaseDate = ?, WarrantyExpirationDate = ?, CostOfAppliance = ? WHERE SerialNumber = ?',
      [applianceType, brand, modelNumber, purchaseDate, warrantyExpirationDate, costOfAppliance, serialNumber]
    );

    return Response.json({ message: 'Appliance has been updated' });
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete appliance by serial number
export async function DELETE(req) {
  try {
    const { serialNumber } = await req.json();

    if (!serialNumber) {
      return Response.json({ message: 'Serial number required' }, { status: 400 });
    }

    await pool.query('DELETE FROM Appliance WHERE SerialNumber = ?', [serialNumber]);

    return Response.json({ message: 'Appliance Deleted' });
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}