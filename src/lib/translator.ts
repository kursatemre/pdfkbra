import translate from "google-translate-api-x";

const CHUNK_SIZE = 4000; // Google Translate karakter limiti

function splitTextIntoChunks(text: string, maxSize: number): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split("\n");
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 1 > maxSize) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? "\n" : "") + paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}

export async function translateText(
  text: string,
  from: string = "en",
  to: string = "tr"
): Promise<string> {
  if (!text.trim()) return "";

  const chunks = splitTextIntoChunks(text, CHUNK_SIZE);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const result = await translate(chunk, { from, to });
    translatedChunks.push(result.text);
    // Rate limiting - kısa bekleme
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return translatedChunks.join("\n");
}
