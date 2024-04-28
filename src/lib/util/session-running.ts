"use server";
async function sessionRunning(port: number) {
	let containerRunning = await fetch(`http://${process.env.CONTAINER_HOST}:${port}`)
		.then((res) => res.json())
		.then((data) => data.message)
		.catch(() => {});
	while (!containerRunning) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		containerRunning = await fetch(`http://${process.env.CONTAINER_HOST}:${port}`)
			.then((res) => res.json().then((data) => data.message))
			.catch(() => {});
	}
}
export { sessionRunning };
