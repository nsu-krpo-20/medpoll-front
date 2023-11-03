import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './LoginForms.css'
import * as Constants from "src/consts"
import { useNavigate } from '@solidjs/router';
import { client } from "src/libs/api";
import { AxiosResponse } from 'axios';
import { getUser, setToken, useUserContext } from 'src/libs/auth';
import { NewCardFields, PatientCard } from 'src/libs/patientcard';

function useNewCardForm() {
	const [form, setForm] = createStore<NewCardFields>({
		fullName: "",
		phoneNumber: null,
		snils: null,
	});

	const updateField = (fieldName: string) => (event: Event) => {
		const inputElement = event.currentTarget as HTMLInputElement;

		setForm({
			[fieldName]: inputElement.value
		});
	};

	return { form, updateField };
};

export {
	useNewCardForm,
}