import { Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'
import * as Constants from "src/consts"
import { useNavigate } from '@solidjs/router';
import { unauthedClient } from "src/libs/api";
import { AxiosError, AxiosResponse } from 'axios';
import { setToken } from 'src/libs/jwt';
import { Grid, Paper, Stack, Box, Typography, TextField, Button, Alert } from '@suid/material';

type RegisterFormFields = {
	login?: string;
	password?: string;
};

function translateErr(err: AxiosError) {
	return err.response?.data?.message || err.message;
}

async function submit(form: RegisterFormFields, endpoint: string) {
	return new Promise<AxiosResponse>((res, rej) => {
		unauthedClient.post(endpoint, {
			login: form.login,
			password: form.password,
		}).then((resp: AxiosResponse) => {
			res(resp);
		}).catch((why: any) => {
			rej(why);
		})
	})
};

function validateForm(form: RegisterFormFields) {
	if (!form.login) return "Отсутствует логин."
	if (!form.password) return "Отсутствует пароль."

	if (form.login.length > Constants.MAX_LOGIN_LENGTH) {
		return `Логин не может быть длиннее ${Constants.MAX_LOGIN_LENGTH} символов.`;
	}

	if (form.password.length < Constants.MIN_PASSWORD_LENGTH) {
		return `Пароль не может быть короче ${Constants.MIN_PASSWORD_LENGTH} символов.`
	}
}
function useRegisterForm() {
	const [form, setForm] = createStore<RegisterFormFields>({
		login: "",
		password: "",
	});

	const updateField = (fieldName: string) => (event: Event) => {
		const inputElement = event.currentTarget as HTMLInputElement;
		setForm({[fieldName]: inputElement.value});
	};

	return { form, submit, updateField };
};


function RegisterForms() {
	const { form, updateField, submit } = useRegisterForm();
	const [ error, setError ] = createSignal("");
	var sendingRegister = false;
	const navigate = useNavigate();

	async function onRegisterSubmit(e: Event) {
		e.preventDefault();
		if (sendingRegister) return;

		const error = validateForm(form);
		if (error) {
			setError(error);
			return;
		}

		setError("");
		sendingRegister = true;

		submit(form, "/api/v1/auth/register").then((out: AxiosResponse) => {
			setToken(out.data.accessToken);
			navigate("/", { replace: true });
		}).catch((e: any) => {
			setError(translateErr(e));

			var pw = document.getElementById("pwEntry") as HTMLInputElement;
			if (pw) {
				pw.value = "";
				pw.focus();
			}
		}).finally(() => {
			sendingRegister = false;
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
				<Box component="form" onSubmit={onRegisterSubmit} 
						 alignItems="center"
						 p={3}>
					<Typography variant="h3"> 
						Регистрация пользователя
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
									color="primary">
						Регистрация
					</Button>
					<Show when={error()}>
						<Alert severity="error"> {error()} </Alert>
					</Show>
				</Box> 
			</Paper>	
		</Grid> )	
}

export default RegisterForms;

