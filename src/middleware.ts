import { config as authConfig } from "@/lib/auth.config";
import NextAuth from "next-auth";
import { NextResponse} from "next/server"
const { auth } = NextAuth(authConfig);
export const middleware = (auth(async (req) => {
	if (req.auth || req.nextUrl.pathname.startsWith("/auth/login") || req.nextUrl.pathname.startsWith("/auth/error") || req.nextUrl.pathname.startsWith("/auth/verify")) {
		return NextResponse.next();
	}
    const url = new URL("/auth/login", req.url);
		url.searchParams.set("callbackUrl", req.nextUrl.pathname);
		console.log(url.toString())
		return NextResponse.redirect(url);
	
}));
export const config = {
	matcher: ["/((?!_next/static|_next/image|icon.svg|websockify|api/auth|manifest.webmanifest).*)"],
