import { withAuth } from "next-auth/middleware";
export default withAuth({
	pages: {
		signIn: "/auth/login",
		verifyRequest: "/auth/verify",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
});
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - icon.svg (favicon file)
		 */
		"/((?!_next/static|_next/image|icon.svg).*)",
	],
};
