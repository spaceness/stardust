/**
 * Guidelines to add icons to this file:
 *
 * 1. Get the SVG of a Lucide-like icon, either from the Lucide website or from a custom icon
 *    following the Lucide design conventions.
 *
 * 2. Paste it in Figma or a similar SVG editor
 *
 * 3. Important: Flatten the SVG because we need the paths to be alpha-friendly
 *
 * 4. Copy the content of the flattened SVG and paste to SVGOMG https://jakearchibald.github.io/svgomg/
 *
 * 5. Copy the content of the optimized SVG and paste it in the `createIcon` call below
 *
 * 6. Remove the wrapping `<svg>` tag, and remove unnecessary attributes (such as stroke-linecap)
 *    from the `<path>` tags
 */
import { cn } from "@/lib/cn";

function createIcon(
	name: string,
	svgContent: React.ReactNode,
	withStrokeCurrent = true,
) {
	const icon = ({ className, ...props }: React.ComponentProps<"svg">) => (
		<svg
			{...props}
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			className={cn(
				className,
				"[&_path]:stroke-2 [&_path]:[stroke-linecap:round] [&_path]:[stroke-linejoin:round]",
				withStrokeCurrent && "[&_path]:stroke-current",
			)}
		>
			{svgContent}
		</svg>
	);
	icon.displayName = name;
	return icon;
}

export const AlignJustify = createIcon(
	"AlignJustify",
	<path d="M3 6h18M3 12h18M3 18h18" />,
);

export const ArrowDownUp = createIcon(
	"ArrowDownUp",
	<path d="m3 16 4 4m0 0 4-4m-4 4V4m14 4-4-4m0 0-4 4m4-4v16" />,
);

export const Atom = createIcon(
	"Atom",
	<>
		<mask id="a">
			<rect width="24" height="24" fill="black" />
			<path stroke="white" d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
			<path
				stroke="white"
				d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"
			/>
			<path
				stroke="white"
				d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"
			/>
		</mask>
		<rect width="24" height="24" fill="currentColor" mask="url(#a)" />
	</>,
	false,
);

export const Calendar = createIcon(
	"Calendar",
	<path d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
);

export const Check = createIcon("Check", <path d="M20 6 9 17l-5-5" />);

export const CheckCircle = createIcon(
	"CheckCircle",
	<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M9 11l3 3L22 4" />,
);

export const ChevronDown = createIcon("ChevronDown", <path d="m6 9 6 6 6-6" />);

export const ChevronLeft = createIcon(
	"ChevronLeft",
	<path d="m15 18-6-6 6-6" />,
);

export const ChevronRight = createIcon(
	"ChevronRight",
	<path d="m9 18 6-6-6-6" />,
);

export const ChevronsRight = createIcon(
	"ChevronsRight",
	<path d="m6 17 5-5-5-5m7 10 5-5-5-5" />,
);

export const Circle = createIcon(
	"Circle",
	<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />,
);

export const Cloud = createIcon(
	"Cloud",
	<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
);

export const Code = createIcon(
	"Code",
	<path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
);

export const Copy = createIcon(
	"Copy",
	<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2m-6 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />,
);

export const Coffee = createIcon(
	"Coffee",
	<path d="M17 8h1a4 4 0 1 1 0 8h-1m0-8H3v9a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8ZM6 2v2m4-2v2m4-2v2" />,
);

export const CreditCard = createIcon(
	"CreditCard",
	<path d="M2 10h20M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
);

export const ExternalLink = createIcon(
	"ExternalLink",
	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6m0 0v6m0-6L10 14" />,
);

export const FlaskConical = createIcon(
	"FlaskConical",
	<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7M7 16h10" />,
);

export const Film = createIcon(
	"Film",
	<path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18m0-13.5h4m-4 9h4M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />,
);

export const Gamepad2 = createIcon(
	"Gamepad2",
	<path d="M6 11h4M8 9v4m7-1h.01M18 10h.01m-.69-5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5Z" />,
);

export const GitHub = createIcon(
	"GitHub",
	<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85m0 0v4m0-4c-4.51 2-5-2-7-2" />,
);

export const Heart = createIcon(
	"Heart",
	<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7Z" />,
);

export const Link = createIcon(
	"Link",
	<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
);

export const List = createIcon(
	"List",
	<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
);

export const LogOut = createIcon(
	"LogOut",
	<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5m0 0-5-5m5 5H9" />,
);

export const Mail = createIcon(
	"Mail",
	<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7m2-3h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
);

export const Menu = createIcon("Menu", <path d="M4 12h16M4 6h16M4 18h16" />);

export const MessageSquare = createIcon(
	"MessageSquare",
	<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
);

export const MessageCircle = createIcon(
	"MessageCircle",
	<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22l5.9-2Z" />,
);

export const Move3d = createIcon(
	"Move3d",
	<path d="M5 3v16M5 3 2 6m3-3 3 3M5 19h16M5 19l6-6m10 6-3-3m3 3-3 3" />,
);

export const Music = createIcon(
	"Music",
	<path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
);

export const Pause = createIcon(
	"Pause",
	<path d="M10 4H6v16h4V4ZM18 4h-4v16h4V4Z" />,
);

export const PauseCircle = createIcon(
	"PauseCircle",
	<path d="M10 15V9m4 6V9m8 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />,
);

export const Pencil = createIcon(
	"Pencil",
	<path d="m15 5 4 4m-2-6a2.847 2.847 0 0 1 2.064-1.007 2.868 2.868 0 0 1 2.14.834 2.827 2.827 0 0 1 .825 2.131A2.814 2.814 0 0 1 21 7L7.5 20.5 2 22l1.5-5.5L17 3Z" />,
);

export const Play = createIcon("Play", <path d="m5 3 14 9-14 9V3Z" />);

export const PlayCircle = createIcon(
	"PlayCircle",
	<>
		<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
		<path d="m10 8 6 4-6 4V8Z" />
	</>,
);

export const Plus = createIcon("Plus", <path d="M5 12h14m-7-7v14" />);

export const PlusCircle = createIcon(
	"PlusCircle",
	<path d="M8 12h8m-4-4v8m10-4c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />,
);

export const Repeat = createIcon(
	"Repeat",
	<path d="m17 2 4 4m0 0-4 4m4-4H7a4 4 0 0 0-4 4v1m4 11-4-4m0 0 4-4m-4 4h14a4 4 0 0 0 4-4v-1" />,
);

export const Reply = createIcon(
	"Reply",
	<path d="m9 17-5-5m0 0 5-5m-5 5h12a4 4 0 0 1 4 4v2" />,
);

export const RotateCcw = createIcon(
	"RotateCcw",
	<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5" />,
);

export const Save = createIcon(
	"Save",
	<path d="M17 21v-8H7v8M7 3v5h8m4 13H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />,
);

export const Share = createIcon(
	"Share",
	<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6-4-4m0 0L8 6m4-4v13" />,
);

export const Sigma = createIcon("Sigma", <path d="M18 7V4H6l6 8-6 8h12v-3" />);

export const Smile = createIcon(
	"Smile",
	<path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />,
);

export const StopCircle = createIcon(
	"StopCircle",
	<>
		<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
		<path d="M15 9H9v6h6V9Z" />
	</>,
);

export const Swords = createIcon(
	"Swords",
	<path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6m-3 3 4 4m-1 1 2-2M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4m-2-1-3 3m-1-1 2 2" />,
);

export const Text = createIcon("Text", <path d="M17 6.1H3m18 6H3M15.1 18H3" />);

export const Trash = createIcon(
	"Trash",
	<path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />,
);

export const Twitter = createIcon(
	"Twitter",
	<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2Z" />,
);

export const Tv2 = createIcon(
	"Tv2",
	<path d="M7 21h10M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />,
);

export const User = createIcon(
	"User",
	<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
);

export const UserPlus = createIcon(
	"UserPlus",
	<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6m3-3h-6m-3-4a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
);

export const X = createIcon("X", <path d="M18 6 6 18M6 6l12 12" />);

export const XCircle = createIcon(
	"XCircle",
	<path d="m15 9-6 6m0-6 6 6m7-3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />,
);

export const App = createIcon(
	"App",
	<>
		<path
			fill="currentColor"
			stroke="currentColor"
			d="M2 1.5h-.5v6h6v-6H2Zm11 0h-.5v6h6v-6H13Zm0 11h-.5v6h6v-6H13Zm-11 0h-.5v6h6v-6H2ZM.5 2A1.5 1.5 0 0 1 2 .5h5A1.5 1.5 0 0 1 8.5 2v5A1.5 1.5 0 0 1 7 8.5H2A1.5 1.5 0 0 1 .5 7V2Zm11 0A1.5 1.5 0 0 1 13 .5h5A1.5 1.5 0 0 1 19.5 2v5A1.5 1.5 0 0 1 18 8.5h-5A1.5 1.5 0 0 1 11.5 7V2Zm0 11a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-5Zm-11 0A1.5 1.5 0 0 1 2 11.5h5A1.5 1.5 0 0 1 8.5 13v5A1.5 1.5 0 0 1 7 19.5H2A1.5 1.5 0 0 1 .5 18v-5Z"
		/>
	</>,
	false,
);
export const Settings = createIcon(
	"Settings",
	<>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
		/>
	</>,
);
export const Computer = createIcon(
	"Computer",
	<>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
		/>
	</>,
);
export const Discord = createIcon(
	"Discord",
	<>
		<path
			className="fill-current"
			d="M8.52062 13.8456C7.48059 13.8456 6.63159 12.9011 6.63159 11.7444 6.63159 10.5876 7.45936 9.64307 8.52062 9.64307 9.57123 9.64307 10.4308 10.5876 10.4096 11.7444 10.4096 12.9011 9.57123 13.8456 8.52062 13.8456ZM15.4941 13.8456C14.454 13.8456 13.604 12.9011 13.604 11.7444 13.604 10.5876 14.4328 9.64307 15.4941 9.64307 16.5447 9.64307 17.4043 10.5876 17.3831 11.7444 17.3831 12.9011 16.5553 13.8456 15.4941 13.8456ZM10.1253 4.32272 9.81655 3.75977 9.18323 3.86532C7.71915 4.10934 6.32658 4.54652 5.02544 5.1458L4.79651 5.25124 4.65507 5.45985C2.0418 9.31417 1.3258 13.1084 1.68032 16.836L1.71897 17.2423 2.04912 17.4822C3.78851 18.7463 5.47417 19.5186 7.12727 20.0254L7.91657 20.2674 9.03013 17.5504C10.9397 18.0224 13.0592 18.0225 14.969 17.5508L16.0757 20.2681 16.8668 20.0254C18.5173 19.5191 20.2137 18.7469 21.9466 17.4809L22.2726 17.2428 22.3131 16.8412C22.7491 12.521 21.616 8.75749 19.3547 5.45628L19.2128 5.2492 18.9846 5.1448C17.6767 4.5466 16.2852 4.10957 14.8309 3.86549L14.2132 3.76182 13.8987 4.30344C13.8112 4.4542 13.7215 4.6244 13.6364 4.79662 12.5441 4.68445 11.456 4.68421 10.3726 4.79627 10.2882 4.62711 10.2025 4.46356 10.1253 4.32272ZM6.71436 16.61C6.91235 16.724 7.11973 16.8356 7.32557 16.9378L6.8764 18.0338C5.75585 17.6256 4.61837 17.0635 3.4476 16.2555 3.22313 13.1175 3.86092 9.95075 6.01196 6.68602 6.90962 6.29099 7.8535 5.98255 8.83606 5.77271 8.89631 5.89807 8.95235 6.02042 8.99839 6.12892L9.27128 6.77213 9.96259 6.67074C11.3152 6.47235 12.6772 6.47209 14.0523 6.671L14.7424 6.77082 15.0147 6.12892C15.0621 6.01719 15.1167 5.89523 15.1743 5.77298 16.1525 5.98301 17.098 6.29188 18.0029 6.68787 19.8781 9.50833 20.8241 12.6541 20.5486 16.255 19.3837 17.0623 18.2422 17.6246 17.1193 18.0333L16.6735 16.9387C16.8799 16.8362 17.0879 16.7243 17.2865 16.61 17.7763 16.3277 18.3039 15.9757 18.6402 15.6395L17.3606 14.36C17.1969 14.5237 16.837 14.7805 16.3831 15.0421 15.9388 15.2981 15.498 15.5049 15.2164 15.598 13.2126 16.2606 10.7883 16.2606 8.78443 15.598 8.50285 15.5049 8.06205 15.2981 7.61772 15.0421 7.16383 14.7805 6.80392 14.5237 6.64017 14.36L5.36065 15.6395C5.6969 15.9757 6.2245 16.3277 6.71436 16.61Z"
		/>
	</>,
);
