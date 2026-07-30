import { NextResponse } from "next/server";
import { db } from "@/db";
import { eventRSVPs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getAuthUserId } from "@/lib/auth-session";

export async function POST(
    request: Request,
    context: { params: Promise<{ eventId: string}> },
) {
    const { eventId } = await context.params;
    const userId = getAuthUserId(request);

    if(!userId) {
        return NextResponse.json(
            { error: "You must be logged in to RSVP." },
            { status: 401 },
        );
    }

    const existingRSVPs = await db
        .select()
        .from(eventRSVPs)
        .where(
            and(
                eq(eventRSVPs.eventId, eventId),
                eq(eventRSVPs.userId, userId),
            ),
        )
        .then((rows) => rows[0]);

    const referer = request.headers.get("referer") ?? "/";

    if(existingRSVPs) {
        return NextResponse.redirect(referer, { status: 303 });
    } 
    await db
        .insert(eventRSVPs)
        .values({
            id: crypto.randomUUID(),
            eventId,
            userId,
        })
    return NextResponse.redirect(referer, { status: 303 });

    

} 
    
    

    



