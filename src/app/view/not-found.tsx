export default function NotFound() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-6xl font-bold">404</h1>
				<p className="text-lg text-muted-foreground">Session not found</p>
			</div>
		</div>
	);
}
