"use client";
import { cn } from "@/lib/utils";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { XpraClient, XpraWindowManager } from "xpra-html5-client";
import type { XpraClientEventEmitters, XpraConnectionOptions } from "xpra-html5-client";
export interface XpraHandle {
	wm: XpraWindowManager | null;
	client: XpraClient | null;
}
export interface Props {
	ref?: React.Ref<XpraHandle>;
	events?: Partial<XpraClientEventEmitters>;
	connectionOptions: [string, Partial<XpraConnectionOptions>];
	size?: [number, number];
	loader?: React.ReactNode;
	className?: string;
}
export default function XpraScreen({ events, connectionOptions, ref, loader, className, ...props }: Props) {
	const xpraRef = useRef<XpraClient | null>(null);
	const windowManagerRef = useRef<XpraWindowManager | null>(null);
	const divRef = useRef<HTMLDivElement | null>(null);
	const [inited, setInited] = useState(false);
	const [size, setSize] = useState<[number, number]>(props.size || [window.innerWidth, window.innerHeight]);
	useEffect(() => {
		const handler = () => setSize([window.innerWidth, window.innerHeight]);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	useEffect(() => {
		try {
			const worker = new Worker(new URL("./workers/main.ts", import.meta.url));
			const decoder = new Worker(new URL("./workers/decode.ts", import.meta.url));
			xpraRef.current = new XpraClient({ worker, decoder });
			(async () => {
				await xpraRef.current?.init();
				setInited(true);
			})();
			if (inited) {
				if (events) {
					for (const [event, fn] of Object.entries(events)) {
						xpraRef.current.on(event as keyof XpraClientEventEmitters, fn);
					}
				}
				xpraRef.current.connect(...connectionOptions);

				windowManagerRef.current = new XpraWindowManager(xpraRef.current);
				windowManagerRef.current?.init();
				windowManagerRef.current.setDesktopElement(divRef.current);
				windowManagerRef.current.createWindow({
					id: 0,
					position: [0, 0],
					dimension: size,
					metadata: {
						"window-type": ["NORMAL"],
						"class-instance": [],
						title: "Desktop",
					},
					clientProperties: {},
					overrideRedirect: false,
				});
				const win = windowManagerRef.current.getWindow(0);
				if (win?.canvas) {
					divRef.current?.appendChild(win.canvas);
					windowManagerRef.current.maximize(win, [0, 0], size);
					windowManagerRef.current.setActiveWindow(0);
				}
			}
		} catch (e) {
			xpraRef.current?.emit("error", e as string);
		}
		return () => {
			if (!inited) return;
			divRef.current?.querySelector("canvas")?.remove();
			if (events) {
				for (const [event, fn] of Object.entries(events)) {
					xpraRef.current?.off(event as keyof XpraClientEventEmitters, fn);
				}
			}
			xpraRef.current?.disconnect();
			xpraRef.current = null;
		};
	}, [events, connectionOptions, inited, size]);
	useImperativeHandle(ref, () => ({
		wm: windowManagerRef.current,
		client: xpraRef.current,
	}));
	return (
		<>
			{!inited ? loader || "Loading..." : null}
			<div
				className={cn("[&_canvas]:z-20", className)}
				ref={divRef}
				onContextMenu={(e) => e.preventDefault()}
				onMouseUp={(e) => windowManagerRef.current?.mouseButton(null, e.nativeEvent, false)}
				onMouseDown={(e) => windowManagerRef.current?.mouseButton(null, e.nativeEvent, true)}
				onMouseMove={(e) => windowManagerRef.current?.mouseMove(null, e.nativeEvent)}
			/>
		</>
	);
}
