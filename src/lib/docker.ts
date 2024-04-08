import Dockerode, { DockerOptions } from "dockerode";

const docker = new Dockerode(
	((): DockerOptions => {
		const connectionType = process.env.DOCKER_TYPE;
		if (connectionType === "socket") {
			return {
				socketPath: process.env.DOCKER_SOCKET,
			};
		} else if (connectionType === "http") {
			return {
				port: process.env.DOCKER_PORT,
				protocol: "http",
				host: process.env.DOCKER_HOST,
			};
		} else {
			throw new Error("Invalid docker connection type");
		}
	})(),
);
export default docker;
