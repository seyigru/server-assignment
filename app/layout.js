/**
 * Root layout component for the Next.js application.
 * Wraps all pages with consistent HTML structure and global styles.
 * Server-side rendered - provides the base document structure.
 */
import "./globals.css";

export const metadata = {
  title: "Griffith College - Server Assignment",
  description: "Cinema Booking & House Appliance Inventory System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
