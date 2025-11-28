import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verify } from "./backend/middlewares/jose";

export async function middleware(request: NextRequest) {
  // if (process.env.NODE_ENV === "development") {
  //   return NextResponse.next(); // Skip authentication in development
  // }

  const cookies = request.cookies;
  const secret = process.env.JWT_SECRET;
  const path = request.nextUrl.pathname;

  const token = cookies.get("token");
  
  // Allow POST requests to /api/users for signup (no token required)
  if (request.method === "POST" && path === "/api/users") {
    return NextResponse.next();
  }
  
  if (
    token &&
    secret &&
    !path.startsWith("/login") &&
    path !== "/reset-password" &&
    path !== "/signup"
  ) {
    const user = await verify(token.value, secret);
    if (user) {
      // Handle admin access
      if (user.admin) {
        if (path.startsWith("/login") || path === "/") {
          return NextResponse.redirect(new URL("/admin", request.url));
        } else if (
          user.role === "subadmin" &&
          (user.excludedModules?.some((mod) =>
            path.startsWith(`/admin/${mod.toLowerCase()}`)
          ) ||
            user.excludedModules?.some((mod) =>
              path.startsWith(`/api/${mod.toLowerCase()}`)
            ))
        ) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        } else if (path.startsWith("/user")) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        } else if (user.role === "subadmin" && path.endsWith("/admin")) {
          return NextResponse.redirect(new URL("/admin/library", request.url));
        } else {
          // Allow admin to access all other endpoints including user management
          return NextResponse.next();
        }
      }

      // Handle user access
      if (!user.admin) {
        if (path.startsWith("/login") || path === "/") {
          return NextResponse.redirect(new URL("/user", request.url));
        } else if (path.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        } else if (!path.startsWith("/api")) {
          return NextResponse.next();
        } else {
          if (
            (request.method === "PUT" || request.method === "DELETE") &&
            /^\/api\/users\/[^\/]+$/.test(path)
          ) {
            const userIdFromPath = path.split("/")[3]; // Extract the ID from the URL
            if (userIdFromPath === user.id) {
              // Allow PUT requests if the user is updating their own profile
              return NextResponse.next();
            } else {
              return NextResponse.json(
                { message: "unauthorized" },
                { status: 403 }
              );
            }
          }

          if (request.method !== "GET") {
            if (
              path.startsWith("/api/favourites") ||
              path.startsWith("/api/users/question-status") ||
              path.startsWith("/api/users/quiz-status") ||
              path.startsWith("/api/users/note-status") ||
              path.startsWith("/api/users/video-status") ||
              path.startsWith("/api/users/check-email") ||
              path.startsWith("/api/users/feedback") ||
              path.startsWith("/api/users/validate")
            ) {
              return NextResponse.next();
            }
            return NextResponse.json(
              { message: "unauthorizedddd" },
              { status: 403 }
            );
          }

          if (
            !(
              path.startsWith("/api/settings") ||
              path.startsWith("/api/videoCourses") ||
              path.startsWith("/api/quizes") ||
              path.startsWith("/api/favourites") ||
              path.endsWith("/packages") ||
              path.endsWith("/note-status") ||
              path.endsWith("/video-status") ||
              path.endsWith("/quiz-status") ||
              path.endsWith("/question-status")
            )
          ) {
            return NextResponse.json(
              { message: "unauthorized" },
              { status: 403 }
            );
          } else if (/^\/api\/videoCourses\/[^\/]+$/.test(path)) {
            const id = path.split("/")[3];
            const whitelistedCourses = user.courses;

            const allowed = whitelistedCourses.find((course) =>
              course ? course.type === "video" && course._id === id : false
            );
            if (allowed) {
              return NextResponse.next();
            } else {
              return NextResponse.json(
                { message: "unauthorized" },
                { status: 403 }
              );
            }
          } else if (/^\/api\/quizes\/[^\/]+$/.test(path)) {
            const id = path.split("/")[3];
            const whitelistedCourses = user.courses;

            const allowed = whitelistedCourses.find((course) =>
              course ? course.type === "quiz" && course._id === id : false
            );
            if (allowed) {
              return NextResponse.next();
            } else {
              return NextResponse.json(
                { message: "unauthorized" },
                { status: 403 }
              );
            }
          }
        }
      }
    } else if (!path.startsWith("/login") && path !== "/reset-password" && path !== "/signup") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (!path.startsWith("/login") && path !== "/reset-password" && path !== "/signup") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/users/login|api/users/reset-password|api/users/validate|api/users/logout|_next/static|_next/image|public|favicon.ico|reset-password|signup).*)",
  ],
};
