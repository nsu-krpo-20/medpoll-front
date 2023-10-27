import { createSignal } from 'solid-js'
import LoginForms from "src/sections/LoginForms"
import './AuthPage.css'

export default function AuthPage() {
	return (
		<div class="w-full h-screen flex flex-col grow">
			<div class="flex grow">
				<LoginForms />
			</div>
		</div>
	)
}