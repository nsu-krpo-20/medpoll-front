import RegisterForms from "src/sections/RegisterForms"
import TopNav from "src/components/TopBar"
import './AuthPage.css'

export default function RegisterPage() {
	return (
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="flex grow">
				<RegisterForms />
			</div>
		</div>
	)
}
