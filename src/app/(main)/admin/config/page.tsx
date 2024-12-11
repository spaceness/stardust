import { readFile } from "node:fs";
import ConfigEditor from "./editor";

export default async function Page() {
	const configFile = await new Promise<Buffer>((res, rej) =>
		readFile(`${process.cwd()}/.config/config.json`, (err, data) => {
			if (err) rej(err);
			res(data);
		}),
	);
	return (
		<div className="flex h-full flex-col">
			<ConfigEditor current={configFile.toString()} />
		</div>
	);
}
