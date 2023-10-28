import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'
import * as Constants from "src/consts"
import { useNavigate } from '@solidjs/router';
import { client } from "src/libs/api";
import { AxiosResponse } from 'axios';

type LoginFormFields = {
	login?: string;
	password?: string;
	email?: string;
	rememberme: boolean;
};

function translateErr(err: any) {
	
}

async function submit(form: LoginFormFields, endpoint: string) {
	const data = {
		login: form.login,
		password: form.password,
		rememberme: form.rememberme
	};

	// should be submitting your form to some backend service
	console.log(`submitting ${JSON.stringify(data)}`);

	return new Promise<AxiosResponse>((res, rej) => {
		client.post(endpoint, {
			login: form.login,
			password: form.password,
			email: form.email,
		}).then((resp: AxiosResponse) => {
			console.log("response:", resp);
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

	const clearField = (fieldName: string) => {
		setForm({ [fieldName]: "" });
	};

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

	return { form, submit, updateField, clearField };
};

function LoginForms() {
	const { form, updateField, submit, clearField } = useLoginForm();
	const [ error, setError ] = createSignal("");
	var loggingIn = false;
	const navigate = useNavigate();

	return ( <>
		<div class="loginFrame h-full w-full flex flex-col justify-center items-center">
			<h1> Вход в систему </h1>
			<form class="loginForm flex flex-col" onSubmit={async (e: Event) => {
				e.preventDefault();
				if (loggingIn) return;

				const error = validateForm(form);
				if (error) {
					setError(error);
					return;
				}

				setError("");

				loggingIn = true;
				try {
					var out = await submit(form, "/api/v1/auth/" + e.submitter.name);
					console.log("ok", out);
					// navigate("/", { replace: true });
				} catch (e) {
					console.log("error", e);
					setError(e.message);
				} finally {
					loggingIn = false;
				}
			}}>
				<input type="text" placeholder="Логин" onChange={updateField("login")} />
				<input type="text" placeholder="Почта" onChange={updateField("email")} />
				<input type="password" placeholder="Пароль" onChange={updateField("password")} />

				<input type="submit" value="Вход" name="login" class="mx-4" />
				<input type="submit" value="Регистрация" name="register" class="mx-4" />
			</form>
			{ error() ? (<>
				<p class="formError"> {error()} </p>
			</>) : null}
		</div>
	</> )
}

export default LoginForms;
