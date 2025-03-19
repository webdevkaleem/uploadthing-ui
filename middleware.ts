import { NextResponse, type NextRequest } from "next/server";
import { redis } from "@/server/db/redis";
import { redisNameToSlug } from "@/lib/utils";

export async function middleware(request: NextRequest) {
  const slug = redisNameToSlug(
    request.nextUrl.pathname.split("/")[2].split(".")[0],
  );
  // REDIS: Incr Component View
  if (slug.length > 0) await redis.incr(["component-views", slug].join(":"));

  return NextResponse.next();
}

// Running just for /registry/:path* requests
export const config = {
  matcher: "/r/:path*",
};
