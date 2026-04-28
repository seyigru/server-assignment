/**
 * Root layout component for the Next.js application.
 * Wraps all pages with consistent HTML structure and global styles.
 * Server-side rendered - provides the base document structure.
 */
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Griffith College - Server Assignment",
  description: "Cinema Booking & House Appliance Inventory System",
};

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            🏠 Home
          </Link>
        </li>
        <li>
          <Link href="/add">
            ➕ Add
          </Link>
        </li>
        <li>
          <Link href="/search">
            🔍 Search
          </Link>
        </li>
        <li>
          <Link href="/update">
            ✏️ Update
          </Link>
        </li>
        <li>
          <Link href="/delete">
            🗑️ Delete
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}