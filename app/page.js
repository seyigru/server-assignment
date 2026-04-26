/**
 * Main landing page for the application.
 * Provides navigation links to Part A (Cinema Booking) and Part B/C (House Appliance Inventory).
 * Rendered on the server - users see this when they first visit the site.
 */
import Link from "next/link";

export default function Home() {
  return (
    <div className="main-page">
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/part-a">Part A - Cinema Booking</Link></li>
          <li><Link href="/part-b-c">Part B & C - Appliance Inventory</Link></li>
        </ul>
      </nav>

      <h1>Server-Side Web Development Assignment</h1>
      <p>Select a section below to begin</p>

      <div className="link-cards">
        <Link href="/part-a" className="link-card">
          <h2>Part A: Cinema Ticket Booking</h2>
          <p>Book cinema tickets with movie selection, showtimes and mobile confirmation</p>
        </Link>
        <Link href="/part-b-c" className="link-card">
          <h2>Part B & C: House Appliance Inventory</h2>
          <p>Register electrical appliances with Eircode validation and sticky form behaviour</p>
        </Link>
      </div>
    </div>
  );
}
