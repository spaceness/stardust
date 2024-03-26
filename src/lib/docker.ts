import Dockerode from "dockerode";
const docker = new Dockerode({
	port: process.env.DOCKER_PORT,
	protocol: "http",
	host: process.env.DOCKER_HOST,
});
export default docker;
