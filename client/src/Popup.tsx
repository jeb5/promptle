import React from "react";
import Icon from "./Icon";
import "./Popup.css";

export default function Popup(props: { title: string; closeAction: () => void; children?: React.ReactNode }) {
	return (
		<>
			<div className="popup-overlay"></div>
			<div className="popup-positioner" onClick={props.closeAction}>
				<div className="popup" onClick={e => e.stopPropagation()}>
					<div className="popup-header-bar">
						<h2>{props.title}</h2>
						<Icon iconName="exit" onClick={props.closeAction} />
					</div>
					<div className="popup-content">{props.children}</div>
				</div>
			</div>
		</>
	);
}
