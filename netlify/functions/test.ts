import { desc } from "drizzle-orm";
import type { Config, Context } from "@netlify/functions";
import { db } from "../../db";
import { users } from "../../db/schema";

export default async (req: Request, context: Context) => {

  if (req.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

  if (req.method === "GET") {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return Response.json(allUsers);
  }

  if (req.method === "POST") {
    const { name, email } = await req.json();
    const [user] = await db.insert(users).values({ name, email }).returning();

    return Response.json(user, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/users",
};