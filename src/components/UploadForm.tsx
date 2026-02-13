"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      if (!title) setTitle(droppedFile.name.replace(".pdf", ""));
      setError("");
    } else {
      setError("Sadece PDF dosyaları kabul edilir");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name.replace(".pdf", ""));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Lütfen bir PDF dosyası seçin");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name.replace(".pdf", ""));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Yükleme başarısız");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">
        PDF Yükle
      </h1>
      <p className="text-gray-500 mb-8">
        İngilizce PDF kitabınızı yükleyin, Türkçeye çevirelim
      </p>

      {/* Başlık */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kitap Başlığı
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Kitap başlığını girin..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      {/* Dosya yükleme alanı */}
      <div
        className={`upload-area rounded-xl p-10 text-center cursor-pointer mb-6 ${
          dragOver ? "drag-over" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div>
            <svg
              className="w-12 h-12 text-green-500 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-700 font-medium">{file.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 font-medium">
              PDF dosyanızı buraya sürükleyin
            </p>
            <p className="text-gray-400 text-sm mt-1">
              veya tıklayarak seçin
            </p>
          </div>
        )}
      </div>

      {/* Hata mesajı */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Yükle butonu */}
      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Yükleniyor...
          </>
        ) : (
          "Yükle"
        )}
      </button>
    </form>
  );
}
