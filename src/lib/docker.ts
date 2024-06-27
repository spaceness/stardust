import Dockerode from "dockerode";
const docker = new Dockerode({
	socketPath:
		!process.env.DOCKER_TYPE || process.env.DOCKER_TYPE === "socket"
			? process.env.DOCKER_SOCKET || "/var/run/docker.sock"
			: undefined,
	host: process.env.DOCKER_TYPE === "http" ? process.env.CONTAINER_HOST : undefined,
	port: process.env.DOCKER_TYPE === "http" ? process.env.DOCKER_PORT : undefined,
	protocol: process.env.DOCKER_TYPE === "http" ? "http" : undefined,
});
export default docker;
