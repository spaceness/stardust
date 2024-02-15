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
const navItems: {
  name: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "Images",
    href: "/images",
    icon: <Computer className="mr-3" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="mr-3" />,
  },
];
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
            {navItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuMainLink
                  href={item.href}
                  className="flex items-center justify-center"
                >
                  {item.icon}
                  {item.name}
                </NavigationMenuMainLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {children}
      </body>
    </html>
  );
}
