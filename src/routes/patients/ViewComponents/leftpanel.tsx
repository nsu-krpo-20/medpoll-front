import * as Cards from "src/libs/patientcard";
import { Accessor, createEffect, createSignal, For, JSX, Show, Switch } from "solid-js";
import { Button, TextField } from "@suid/material";
import { Cancel, Edit, Save } from "@suid/icons-material";

export function ViewInfo(props: any) : JSX.Element {
	const [editing, setEditing] = createSignal(false);
	const card : Accessor<Cards.PatientCard | null> = props.card;
	const loadingCl = props.loadingCl;

	const propToDisplay : {key: string, name: string, maxLength?: number, signal?: any}[] = [ /* will have `.get` and `.set` for signals */
		{key: "fullName", name: "ФИО"},
		{key: "snils", name: "СНИЛС", maxLength: 14},
		{key: "phoneNumber", name: "Номер телефона", maxLength: 11},
	]

	const placeholder = () => (loadingCl().loading ? "загрузка..." : "-");

	createEffect(() => {
		console.log("is editing?", editing());
	})

	for (var prop of propToDisplay) {
		const [get, set] = createSignal(card()?.[prop.key as keyof Cards.PatientCard]);
		prop.signal = {
			get: get,
			set: set,
			reset: () => { set(card()?.[prop.key as keyof Cards.PatientCard]) }
		}
	}

	const updateFromCard = () => {
		let cardObj = card();

		for (var prop of propToDisplay) {
			prop.signal.set(cardObj?.[prop.key as keyof Cards.PatientCard] || placeholder())
		}
	}

	createEffect(updateFromCard)
	updateFromCard();

	const cancelEdit = () => {
		updateFromCard(); // reset values to card's
		setEditing(false);
	}

	const confirmEdit = () => {
		// TODO
		setEditing(false);
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
					<Button variant="contained" class="float-right" onClick={() => setEditing(true)}>
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
						           	InputProps={{readOnly: !editing()}}
									inputProps={{maxLength: disp.maxLength}} // WHY ARE THEY DIFFERENT WTF
									onChange={(ev, val) => {
										disp.signal.set(val)
									}}
									size="small"
									fullWidth
									disabled={!editing()}
								   	variant="outlined">
						</TextField>
					</div>
				}
			</For>
		</div>
	</div>
}