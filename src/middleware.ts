import { withAuth } from "next-auth/middleware";
import authConfig from "@/auth.config";
export default withAuth({
	pages: {
		...authConfig.pages,
	},
});
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|images/background.webp).*)",
	],
};
