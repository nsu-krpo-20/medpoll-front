import { createSignal } from 'solid-js'
import { Router, Route, Routes, A } from "@solidjs/router";
import './GreetUnauthed.css'

function GreetUnauthed() {
  return ( <>
      <div class="greet h-full w-full flex flex-col justify-center items-center">
		<h1> hi. </h1>
		<h2> please <A href="/login">log in.</A> </h2>
	  </div>
    </> )
}

export default GreetUnauthed;
