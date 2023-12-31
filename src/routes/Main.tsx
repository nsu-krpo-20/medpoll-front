import TopBar from "src/components/TopBar"
import { user } from 'src/libs/user'
import GreetAuthed from 'src/sections/GreetAuthed'
import GreetUnauthed from "src/sections/GreetUnauthed"
import './Main.css'

function Main() {
	console.log("User:", user());

	return <div class="w-full h-screen flex flex-col grow">
		<div class="w-full h-12">
			<TopBar />
		</div>

		<div class="flex grow">
			{ user() ? <GreetAuthed /> : <GreetUnauthed /> }
		</div>
	</div>
}

export default Main
