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
          <a className="brand" href="/">QuoteGate</a>
          <nav>
            <a href="/setup">Setup</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
