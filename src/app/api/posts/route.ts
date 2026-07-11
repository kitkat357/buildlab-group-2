import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content, authorId, communityId } = body;

  if (!title || !content || !authorId || !communityId) {
    return NextResponse.json(
      { error: "title, content, authorId, and communityId are required." },
      { status: 400 },
    );
  }

  try {
    const [post] = await db
      .insert(posts)
      .values({
        id: crypto.randomUUID(),
        title,
        content,
        authorId,
        communityId,
      })
      .returning();

    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create post." },
      { status: 500 },
    );
  }
}
