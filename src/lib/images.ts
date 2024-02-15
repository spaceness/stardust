type Image = {
  [key: string]: {
    friendlyName: string;
    image: string;
    supportedArch: string[];
    category: string[];
    icon: string;
  };
}
const images: Image = {
  chromium: {
    friendlyName: "Chromium",
    image: "lscr.io/linuxserver/chromium:latest",
    supportedArch: ["amd64", "arm64"],
    category: ["Browser"],
    icon: "https://kasmregistry.linuxserver.io/1.0/icons/chromium.png",
  },
  firefox: {
    friendlyName: "Mozilla Firefox",
    image: "lscr.io/linuxserver/firefox:latest",
    supportedArch: ["amd64", "arm64"],
    category: ["Browser"],
    icon: "https://kasmregistry.linuxserver.io/1.0/icons/firefox.png",
  },
  vscode: {
    friendlyName: "Visual Studio Code",
    image: "kasmweb/vs-code:1.15.0",
    supportedArch: ["amd64", "arm64"],
    category: ["IDE"],
    icon: "https://registry.kasmweb.com/1.0/icons/vs-code.png",
  },
  archKde: {
    friendlyName: "Arch Linux - KDE",
    image: "lscr.io/linuxserver/webtop:arch-kde",
    supportedArch: ["amd64", "arm64"],
    category: ["Desktop"],
    icon: "https://kasmregistry.linuxserver.io/1.0/icons/arch-kde.png",
  },
  debian: {
    friendlyName: "Debian - KDE",
    image: "lscr.io/linuxserver/webtop:debian-kde",
    supportedArch: ["amd64", "arm64"],
    category: ["Desktop"],
    icon: "https://kasmregistry.linuxserver.io/1.0/icons/debian-kde.png",
  },
};
export default images;
