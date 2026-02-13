"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--primary)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xl font-bold">PDF Kitap</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-[var(--secondary)] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[var(--secondary)]"
              }`}
            >
              Kitaplarım
            </Link>
            <Link
              href="/upload"
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              PDF Yükle
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
