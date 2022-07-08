import React from "react";
import "./Icon.css";

type icon = "bar-chart" | "help" | "pending" | "check" | "cross" | "exit" | "sharey" | null;
export default function Icon(props: React.SVGProps<SVGSVGElement> & { iconName: icon }) {
	const { iconName, ...SVGProps } = props;
	switch (props.iconName) {
		case "bar-chart":
			return (
				<svg
					{...SVGProps}
					className="bar-chart-icon icon"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}>
					<path d="M.501 3.081h2.048v6.018H.501zM3.844.501h1.911v8.597H3.844zM7.06 5.414h1.911v3.685H7.06z" />
				</svg>
			);
		case "help":
			return (
				<svg
					{...SVGProps}
					className="help-icon icon"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{
						fillRule: "evenodd",
						clipRule: "evenodd",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeMiterlimit: 1.5,
					}}>
					<circle cx="4.8" cy="4.8" r="4.109" style={{ fill: "none", stroke: "#000", strokeWidth: "1px" }} />
					<text
						x="2.496"
						y="7.475"
						style={{ fontFamily: "'RobotoMono-Bold','Roboto Mono',monospace", fontSize: "7.479px" }}>
						?
					</text>
				</svg>
			);
		case "pending":
			return (
				<svg
					{...SVGProps}
					className="pending-icon icon"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}>
					<rect x="0.358" y="4.8" width="1.9" height="1.9" />
					<rect x="3.85" y="4.8" width="1.9" height="1.9" />
					<rect x="7.342" y="4.8" width="1.9" height="1.9" />
				</svg>
			);
		case "check":
			return (
				<svg
					{...SVGProps}
					className="check-icon icon"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{ fillRule: "evenodd", clipRule: "evenodd", strokeMiterlimit: 1.5 }}>
					<path d="M8.831 1.658 3.037 7.453.769 5.185" style={{ fill: "none", strokeWidth: "1.7px" }} />
				</svg>
			);
		case "cross":
			return (
				<svg
					{...SVGProps}
					className="cross-icon icon"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{ fillRule: "evenodd", clipRule: "evenodd", strokeMiterlimit: 1.5 }}>
					<path d="m1.33 1.33 6.94 6.94M1.33 8.27l6.94-6.94" style={{ fill: "none", strokeWidth: "1.7px" }} />
				</svg>
			);
		case "exit":
			return (
				<svg
					{...SVGProps}
					className="exit-icon icon"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{ fillRule: "evenodd", clipRule: "evenodd", strokeMiterlimit: 1.5 }}>
					<path
						d="m.912.912 7.776 7.776M.912 8.688 8.688.912"
						style={{ fill: "none", stroke: "#515151", strokeWidth: "1.5px" }}
					/>
				</svg>
			);
		case "sharey":
			return (
				<svg
					{...SVGProps}
					className="sharey-icon icon"
					// "sharey" because adblockers don't like the word "share"
					viewBox="0 0 10 10"
					xmlns="http://www.w3.org/2000/svg"
					xmlSpace="preserve"
					style={{ fillRule: "evenodd", clipRule: "evenodd", strokeMiterlimit: 2, strokeLinejoin: "round" }}>
					<path
						d="M2.387 2.981c.336 0 .636-.133.866-.34l3.148 1.832a1.452 1.452 0 0 0-.039.309c0 .106.017.208.039.309L3.288 6.906a1.321 1.321 0 0 0-2.226.968c0 .733.592 1.324 1.325 1.324s1.325-.591 1.325-1.324c0-.106-.018-.208-.04-.31l3.114-1.815a1.323 1.323 0 0 0 2.225-.967 1.322 1.322 0 0 0-2.225-.967L3.641 1.978c.022-.093.036-.19.036-.287a1.29 1.29 0 1 0-1.29 1.29Z"
						style={{ fillRule: "nonzero" }}
					/>
				</svg>
			);
		default:
			return <></>;
	}
}
