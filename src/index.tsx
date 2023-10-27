/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router, Routes } from "@solidjs/router";

import './index.css'
import Main from 'src/routes/Main'
import AuthPage from 'src/routes/AuthPage'

const root = document.getElementById('root')

render(() => (
	<Router>
		<Routes>
			<Route path="/" component={Main} />
			<Route path="/login" component={AuthPage} />
		</Routes>
		
	</Router>
), root!)
