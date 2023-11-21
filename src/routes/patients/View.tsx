import { useLocation, useParams } from "@solidjs/router";
import { Paper } from "@suid/material";
import { AxiosResponse } from "axios";
import { Accessor, createEffect, createResource, createSignal, For, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import TopNav from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import * as Cards from "src/libs/patientcard";
import './View.css'

async function fetchCard(id : number) : Promise<AxiosResponse<Cards.PatientCard, any>> {
	// Invalid ID passed in route; don't try fetching anything
	if (isNaN(id)) return new Promise((res, rej) => rej);

	return authedClient.get(`/api/v1/cards/${id}`);
}

function leftViewInfo(props) : JSX.Element {
	const card : Accessor<Cards.PatientCard | null> = props.card;
	const loadingCl = props.loadingCl;


	const propToDisplay = [
		{key: "fullName", name: "ФИО"},
		{key: "snils", name: "СНИЛС"},
		{key: "phoneNumber", name: "Номер телефона"},
	]

	const placeholder = () => (loadingCl().loading ? "загрузка..." : "-");

	return <div class="flex flex-col">
		<h2 class="leftHeader">Основные данные</h2>

		<For each={propToDisplay}>
			{(disp, i) =>
				<div class="propDiv">
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
}

const stateToComponent = {
	info: leftViewInfo,
}

export function ViewPatientPage() {
	const params = useParams(); // 👈 Get the dynamic route parameters
	const id = Number(params.id);

	// We might have *some* data about the card from the state
	// (ie when the user comes here from the patients list)
	// We can use it to display initial data while we fetch details via the dedicated route
	const [card, setCard] = createSignal(useLocation().state as Cards.PatientCard)
	var loading = true;
	var missing = () => !card();
	const [fetchedCard] = createResource(id, fetchCard);
	const [leftState, setLeftState] = createSignal("info")

	createEffect(() => {
		if (fetchedCard()) {
			setCard(fetchedCard()!.data);
			loading = false;
		}
	})

	const loadingClasslist = () => ({loading: loading, missing: missing()});

	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
		<div class="w-full h-12">
			<TopNav />
		</div>

		<div class="pageContent">
			<h1 classList={{patientName: true, ...loadingClasslist()}}>
				{card() ? card().fullName : "Загрузка..."}
			</h1>
			
			<div class="flex flex-row grow justify-around gap-x-4 py-8">
				<Paper class="grow-[3] px-4 py-4">
					{ /* TS shut up pls */ }
					<Dynamic component={stateToComponent[leftState()]} card={card} loadingCl={loadingClasslist} />
				</Paper>

				<Paper  class="grow-[2]">
					
				</Paper>
			</div>
		</div>
	</div>
}