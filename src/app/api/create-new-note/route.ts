import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";

  // 1️⃣ Check if user already has a note
  const existingNote = await prisma.note.findFirst({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  });

  if (existingNote) {
    console.log("Skipping creation — note already exists:", existingNote.id);
    return NextResponse.json({ noteId: existingNote.id });
  }

  // 2️⃣ Create a new note
  const uuid = uuidv4();
  console.log("Creating new note for", userId);
  const note = await prisma.note.create({
    data: {
      authorId: userId,
      text: "",
      id: uuid,
    },
  });

  return NextResponse.json({ noteId: note.id });
}
