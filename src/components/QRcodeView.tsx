import { Button } from '@suid/material';
import './TopBar.css'
import { Portal } from "solid-js/web";
import { QRCodeSVG } from "solid-qr-code";
import { Component } from 'solid-js';

interface IQRProps {
	data: string,
	onModalClose?: () => void,
}

const QRCodeView : Component<IQRProps> = (props) => {
	return <div class="flex items-center justify-center">
			<div class="bg-white">
				<QRCodeSVG value={props.data} size={256} />
			</div>
		</div>
}

export default QRCodeView