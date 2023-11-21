/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router, Routes } from "@solidjs/router";

import './index.css'
import Main from 'src/routes/Main'
import AuthPage from 'src/routes/AuthPage'
import RegisterPage from 'src/routes/RegisterPage'
import PatientsPage from './routes/Patients';

import { getExpireData, refreshToken, jwtToken } from './libs/jwt';
import { createEffect } from 'solid-js';
import * as Constants from "src/consts"
import { ViewPatientPage } from './routes/patients/View';

const root = document.getElementById('root')

// https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router
render(() => {

	function requestJWTRefresh() {
		refreshToken();
	}

	function onTokenChanged() {
		/* This hook will handle refreshing the token
		   when it's about to expire automatically */
		const token = jwtToken();
		if (!token) {
			// The `refreshToken` cookie is HTTPOnly, so we can't know if it expired
			// so we use the EAFP philosophy here and just try to refresh the dang thing blindly

			refreshToken()
				.catch(() => { /* oh well */ });
			return;
		}

		const [expiresIn] = getExpireData(token);
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
		<Routes>
			<Route path="/" component={Main} />
			<Route path="/login" component={AuthPage} />
			<Route path="/patients" component={PatientsPage} />
			<Route path="/patients/view/:id" component={ViewPatientPage} />
			<Route path="/register" component={RegisterPage} />
		</Routes>
	</Router>)
}, root!)
