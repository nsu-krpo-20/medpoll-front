import * as Cards from "src/libs/patientcard";
import { Accessor, createEffect, createSignal, For, JSX, Show, Switch } from "solid-js";
import { Button, TextField } from "@suid/material";
import { Cancel, Edit, Save } from "@suid/icons-material";
import { authedClient } from "src/libs/api";
import { Store } from "solid-js/store";

export function ViewInfo(props: any) : JSX.Element {
	const [editing, setEditing] = createSignal(false);
	const [card, setCard] : [card: Store<Cards.PatientCard>, setCard: any] = props.card;
	const loadingCl = props.loadingCl;

	interface Prop {
		key: keyof Cards.PatientCard,
		name: string,
		maxLength?: number,
		error?: {get: () => boolean | string, set: (v: boolean | string) => void},
		required?: boolean,
		signal?: any,

		validate?: (val: string) => true | string,
	}

	const propToDisplay : Prop[] = [
		{
			key: "fullName",
			name: "ФИО",
			required: true,
			validate: (v: string) => {
				return v.length > 0 || "Отсутствует ФИО!";
			}
		},
		{key: "snils", name: "СНИЛС", maxLength: 14},
		{key: "phoneNumber", name: "Номер телефона", maxLength: 12},
	]

	const propKeyToSignal : {[key: string]: any} = {
		// fullName: propToDisplay[0].signal,
	};

	const placeholder = () => (loadingCl().error ? "Ошибка!" :
	                           loadingCl().loading ? "загрузка..."
							   : "-");

	for (var prop of propToDisplay) {
		const [get, set] = createSignal(card?.[prop.key]);
		prop.signal = {
			get: get,
			set: set,
			reset: () => { set(card?.[prop.key]) }
		}

		const [getErr, setErr] =  createSignal(false);
		prop.error = { get: getErr, set: setErr }
		propKeyToSignal[prop.key] = prop.signal;
	}

	// Use the card's fields to populate the entry fields
	const updatePropsFromCard = () => {
		let cardObj = card;

		for (var prop of propToDisplay) {
			prop.signal.set(cardObj?.[prop.key] || placeholder())
		}
	}

	// Merge the entry fields' contents into the card (the inverse of the above)
	const mergePropsToCard = () => {
		let newValues : any = {};

		for (var prop of propToDisplay) {
			newValues[prop.key] = prop.signal.get();
		}

		setCard(newValues); // Merges only the field values into the Card store
	}

	createEffect(updatePropsFromCard)
	updatePropsFromCard();

	const [commiting, setCommiting] = createSignal(false);

	const cancelEdit = () => {
		updatePropsFromCard(); // reset values to card's
		setEditing(false);
	}

	const confirmEdit = async () => {
		if (!propKeyToSignal.fullName.get()) {
			propKeyToSignal.fullName.error = "Отсутствует ФИО!"
			return;
		}

		setCommiting(true)

		try {
			var ok = await authedClient.put("/api/v1/cards", {
				id: card!.id,
				fullName: propKeyToSignal.fullName.get(),
				snils: propKeyToSignal.snils.get(),
				phoneNumber: propKeyToSignal.phoneNumber.get(),
			})

			setEditing(false);
			mergePropsToCard();
		} catch (e) {
			console.log("failed edit:", e)
		}

		setCommiting(false);
		
		// setEditing(false);
	}

	const startEdit = () => {
		if (loadingCl().error || loadingCl().loading) return;
		setEditing(true);
	}

	return <div class="flex flex-col">
		<h2 class="flex leftHeader w-full">
			<span class="shrink-0 whitespace-nowrap mr-2">Основные данные</span>
			<div class="inline-flex w-fit ml-auto mr-0 items-end justify-center gap-x-4">
				<Show when={editing()}>
					<Button variant="contained" class="" onClick={cancelEdit}>
						<Cancel class="mr-2"/>
						Отмена
					</Button>
					<Button variant="contained" class="" onClick={confirmEdit}>
						<Save class="mr-2"/>
						Сохранить
					</Button>
				</Show>
				<Show when={!editing()}>
					<Button variant="contained" class="float-right"
					        onClick={startEdit} disabled={loadingCl().loading || loadingCl().error}>
						<Edit class="mr-2"/>
						Редактировать
					</Button>
				</Show>
			</div>

		</h2>

		<div class="pl-2 pt-4">
			<For each={propToDisplay}>
				{(disp, i) =>
					<div class="mb-6">
						<TextField  label={disp.name}
						           	value={disp.signal.get()}
						           	InputProps={{
										readOnly: !editing() && !loadingCl().error,
									}}

									// "inputProps are used to pass attributes to the
									//  underlying HTML input element"
									inputProps={{
										maxLength: disp.maxLength,
									}}
									onChange={(ev, val) => {
										disp.signal.set(val); // Set regardless of validation

										var ok = !disp.validate || disp.validate(val);
										// But if validation fails, display error
										if (ok != true) {
											disp.error!.set(ok);
										} else {
											disp.error!.set(false);
										}
									}}

									error={loadingCl().error || disp.error!.get()}
									helperText={disp.error!.get()}
									size="small"
									required={disp.required}
									fullWidth
									disabled={!editing() && !loadingCl().error}
								   	variant="outlined">
						</TextField>
					</div>
				}
			</For>
		</div>
	</div>
}