import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parsePdfFromBuffer } from "@/lib/pdf-parser";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya yüklenmedi" }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Sadece PDF dosyaları kabul edilir" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Supabase Storage'a yükle
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Dosya yüklenirken hata oluştu" },
        { status: 500 }
      );
    }

    // Public URL al
    const { data: urlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;

    // PDF'i parse et
    const pages = await parsePdfFromBuffer(buffer);

    // Veritabanına kaydet
    const book = await prisma.book.create({
      data: {
        title: title || file.name.replace(".pdf", ""),
        pdfPath: pdfUrl,
        totalPages: pages.length,
        status: "pending",
        pages: {
          create: pages.map((p) => ({
            pageNumber: p.pageNumber,
            originalText: p.text,
          })),
        },
      },
    });

    return NextResponse.json({
      id: book.id,
      title: book.title,
      totalPages: pages.length,
      status: book.status,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
