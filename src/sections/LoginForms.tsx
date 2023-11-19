import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'
import * as Constants from "src/consts"
import { useNavigate } from '@solidjs/router';
import { authedClient } from "src/libs/api";
import { AxiosResponse } from 'axios';
import { setToken } from 'src/libs/jwt';

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
		authedClient.post(endpoint, {
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

function LoginForms() {
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

	return ( <>
		<div class="h-full w-full flex justify-center items-center">
			<div class="loginFrame h-fit flex flex-col justify-center items-center">
				<h1> Вход в систему </h1>
				<form class="loginForm flex flex-col" onSubmit={onLoginSubmit}>
					<input type="text" placeholder="Логин" onChange={updateField("login")} />
					<input id="pwEntry" type="password" placeholder="Пароль" onChange={updateField("password")} />

					<input type="submit" value="Вход" name="login" class="mx-4" />
				</form>
				{ error() ? (<>
					<p class="formError"> {error()} </p>
				</>) : null}
			</div>
		</div>
	</> )
}

export default LoginForms;
