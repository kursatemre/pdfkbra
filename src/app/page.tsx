"use client";

import { useState, useEffect, useCallback } from "react";
import BookCard from "@/components/BookCard";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  status: string;
  totalPages: number;
  translatedPages: number;
  progress: number;
  createdAt: string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/books${params}`);
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Çevirisi devam eden kitaplar varsa periyodik güncelleme
  useEffect(() => {
    const hasTranslating = books.some((b) => b.status === "translating");
    if (!hasTranslating) return;
    const interval = setInterval(fetchBooks, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.map((b) => b.status).join(",")]);

  const handleTranslate = async (bookId: string) => {
    await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId }),
    });
    fetchBooks();
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/books?id=${bookId}`, { method: "DELETE" });
    fetchBooks();
  };

  return (
    <div>
      {/* Başlık ve arama */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            Kitaplarım
          </h1>
          <p className="text-gray-500 mt-1">
            PDF kitaplarınızı çevirin ve okuyun
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Kitap ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Kitap listesi */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            Henüz kitap yok
          </h3>
          <p className="text-gray-400 mb-4">
            İlk PDF kitabınızı yükleyerek başlayın
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            PDF Yükle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onTranslate={handleTranslate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
