import { createPagination } from "@solid-primitives/pagination";
import { Params, useSearchParams } from '@solidjs/router';
import { createEffect, createSignal } from 'solid-js';
import PatientsGrid from "src/components/PatientsGrid";
import Searchbar from "src/components/Searchbar";
import TopNav from "src/components/TopBar";
import * as Cards from "src/libs/patientcard";
import './Patients.css';

export default function SearchPage() {
	const [cards, setCards] = createSignal([] as Cards.PatientCard[]);
	const [cardCount, setCardCount] = createSignal(0);
	const [searchParams, ] = useSearchParams<Params>();
	/* <TotallyNotAHack> */
	var currentOpts = {
		pages: 0,
		showLast: false,
		showFirst: false,
	};

	const [pageOpts, setPageOpts] = createSignal(currentOpts);

	createEffect(() => {
		currentOpts.pages = Math.ceil(cardCount() / cardsPerPage)
		setPageOpts({...currentOpts})
	})

	const [pgProps, page, ] = createPagination(pageOpts);
	/* </TotallyNotAHack> */

	const cardsPerPage = 50;

	const fetchCards = (page?: number) => Cards.fetchMultiple(
										(page ? (page - 1) : 0) * cardsPerPage, 
										cardsPerPage, 
										searchParams.q)

	Cards.fetchCount().then(setCardCount);
	const fetchCurrentPage = () => fetchCards(page()).then((data) => setCards(data));
	createEffect(fetchCurrentPage);

	return (
		<div class="w-full h-screen flex flex-col grow overflow-y-scroll">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="pageContent">
				<div class="flex justify-between">
					<h2 class="pb-4"> Список пациентов </h2>
					<Searchbar />
				</div>
				
				<PatientsGrid pgProps={pgProps}
											cards={cards}/>
			</div>
		</div>
	)
}
