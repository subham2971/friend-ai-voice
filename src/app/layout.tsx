import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friend AI",
  description: "Create your own friendly AI companion (with optional custom voice, consent-gated).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
