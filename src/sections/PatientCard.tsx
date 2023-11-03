import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'
import * as Constants from "src/consts"
import { useNavigate } from '@solidjs/router';
import { client } from "src/libs/api";
import { AxiosResponse } from 'axios';
import { getUser, setToken, useUserContext } from 'src/libs/auth';
import { PatientCard } from 'src/libs/patientcard';

interface NewCardFields {
	name: string,
	phoneNumber: string | null,
	snils: string | null,
}

async function submit(form: NewCardFields, endpoint: string) {
	const data = {
		
	};

	return new Promise<AxiosResponse>((res, rej) => {
		client.post(endpoint, {
			
		}).then((resp: AxiosResponse) => {
			console.log("response:", resp);
			res(resp);
		}).catch((why: any) => {
			rej(why);
		})
	})
};

function validateForm(form: NewCardFields) {
	
}

function useCardForm() {
	const [form, setForm] = createStore<NewCardFields>({
		name: "",
		phoneNumber: null,
		snils: null,
	});

	const updateField = (fieldName: string) => (event: Event) => {
		const inputElement = event.currentTarget as HTMLInputElement;

		setForm({
			[fieldName]: inputElement.value
		});
	};

	return { form, submit, updateField };
};

function LoginForms() {
	const { form, updateField, submit } = useCardForm();

	return ( <>
		<div class="h-full w-full flex justify-center items-center">
			<div class="loginFrame h-fit flex flex-col justify-center items-center">

				<form class="loginForm flex flex-col">
					<input type="text" placeholder="ФИО" onChange={updateField("name")} />
					<input type="text" placeholder="Номер телефона" onChange={updateField("phoneNumber")} />
					<input type="text" placeholder="Номер СНИЛС" onChange={updateField("snils")} />

					<input type="submit" value="Создать" name="login" class="mx-4" />
				</form>
			</div>
		</div>
	</> )
}

export default LoginForms;
