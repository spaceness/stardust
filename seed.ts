import { PrismaClient, Arch } from "@prisma/client";
import images from "./images.json";
const prisma = new PrismaClient();

async function main() {
	images.forEach(
		async ({ friendlyName, supportedArch, dockerImage, category, icon }) => {
			await prisma.image.create({
				data: {
					friendlyName,
					supportedArch: supportedArch as Arch[],
					dockerImage,
					category,
					icon,
				},
			});
		},
	);
}
main();
