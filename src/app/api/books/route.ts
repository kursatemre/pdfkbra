import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const books = await prisma.book.findMany({
    where: search
      ? { title: { contains: search } }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { pages: true },
      },
      pages: {
        select: { translatedText: true },
      },
    },
  });

  const result = books.map((book) => {
    const translatedCount = book.pages.filter((p) => p.translatedText).length;
    return {
      id: book.id,
      title: book.title,
      status: book.status,
      totalPages: book.totalPages,
      translatedPages: translatedCount,
      progress:
        book.totalPages > 0
          ? Math.round((translatedCount / book.totalPages) * 100)
          : 0,
      createdAt: book.createdAt,
    };
  });

  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }

  await prisma.book.delete({ where: { id } });

  return NextResponse.json({ message: "Kitap silindi" });
}
