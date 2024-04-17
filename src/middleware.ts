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
	matcher: ["/((?!_next/static|_next/image|icon.svg|api/vnc).*)"],
};
