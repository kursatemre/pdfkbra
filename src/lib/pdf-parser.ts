import { PDFParse } from "pdf-parse";

export interface ParsedPage {
  pageNumber: number;
  text: string;
}

export async function parsePdfFromBuffer(buffer: Buffer): Promise<ParsedPage[]> {
  const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 });
  const result = await parser.getText();
  const pages: ParsedPage[] = [];

  if (result.pages && result.pages.length > 0) {
    for (const page of result.pages) {
      const text = page.text.trim();
      if (text.length > 0) {
        pages.push({
          pageNumber: page.num,
          text,
        });
      }
    }
  }

  // Fallback: eğer sayfa bulunamadıysa, tüm metni tek sayfa olarak döndür
  if (pages.length === 0 && result.text && result.text.trim()) {
    pages.push({
      pageNumber: 1,
      text: result.text.trim(),
    });
  }

  await parser.destroy();
  return pages;
}
