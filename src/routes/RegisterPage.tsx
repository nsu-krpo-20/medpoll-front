import RegisterForms from "src/sections/RegisterForms"
import TopBar from "src/components/TopBar"
import './AuthPage.css'

export default function RegisterPage() {
	return (
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopBar />
			</div>

			<div class="flex grow">
				<RegisterForms />
			</div>
		</div>
	)
}
