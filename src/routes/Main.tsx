import { createSignal } from 'solid-js'
import TopNav from "src/components/TopBar"
import GreetUnauthed from "src/sections/GreetUnauthed"
import './Main.css'

function Main() {
  return (
    <>
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="flex grow">
				<GreetUnauthed />
			</div>
		</div>
    </>
  )
}

export default Main
