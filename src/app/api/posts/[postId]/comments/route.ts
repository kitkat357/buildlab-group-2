import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { comments, posts, users } from "@/db/schema";
import { getAuthUserId, getSeedUserById } from "@/lib/auth-session";

type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const userId = getAuthUserId(request);

  if (!userId || !getSeedUserById(userId)) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { postId } = await params;

  const post = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .then((rows) => rows[0]);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const rawText =
      typeof body.text === "string"
        ? body.text
        : typeof body.content === "string"
          ? body.content
          : "";
    const text = rawText.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Comment text is required." },
        { status: 400 },
      );
    }

    const [createdComment] = await db
      .insert(comments)
      .values({
        id: crypto.randomUUID(),
        text,
        postId,
        authorId: userId,
      })
      .returning({ id: comments.id });

    const commentWithAuthor = await db
      .select({
        id: comments.id,
        text: comments.text,
        createdAt: comments.createdAt,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.id, createdComment.id))
      .then((rows) => rows[0]);

    return NextResponse.json(commentWithAuthor, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create comment." },
      { status: 500 },
    );
  }
}