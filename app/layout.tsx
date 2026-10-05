import "./globals.css";

export const metadata = {
  title: "Chess Arena",
  description: "Play Chess vs Stockfish",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}