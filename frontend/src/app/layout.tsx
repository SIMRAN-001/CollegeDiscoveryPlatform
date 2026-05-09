import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CollegeFind – Discover Your Dream College",
  description: "Search, compare and find the best colleges in India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-16 text-sm">
          <p className="font-display text-white text-lg mb-1">CollegeFind</p>
          <p>© 2024 CollegeFind. Built for smart college decisions.</p>
        </footer>
      </body>
    </html>
  );
}
