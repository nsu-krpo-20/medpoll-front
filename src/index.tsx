/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router, Routes } from "@solidjs/router";

import './index.css'
import Main from 'src/routes/Main'
import AuthPage from 'src/routes/AuthPage'
import { UserContext, getUser, UserContextArgs, getExpireData, refreshToken } from './libs/auth';
import { createEffect, createSignal } from 'solid-js';
import * as Constants from "src/consts"

const root = document.getElementById('root')

// https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router
render(() => {
	const [user, setUser] = createSignal(getUser());
	const ctx : UserContextArgs = {user: user, setUser: setUser};

	function requestJWTRefresh() {
		refreshToken()
			.then((newToken) => {
				setUser(getUser()!);
			})
			.catch(console.error);
	}

	function onTokenChanged() {
		/* This hook will handle refreshing the token
		   when it's about to expire automatically */
		const usr = user();
		if (!usr) return; // no token => no refresh

		const [expiresIn] = getExpireData(usr.token);
		if (expiresIn) {
			var grace = Constants.JWT_AUTOREFRESH_GRACE;
			setTimeout(requestJWTRefresh, (expiresIn - grace) * 1000);
		}
	}

	createEffect(onTokenChanged);

	/* We have the effect hook (which will run when the token changes),
	   but we still need to launch the initial refresh timer */
	onTokenChanged();

	return (<Router>
		<UserContext.Provider value={ctx}>
			<Routes>
				<Route path="/" component={Main} />
				<Route path="/login" component={AuthPage} />
			</Routes>
		</UserContext.Provider>
	</Router>)
}, root!)
