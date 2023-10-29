import { createSignal } from 'solid-js'
import TopNav from "src/components/TopBar"
import { useUserContext } from 'src/libs/auth'
import GreetAuthed from 'src/sections/GreetAuthed'
import GreetUnauthed from "src/sections/GreetUnauthed"
import './Main.css'

function Main() {
	const { user } = useUserContext();
	console.log("User:", user());

  return (
    <>
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="flex grow">
				{ user() ? <GreetAuthed /> : <GreetUnauthed /> }
			</div>
		</div>
    </>
  )
}

export default Main
