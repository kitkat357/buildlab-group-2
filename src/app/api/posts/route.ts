import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getAuthUserId, getSeedUserById } from "@/lib/auth-session";

export async function POST(request: Request) {
  const userId = getAuthUserId(request);

  if (!userId || !getSeedUserById(userId)) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const communityId = typeof body.communityId === "string" ? body.communityId : "";

    if (!title || !content || !communityId) {
      return NextResponse.json(
        { error: "title, content, and communityId are required." },
        { status: 400 },
      );
    }

    const [post] = await db
      .insert(posts)
      .values({
        id: crypto.randomUUID(),
        title,
        content,
        communityId,
        authorId: userId,
      })
      .returning();

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create the post." },
      { status: 500 },
    );
  }
}