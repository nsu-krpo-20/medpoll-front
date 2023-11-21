import * as Cards from "src/libs/patientcard";
import { Accessor, createSignal, JSX } from "solid-js";
import { Button } from "@suid/material";
import { Edit } from "@suid/icons-material";

export function ViewPairing(props) : JSX.Element {
	const card : Accessor<Cards.PatientCard> = props.card;
	const [editing, setEditing] = createSignal(false);

	return <div class="flex flex-col px-2">
		<h2 class="leftHeader w-full text-center">
			Сопряжение
		</h2>

		{ /* draw QR 'n stuff here */ }
		<img src="https://i.imgur.com/9MlhoLo.png" />
	</div>
}