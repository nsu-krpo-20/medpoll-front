import { createSignal } from 'solid-js'
import LoginForms from "src/sections/LoginForms"
import TopNav from "src/components/TopBar"
import './AuthPage.css'

export default function AuthPage() {
	return (
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="flex grow">
				<LoginForms />
			</div>
		</div>
	)
}