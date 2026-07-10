import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { communities, resources } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, url, communityId } = body;

  if (!title || !description || !url || !communityId) {
    return NextResponse.json(
      { error: "title, description, url, and communityId are required." },
      { status: 400 },
    );
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "URL must start with http:// or https://." },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Please provide a valid URL." },
      { status: 400 },
    );
  }

  const [community] = await db
    .select({ id: communities.id })
    .from(communities)
    .where(eq(communities.id, communityId));

  if (!community) {
    return NextResponse.json(
      { error: "Community not found." },
      { status: 404 },
    );
  }

  const [resource] = await db
    .insert(resources)
    .values({
      id: crypto.randomUUID(),
      title,
      description,
      url,
      communityId,
    })
    .returning();

  return NextResponse.json(resource, { status: 201 });
}
