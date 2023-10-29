import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js'
import { useUserContext } from 'src/libs/auth';
import './TopBar.css'

function UserDisplay() {
	const { user } = useUserContext();
	return (
		<div class="userDisplay flex items-center justify-end ml-auto mr-2">
			<h1> Имя Именович (без имени, пока что) </h1>
		</div>
	)
}

function LoginButton() {
	const navigate = useNavigate();

	return (
		<button class="loginButton flex h-full w-fit px-4 ml-auto mr-2"
			onClick={() => navigate("/login")}>
			Вход
		</button>
	)
}

function TopBar() {
	const { user } = useUserContext();

  return ( <>
      <header class="topbar h-full">
		<h1> MedPoll </h1>
		{ user() ? <UserDisplay /> : <LoginButton /> }
	  </header>
    </> )
}

export default TopBar;
