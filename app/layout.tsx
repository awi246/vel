import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Will you be my Valentine?",
  description: "A special Valentine proposal",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
