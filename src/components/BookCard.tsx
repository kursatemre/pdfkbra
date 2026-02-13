"use client";

import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  status: string;
  totalPages: number;
  translatedPages: number;
  progress: number;
  createdAt: string;
  onTranslate: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<string, { text: string; color: string }> = {
  pending: { text: "Bekliyor", color: "bg-yellow-100 text-yellow-800" },
  translating: { text: "Çevriliyor...", color: "bg-blue-100 text-blue-800" },
  done: { text: "Tamamlandı", color: "bg-green-100 text-green-800" },
  error: { text: "Hata", color: "bg-red-100 text-red-800" },
};

export default function BookCard({
  id,
  title,
  status,
  totalPages,
  translatedPages,
  progress,
  createdAt,
  onTranslate,
  onDelete,
}: BookCardProps) {
  const statusInfo = statusLabels[status] || statusLabels.pending;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Kitap kapağı alanı */}
      <div className="h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center p-6">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-white/60 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        {/* Durum */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
          >
            {statusInfo.text}
          </span>
          <span className="text-xs text-gray-500">
            {totalPages} sayfa
          </span>
        </div>

        {/* İlerleme çubuğu */}
        {(status === "translating" || status === "done") && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Çeviri</span>
              <span>
                {translatedPages}/{totalPages} (%{progress})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="progress-bar h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tarih */}
        <p className="text-xs text-gray-400 mb-3">
          {new Date(createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Butonlar */}
        <div className="flex gap-2">
          <Link
            href={`/book/${id}`}
            className="flex-1 text-center px-3 py-2 bg-[var(--secondary)] text-white text-sm rounded-lg hover:bg-[var(--primary)] transition-colors"
          >
            Oku
          </Link>
          {(status === "pending" || status === "error") && (
            <button
              onClick={() => onTranslate(id)}
              className="flex-1 px-3 py-2 bg-[var(--accent)] text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Çevir
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Sil"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
