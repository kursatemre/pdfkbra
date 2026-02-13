import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { translateText } from "@/lib/translator";

export async function POST(request: NextRequest) {
  try {
    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { error: "bookId gerekli" },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { pages: { orderBy: { pageNumber: "asc" } } },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Kitap bulunamadı" },
        { status: 404 }
      );
    }

    if (book.status === "translating") {
      return NextResponse.json(
        { error: "Çeviri zaten devam ediyor" },
        { status: 400 }
      );
    }

    // Durumu güncelle
    await prisma.book.update({
      where: { id: bookId },
      data: { status: "translating" },
    });

    // Arka planda çeviri başlat (fire and forget)
    translateBook(bookId, book.pages).catch(console.error);

    return NextResponse.json({ message: "Çeviri başlatıldı", bookId });
  } catch (error) {
    console.error("Translate error:", error);
    return NextResponse.json(
      { error: "Çeviri başlatılırken hata oluştu" },
      { status: 500 }
    );
  }
}

async function translateBook(
  bookId: string,
  pages: Array<{ id: string; originalText: string; translatedText: string | null }>
) {
  try {
    for (const page of pages) {
      if (page.translatedText) continue; // Zaten çevrilmiş sayfayı atla

      const translated = await translateText(page.originalText);

      await prisma.page.update({
        where: { id: page.id },
        data: { translatedText: translated },
      });
    }

    await prisma.book.update({
      where: { id: bookId },
      data: { status: "done" },
    });
  } catch (error) {
    console.error("Translation error for book:", bookId, error);
    await prisma.book.update({
      where: { id: bookId },
      data: { status: "error" },
    });
  }
}

// Çeviri durumunu sorgulama
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ error: "bookId gerekli" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      pages: {
        select: { id: true, pageNumber: true, translatedText: true },
        orderBy: { pageNumber: "asc" },
      },
    },
  });

  if (!book) {
    return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
  }

  const translatedCount = book.pages.filter((p) => p.translatedText).length;

  return NextResponse.json({
    bookId: book.id,
    status: book.status,
    totalPages: book.totalPages,
    translatedPages: translatedCount,
    progress: book.totalPages > 0 ? Math.round((translatedCount / book.totalPages) * 100) : 0,
  });
}
