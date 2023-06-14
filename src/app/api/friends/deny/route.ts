import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const session = await getServerSession(authOptions);
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        };

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

        return new Response("Success!");

    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }
        return new Response("Invalid request",{status:400});
    }
}