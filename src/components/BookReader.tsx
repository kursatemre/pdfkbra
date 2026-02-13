"use client";

import { forwardRef, useCallback, useRef, useState, type FormEvent } from "react";
import HTMLFlipBook from "react-pageflip";

interface Page {
  pageNumber: number;
  originalText: string;
  translatedText: string | null;
}

interface BookReaderProps {
  pages: Page[];
  showOriginal: boolean;
}

const PageContent = forwardRef<
  HTMLDivElement,
  { page: Page; showOriginal: boolean; isLeft: boolean }
>(({ page, showOriginal, isLeft }, ref) => {
  const text = showOriginal
    ? page.originalText
    : page.translatedText || page.originalText;

  return (
    <div
      ref={ref}
      className={`bg-[#faf8f0] relative ${
        isLeft ? "border-r border-gray-200" : ""
      }`}
      style={{
        height: "100%",
        width: "100%",
        boxShadow: isLeft
          ? "inset -8px 0 12px -8px rgba(0,0,0,0.1)"
          : "inset 8px 0 12px -8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 30,
          padding: "20px",
          overflowY: "auto",
          overflowX: "hidden",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {text.split("\n").map((line, i) => (
          <p key={i} style={{ marginBottom: "6px", color: "#1f2937", lineHeight: 1.6, fontSize: "13px" }}>
            {line}
          </p>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "11px",
          color: "#9ca3af",
          padding: "6px 0",
          borderTop: "1px solid #e5e7eb",
          background: "#faf8f0",
        }}
      >
        {page.pageNumber}
      </div>
    </div>
  );
});

PageContent.displayName = "PageContent";

export default function BookReader({ pages, showOriginal }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; turnToPage: (page: number) => void; getCurrentPageIndex: () => number } }>(null);

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const goToPage = (e: FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (num >= 1 && num <= pages.length) {
      bookRef.current?.pageFlip().turnToPage(num - 1);
      setCurrentPage(num - 1);
      setPageInput("");
    }
  };

  if (pages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Bu kitapta henüz sayfa yok.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ maxWidth: "100%", overflow: "hidden" }}>
        <HTMLFlipBook
          ref={bookRef}
          width={450}
          height={650}
          size="stretch"
          minWidth={280}
          maxWidth={450}
          minHeight={400}
          maxHeight={650}
          showCover={false}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="shadow-2xl rounded-lg"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showPageCorners={true}
          disableFlipByClick={false}
          useMouseEvents={true}
          swipeDistance={30}
          clickEventForward={true}
        >
          {pages.map((page, index) => (
            <PageContent
              key={page.pageNumber}
              page={page}
              showOriginal={showOriginal}
              isLeft={index % 2 === 0}
            />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Navigasyon */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={currentPage === 0}
        >
          Önceki
        </button>
        <span className="text-sm text-gray-600">
          Sayfa {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={currentPage >= pages.length - 1}
        >
          Sonraki
        </button>
        <form onSubmit={goToPage} className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={pages.length}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="Sayfa no"
            className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[var(--secondary)] text-white text-sm rounded-lg hover:bg-[var(--primary)] transition-colors"
          >
            Git
          </button>
        </form>
      </div>
    </div>
  );
}
