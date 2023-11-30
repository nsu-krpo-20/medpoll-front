import { useLocation, useParams } from "@solidjs/router";
import { Book, Edit, Info, QrCode } from "@suid/icons-material";
import { BottomNavigation, BottomNavigationAction, Button, Paper } from "@suid/material";
import { AxiosResponse } from "axios";
import { Accessor, createEffect, createResource, createSignal, For, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import TopNav from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import * as Cards from "src/libs/patientcard";
import './View.css'
import { ViewInfo } from "./ViewComponents/leftpanel";
import { ViewPairing } from "./ViewComponents/rightpanel";
import { createStore } from "solid-js/store";

async function fetchCard(id : number) : Promise<AxiosResponse<Cards.PatientCard, any>> {
	// Invalid ID passed in route; don't try fetching anything
	if (isNaN(id)) return new Promise((res, rej) => rej);

	return authedClient.get(`/api/v1/cards/${id}`);
}

const rightStateToComponent = {
	info: null,
	qr: ViewPairing,
}

const leftStateToComponent : any = {
	info: ViewInfo,
}

function RightPanel(props) : JSX.Element {
	const tabs = [
		{label: "Информация", icon: <Info />, state: "info"},
		{label: "Назначения", icon: <Book />, state: "prescriptions"},
		{label: "Сопряжение", icon: <QrCode />, state: "qr"},
		// If you're adding more, make sure you update the min-w of the right-side panel too
	]

	const [rightState, setRightState] = createSignal(tabs[0].state);

	const select = (ev, selValue: string) => {
		console.log("selected:", selValue);
		setRightState(selValue);
	}

	return <>
		<BottomNavigation showLabels onChange={select} value={rightState()}>
			<For each={tabs}>
				{(tabData, idx) =>
					<BottomNavigationAction {...tabData}
					selected={rightState() == tabData.state}
					value={tabData.state}
					/>
				}
			</For>
		</BottomNavigation>

		<Dynamic component={rightStateToComponent[rightState()]}
				card={props.card}
				loadingCl={props.loadingCl} />
	</>
}


export function ViewPatientPage() {
	const params = useParams(); // 👈 Get the dynamic route parameters
	const id = Number(params.id);

	// We might have *some* data about the card from the state
	// (ie when the user comes here from the patients list)
	// We can use it to display initial data while we fetch details via the dedicated route
	const [card, setCard] = createStore<Cards.PatientCard>(useLocation().state as Cards.PatientCard)

	var missing = () => !card;
	const [cardRes] = createResource(id, fetchCard);
	const [leftState, setLeftState] = createSignal("info");

	createEffect(() => {
		// you can't get() a resource if it errors, because it'll bubble the error up... lol
		// https://github.com/solidjs/solid/discussions/1888#discussioncomment-7060132
		if (!cardRes.error && cardRes()) {
			setCard(cardRes()!.data);
		}
	})

	const onSelectRightTab = (tab: JSX.Element) => {

	}

	const loadingClasslist = () => ({loading: cardRes.loading, missing: missing(), error: cardRes.error});

	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
		<div class="w-full h-12">
			<TopNav />
		</div>

		<div class="pageContent">
			<h1 classList={{patientName: true, ...loadingClasslist()}}>
				{card ? card.fullName : "Загрузка..."}
			</h1>

			<div class="flex flex-row grow justify-around gap-x-2 lg:gap-x-4 py-8">
				<Paper class="basis-[66%] px-4 py-4 min-w-[512px]">
					<Dynamic card={[card, setCard]} loadingCl={loadingClasslist} component={leftStateToComponent[leftState()]} />
				</Paper>

				<Paper class="basis-[34%] min-w-[300px]">
					<RightPanel card={[card, setCard]} loadingCl={loadingClasslist} onSelect={onSelectRightTab} />
				</Paper>
			</div>
		</div>
	</div>
}