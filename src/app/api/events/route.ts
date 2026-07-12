import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getAuthUserId } from "@/lib/auth-session";

export async function POST(request: Request) {
    const userId = getAuthUserId(request);

    if(!userId) {
        return NextResponse.json(
            { error: "You must be logged in to create an event." },
            { status: 401 },
        );
    }

    const body = await request.json();
    const { name, description, startTime, endTime, location, communityId } = body;

    if (!name || !description || !startTime || !endTime || !location || !communityId) {
        return NextResponse.json(
            { error: "name, description, startTime, endTime, location, and communityId are required." },
            { status: 400 },
        );
    }

    try {
        const [event] = await db
            .insert(events)
            .values({
                id: crypto.randomUUID(),
                name,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                communityId,
            })
            .returning();
        return NextResponse.json({ event }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Unable to create event." },
            { status: 500 },
        );
    }
}