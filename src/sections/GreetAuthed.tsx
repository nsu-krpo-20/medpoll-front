import { A } from '@solidjs/router';
import { createSignal } from 'solid-js'
import './GreetAuthed.css'

function GreetAuthed() {
  return ( <>
      <div class="greet h-full w-full flex flex-col justify-center items-center">
		<h1> Здравствуйте! </h1>
		<h2> вы залогинены!!! ура ура ура </h2>
		<A href="/patients">Пациенты</A>
	  </div>
    </> )
}

export default GreetAuthed;
