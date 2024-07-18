import Dockerode from "dockerode";
import { getConfig } from "./config";
const { docker: config } = getConfig();
const docker = new Dockerode(
	(() => ({
		socketPath: !config.type || config.type === "socket" ? config.socket || "/var/run/docker.sock" : undefined,
		host: config.type === "http" ? config.host : undefined,
		port: config.type === "http" ? config.port : undefined,
		protocol: config.type === "http" ? "http" : undefined,
	}))(),
);
export default docker;
