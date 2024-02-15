type Image = {
  friendlyName: string;
  dockerImage: string;
  supportedArch: string[];
  category: string[];
  icon: string;

}
const images: Image[] = [
  {
    friendlyName: "Chromium",
    dockerImage: "ghcr.io/spaceness/chromium",
    supportedArch: ["amd64", "arm64"],
    category: ["Browser"],
    icon: "https://kasmregistry.linuxserver.io/1.0/icons/chromium.png",
  },
  {
    friendlyName: "Firefox",
    dockerImage: "ghcr.io/spaceness/firefox",
    supportedArch: ["amd64", "arm64"],
    category: ["Browser"],
    icon: "https://kasmregistry.linuxserver.io/1.0/icons/firefox.png",
  },
  {
    friendlyName: "Visual Studio Code",
    dockerImage: "ghcr.io/spaceness/vs-code",
    supportedArch: ["amd64", "arm64"],
    category: ["IDE"],
    icon: "https://registry.kasmweb.com/1.0/icons/vs-code.png",
  },
  {
    friendlyName: "Ubuntu",
    dockerImage: "ghcr.io/spaceness/ubuntu",
    supportedArch: ["amd64", "arm64"],
    category: ["Desktop"],
    icon: "https://registry.kasmweb.com/1.0/icons/ubuntu.png",
  },
];
export default images;
