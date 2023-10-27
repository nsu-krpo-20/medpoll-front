import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'

type LoginFormFields = {
	login?: string;
	password?: string;
	rememberme: boolean;
};

function submit(form: LoginFormFields) {
	const data = {
		login: form.login,
		password: form.password,
		rememberme: form.rememberme
	};

	// should be submitting your form to some backend service
	console.log(`submitting ${JSON.stringify(data)}`);
};

function useLoginForm() {
	const [form, setForm] = createStore<LoginFormFields>({
		login: "",
		password: "",
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

	return ( <>
		<div class="loginFrame h-full w-full flex flex-col justify-center items-center">
			<h1> Вход в систему </h1>
			<form class="loginForm flex flex-col" onSubmit={(e: Event) => {
				e.preventDefault();
				submit(form);
			}}>
				<input type="text" placeholder="Логин" onChange={updateField("login")} />
				<input type="password" placeholder="Пароль" onChange={updateField("password")} />

				<input type="submit" value="Вход" class="mx-4" />
			</form>
		</div>
	</> )
}

export default LoginForms;
