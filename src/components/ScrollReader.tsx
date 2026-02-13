"use client";

interface Page {
  pageNumber: number;
  originalText: string;
  translatedText: string | null;
}

interface ScrollReaderProps {
  pages: Page[];
  showOriginal: boolean;
}

export default function ScrollReader({ pages, showOriginal }: ScrollReaderProps) {
  if (pages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Bu kitapta henüz sayfa yok.
      </div>
    );
  }

  return (
    <div className="scroll-reader bg-[#faf8f0] rounded-xl shadow-lg p-6 sm:p-12 overflow-x-hidden" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
      {pages.map((page, index) => {
        const text = showOriginal
          ? page.originalText
          : page.translatedText || page.originalText;

        return (
          <div key={page.pageNumber}>
            {text.split("\n").map((line, i) => (
              <p key={i} className="mb-3 text-gray-800 leading-relaxed">
                {line}
              </p>
            ))}
            {index < pages.length - 1 && (
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 border-t border-gray-300" />
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  Sayfa {page.pageNumber}
                </span>
                <div className="flex-1 border-t border-gray-300" />
              </div>
            )}
          </div>
        );
      })}
      <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-300">
        Sayfa {pages[pages.length - 1].pageNumber} — Son
      </div>
    </div>
  );
}
