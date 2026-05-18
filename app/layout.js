import "./globals.css";

export const metadata = {
  title: "Testing Counter",
  description: "A simple Next.js counter app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
