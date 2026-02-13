"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ScrollReader from "@/components/ScrollReader";
import PdfViewer from "@/components/PdfViewer";
import Link from "next/link";

const BookReader = dynamic(() => import("@/components/BookReader"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]" />
    </div>
  ),
});

interface PageData {
  pageNumber: number;
  originalText: string;
  translatedText: string | null;
}

interface Book {
  id: string;
  title: string;
  status: string;
  totalPages: number;
  pdfPath: string;
  pages: PageData[];
}

type ViewMode = "pdf" | "translated-page" | "translated-scroll";

export default function BookPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("pdf");

  useEffect(() => {
    async function fetchBook() {
      const res = await fetch(`/api/books/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data);
      }
      setLoading(false);
    }
    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-500">Kitap bulunamadı</h2>
        <Link
          href="/"
          className="text-[var(--accent)] hover:underline mt-4 inline-block"
        >
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const hasTranslation = book.pages.some((p) => p.translatedText);

  return (
    <div>
      {/* Üst bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            {book.title}
          </h1>
        </div>

        {/* Görünüm modu seçici */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("pdf")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "pdf"
                ? "bg-white shadow text-[var(--primary)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Orijinal PDF
          </button>
          <button
            onClick={() => setViewMode("translated-page")}
            disabled={!hasTranslation}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "translated-page"
                ? "bg-white shadow text-[var(--primary)]"
                : "text-gray-500 hover:text-gray-700"
            } ${!hasTranslation ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <svg
              className="w-4 h-4 inline mr-1"
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
            Çeviri
          </button>
          <button
            onClick={() => setViewMode("translated-scroll")}
            disabled={!hasTranslation}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "translated-scroll"
                ? "bg-white shadow text-[var(--primary)]"
                : "text-gray-500 hover:text-gray-700"
            } ${!hasTranslation ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Scroll
          </button>
        </div>
      </div>

      {/* Çeviri uyarısı */}
      {viewMode !== "pdf" && !hasTranslation && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            Bu kitap henüz çevrilmemiştir. Önce ana sayfadan çeviri başlatın.
          </p>
        </div>
      )}

      {book.status === "translating" && viewMode !== "pdf" && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            Çeviri devam ediyor. Çevrilen sayfalar gösterilmektedir.
          </p>
        </div>
      )}

      {/* Okuyucu */}
      {viewMode === "pdf" && <PdfViewer pdfPath={book.pdfPath} />}
      {viewMode === "translated-page" && (
        <BookReader pages={book.pages} showOriginal={false} />
      )}
      {viewMode === "translated-scroll" && (
        <ScrollReader pages={book.pages} showOriginal={false} />
      )}
    </div>
  );
}
