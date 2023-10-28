/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router, Routes } from "@solidjs/router";

import './index.css'
import Main from 'src/routes/Main'
import AuthPage from 'src/routes/AuthPage'

const root = document.getElementById('root')

// https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router
render(() => (
	<Router>
		<Routes>
			<Route path="/" component={Main} />
			<Route path="/login" component={AuthPage} />
		</Routes>
		
	</Router>
), root!)
