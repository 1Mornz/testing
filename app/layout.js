import './globals.css';

export const metadata = {
  title: 'QuoteGate',
  description: 'Paid quote request pages for service providers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a className="brand" href="/">
            <span className="brand-mark">Q</span>
            QuoteGate
          </a>
          <nav aria-label="Primary navigation">
            <a href="/services">Explore</a>
            <a href="/q/brightside-home-services">Demo</a>
            <a href="/login">Login</a>
            <a className="nav-cta" href="/dashboard">Dashboard</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
