"use client";
import Editor from "@monaco-editor/react";
export default function ConfigEditor({ current }: { current: string }) {
	return (
		<Editor
			defaultLanguage="json"
			className="size-[90vh]"
			defaultValue={current}
			theme="vs-dark"
			defaultPath="repo://.config/config.json"
		/>
	);
}
