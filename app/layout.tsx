import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudGuard Lite",
  description: "Lightweight cloud security posture and internal policy assistant."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
