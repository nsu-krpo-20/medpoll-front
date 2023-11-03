/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router, Routes } from "@solidjs/router";

import './index.css'
import Main from 'src/routes/Main'
import AuthPage from 'src/routes/AuthPage'
import { UserContext, getUser, UserContextArgs } from './libs/auth';
import { createSignal } from 'solid-js';
import PatientsPage from './routes/Patients';
import CreatePatientPage from './routes/Patients/Create';

const root = document.getElementById('root')

// https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router
render(() => {
	const [user, setUser] = createSignal(getUser());
	const ctx : UserContextArgs = {user: user, setUser: setUser};
	
	return (<Router>
		<UserContext.Provider value={ctx}>
			<Routes>
				<Route path="/" component={Main} />
				<Route path="/login" component={AuthPage} />
				<Route path="/patients" component={PatientsPage} />
				<Route path="/patients/create" component={CreatePatientPage} />
			</Routes>
		</UserContext.Provider>
	</Router>)
}, root!)
