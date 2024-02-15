import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Computer, Settings } from "@/components/icons";
import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuMainLink,
} from "@/components/ui/navigation-menu";
const fontSans = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "stardust",
  description: "Open source kasm alternative powered by spaceness",
  openGraph: {
    title: "stardust",
    description: "Open source kasm alternative powered by spaceness",
    type: "website",
    url: "https://stardust.spaceness.one", // probably going to be a personal website for stardust,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.className} bg-[url('/images/background.jpg')] bg-cover overflow-scroll`}
      >
        <NavigationMenu className="fixed left-1/2 top-12 -translate-x-1/2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuMainLink href="/">
                <Computer className="mr-3" />
                Workspaces
              </NavigationMenuMainLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuMainLink href="/settings">
                <Settings className="mr-3" />
                Settings
              </NavigationMenuMainLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {children}
      </body>
    </html>
  );
}
