import { Button } from '@suid/material';
import './TopBar.css'
import { Portal } from "solid-js/web";
import { QRCodeSVG } from "solid-qr-code";

export default function QRCodeView(props: any) {
	return <Portal mount={document.body}>
		<div id="qr-modal" class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex flex-col min-h-full justify-center items-center p-4 text-center bg-gray-500 bg-opacity-75 space-y-4 pb-4">
      	<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
					<div class="sm:flex sm:items-start">
						<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
							<QRCodeSVG value={props.data} size={256} />
						</div>
					</div>
	        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<Button class="inline-flex w-full justify-center rounded-md" variant="contained" color="success" onClick={props.onModalClose}>Закрыть</Button>
					</div>
				</div>
			</div>
		</div>
	</Portal>
}
