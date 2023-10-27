import { createSignal } from 'solid-js'
import './GreetUnauthed.css'

function GreetUnauthed() {
  return ( <>
      <div class="greet h-full w-full flex flex-col justify-center items-center">
		<h1> hi. </h1>
		<h2> please <a href="/login">log in.</a> </h2>
	  </div>
    </> )
}

export default GreetUnauthed;
