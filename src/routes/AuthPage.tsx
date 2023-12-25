import LoginForms from "src/sections/LoginForms"
import TopBar from "src/components/TopBar"
import './AuthPage.css'

export default function AuthPage() {
	return (
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopBar />
			</div>

			<div class="flex grow">
				<LoginForms />
			</div>
		</div>
	)
}