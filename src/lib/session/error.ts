export function dockerErrCatcher(e: Error) {
	if (!e.message?.includes("No such container")) {
		throw e;
	}
}
