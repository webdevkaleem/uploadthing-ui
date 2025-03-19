import { NextResponse, type NextRequest } from "next/server";
import { redis } from "@/server/db/redis";
import { redisNameToSlug } from "@/lib/utils";

export async function middleware(request: NextRequest) {
  // Parsing /r/<name>.json
  const slug = redisNameToSlug(
    request.nextUrl.pathname.split("/")[2].split(".")[0],
  );
  // REDIS: Incr Component View
  if (slug.length > 0) {
    try {
      await redis.incr(["component-views", slug].join(":"));
    } catch (error) {
      console.log(
        `Failed to incr component view count | ${slug} | ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  return NextResponse.next();
}

// Running just for /registry/:path* requests
export const config = {
  matcher: "/r/:path*",
};
