"use server";
/**
 * While loop for checking if the container is running.
 * @param port The port of the container to check
 */
async function sessionRunning(port: number) {
	let containerRunning = await fetch(`http://${process.env.CONTAINER_HOST}:${port}`)
		.then((res) => res.json())
		.then((data) => data.message)
		.catch(() => {});
	while (!containerRunning) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		containerRunning = await fetch(`http://${process.env.CONTAINER_HOST}:${port}`)
			.then((res) => res.json())
			.then((data) => data.message)
			.catch(() => {});
	}
}
export { sessionRunning };
