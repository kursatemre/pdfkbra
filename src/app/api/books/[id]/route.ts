import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
    },
  });

  if (!book) {
    return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(book);
}
