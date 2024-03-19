import { withAuth } from "next-auth/middleware"
import authConfig from "@/lib/auth.config";
export default withAuth({
    pages: authConfig.pages,
})