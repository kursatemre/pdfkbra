"use client";

interface PdfViewerProps {
  pdfPath: string;
}

export default function PdfViewer({ pdfPath }: PdfViewerProps) {
  return (
    <div className="flex flex-col items-center">
      <iframe
        src={pdfPath}
        className="w-full rounded-lg shadow-2xl border border-gray-200"
        style={{ height: "85vh", maxWidth: "900px" }}
        title="PDF Görüntüleyici"
      />
    </div>
  );
}
