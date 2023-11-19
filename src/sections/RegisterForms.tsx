import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'
import * as Constants from "src/consts"
import { useNavigate } from '@solidjs/router';
import { authedClient } from "src/libs/api";
import { AxiosResponse } from 'axios';
import { setToken } from 'src/libs/jwt';

type RegisterFormFields = {
	login?: string;
	password?: string;
};

function translateErr(err: any) {
	/* TODO */
	return err;
}

async function submit(form: RegisterFormFields, endpoint: string) {
	return new Promise<AxiosResponse>((res, rej) => {
		authedClient.post(endpoint, {
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
		return "Пароль не может быть короче ${Constants.MIN_PASSWORD_LENGTH} символов."
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
			setError(translateErr(e.message));

			var pw = document.getElementById("pwEntry") as HTMLInputElement;
			if (pw) {
				pw.value = "";
				pw.focus();
			}
		}).finally(() => {
			sendingRegister = false;
		})
	}

	return ( <>
		<div class="h-full w-full flex justify-center items-center">
			<div class="loginFrame h-fit flex flex-col justify-center items-center">
				<h1> Регистрация </h1>
				<form class="loginForm flex flex-col" 
							onSubmit={onRegisterSubmit}>
					<input type="text" placeholder="Логин" 
								 onChange={updateField("login")} />
					<input id="pwEntry" type="text" placeholder="Пароль" 
									onChange={updateField("password")} />

					<input type="submit" value="Регистрация" name="login" class="mx-4" />
				</form>
				{ error() ? <p class="formError"> {error()} </p>: null}
			</div>
		</div>
	</> )
}

export default RegisterForms;

