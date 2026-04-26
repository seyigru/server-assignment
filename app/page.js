'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="main-page">
        <h1>Appliance Inventory System</h1>
        <p>Manage your household appliances with ease. Add, search, update, or delete your appliance records.</p>

        <div className="link-cards">
          <Link href="/add" className="link-card">
            <h2>Add Appliance</h2>
            <p>Register a new appliance to your inventory</p>
          </Link>

          <Link href="/search" className="link-card">
            <h2>Search Appliance</h2>
            <p>Find appliances by serial number</p>
          </Link>

          <Link href="/update" className="link-card">
            <h2>Update Appliance</h2>
            <p>Modify existing appliance details</p>
          </Link>

          <Link href="/delete" className="link-card">
            <h2>Delete Appliance</h2>
            <p>Remove appliances from inventory</p>
          </Link>
        </div>
      </div>
    </div>
  );
}