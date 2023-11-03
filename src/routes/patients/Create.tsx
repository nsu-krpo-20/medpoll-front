import { createSignal } from 'solid-js'
import TopNav from "src/components/TopBar"
import { useUserContext } from 'src/libs/auth'
import './Create.css'

function Main() {

	return (<>
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="flex grow">
				pagchomperz
			</div>
		</div>
	</> )
}

export default Main
