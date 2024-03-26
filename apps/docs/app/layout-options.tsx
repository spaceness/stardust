import { pageTree } from "./source";
import { type DocsLayoutProps } from "fumadocs-ui/layout";
import { Sparkles } from "lucide-react"
export const layoutOptions: Omit<DocsLayoutProps, "children"> = {
  tree: pageTree,
  nav: {
    title: (
      <>
        <Sparkles />
        <span className="ml-3 font-semibold max-md:hidden">Stardust</span>
      </>
    ),
    transparentMode: "top",
    githubUrl: "https://github.com/z1g-project",
  },
};
