import { createStore } from 'solid-js/store';
import { NewCardFields } from 'src/libs/patientcard';
import './LoginForms.css';

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
};
