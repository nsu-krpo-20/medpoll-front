import { useNavigate } from '@solidjs/router';
import { AxiosResponse } from 'axios';
import { Component, Show, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import * as Constants from "src/consts";
import { authedClient, unauthedClient } from "src/libs/api";
import { setToken } from 'src/libs/jwt';
import './LoginForms.css';
import { Alert, Box, Button, Grid, Paper, Stack, TextField, Typography } from '@suid/material';

type LoginFormFields = {
	login?: string;
	password?: string;
	email?: string;
	rememberme: boolean;
};

function translateErr(err: any) {
	/* TODO */
	return err;
}

async function submit(form: LoginFormFields, endpoint: string) {
	return new Promise<AxiosResponse>((res, rej) => {
		unauthedClient.post(endpoint, {
			login: form.login,
			password: form.password,
			email: form.email,
		}).then((resp: AxiosResponse) => {
			res(resp);
		}).catch((why: any) => {
			rej(why);
		})
	})
};

function validateForm(form: LoginFormFields) {
	if (!form.login) return "Отсутствует логин."
	if (!form.password) return "Отсутствует пароль."

	if (form.login.length > Constants.MAX_LOGIN_LENGTH) {
		return `Логин не может быть длиннее ${Constants.MAX_LOGIN_LENGTH} символов.`;
	}

	if (form.password.length < Constants.MIN_PASSWORD_LENGTH) {
		return "Пароль не может быть короче ${Constants.MIN_PASSWORD_LENGTH} символов."
	}
}

function useLoginForm() {
	const [form, setForm] = createStore<LoginFormFields>({
		login: "",
		password: "",
		email: "",
		rememberme: false
	});

	const updateField = (fieldName: string) => (event: Event) => {
		const inputElement = event.currentTarget as HTMLInputElement;

		if (inputElement.type === "checkbox") {
			setForm({
				[fieldName]: !!inputElement.checked
			});
		} else {
			setForm({
				[fieldName]: inputElement.value
			});
		}
	};

	return { form, submit, updateField };
};

const LoginForms: Component<{}> = () => 
{
	const { form, updateField, submit } = useLoginForm();
	const [ error, setError ] = createSignal("");
	var loggingIn = false;
	const navigate = useNavigate();

	async function onLoginSubmit(e: Event) {
		e.preventDefault();
		if (loggingIn) return;

		const error = validateForm(form);
		if (error) {
			setError(error);
			return;
		}

		setError("");
		loggingIn = true;

		submit(form, "/api/v1/auth/login").then((out: AxiosResponse) => {
			setToken(out.data.accessToken);
			// ^ Interfacing with the user context like this isn't the best IMO,
			// maybe there's a better way?
			navigate("/", { replace: true });
		}).catch((e: any) => {
			setError(translateErr(e.message));

			var pw = document.getElementById("pwEntry") as HTMLInputElement;
			if (pw) {
				pw.value = "";
				pw.focus();
			}
		}).finally(() => {
			loggingIn = false;
		})
	}

	return (
		<Grid container
					spacing={0}
  				direction="column"
  				alignItems="center"
 					justifyContent="center"
					maxWidth="sm">
			<Paper component={Stack} 
						 direction="column" 
						 justifyContent="center">
				<Box component="form" onSubmit={onLoginSubmit} 
						 alignItems="center"
						 p={3}>
					<Typography variant="h3"> 
						Вход в систему 
					</Typography>
					<TextField margin="dense" 
										 required
										 fullWidth
										 label="Логин"
										 onChange={updateField("login")} />
					<TextField margin="dense" 
										 required
										 fullWidth
										 label="Пароль"
										 id="pwEntry" 
										 type="password" 
										 onChange={updateField("password")} />

					<Button type="submit"
									fullWidth
									variant="contained"
									color="primary"
									onClick={onLoginSubmit}>
						Вход
					</Button>
					<Show when={error()}>
						<Alert severity="error"> {error()} </Alert>
					</Show>
				</Box> 
			</Paper>	
		</Grid> )
}

export default LoginForms;
