import * as Cards from "src/libs/patientcard";
import { Accessor, createSignal, JSX } from "solid-js";
import { Button } from "@suid/material";
import { Edit } from "@suid/icons-material";

export function ViewInfo(props) : JSX.Element {
	const [editing, setEditing] = createSignal(false);
	const card : Accessor<Cards.PatientCard | null> = props.card;
	const loadingCl = props.loadingCl;

	const propToDisplay = [
		{key: "fullName", name: "ФИО"},
		{key: "snils", name: "СНИЛС"},
		{key: "phoneNumber", name: "Номер телефона"},
	]

	const placeholder = () => (loadingCl().loading ? "загрузка..." : "-");

	return <div class="flex flex-col">
		<h2 class="leftHeader w-full">
			Основные данные
			<Button variant="contained" class="float-right" onClick={() => setEditing(!editing())}>
				<Edit class="mr-2"/>
				Редактировать
			</Button>
		</h2>

		<div class="pl-2">
			<For each={propToDisplay}>
				{(disp, i) =>
					<div class="my-1.5">
						<span classList={{propDisplayName: true, ...loadingCl()}}>
							{disp.name}: 
						</span>
						<span classList={{propDisplayValue: true, ...loadingCl()}}>
							{card()?.[disp.key] || placeholder()}
						</span>
					</div>
				}
			</For>
		</div>
	</div>
}