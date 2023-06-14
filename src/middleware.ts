import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname;

        //manage route protection
        const isAuth = await getToken({ req });
        const isLoginPage = pathname.startsWith("/login");

        const sensitiveRoutes = ["/dashboard"];
        const isAccessingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route));

        if (isLoginPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            };

            return NextResponse.next();
        }
        if (!isAuth && isAccessingSensitiveRoute) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        };

        if (pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        };
    },{
        //to avoid infenite redirects
      callbacks:{
        async authorized(){
            return true
        },
      },
    }
);

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*"]
}