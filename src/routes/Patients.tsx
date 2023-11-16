import { Add } from "@suid/icons-material";
import { Button, Divider, Grow, ListItemButton, Modal, Paper, TextField, Typography } from "@suid/material";
import { createEffect, createResource, createSignal, For, ResourceReturn, Show } from 'solid-js';
import TopNav from "src/components/TopBar";
import * as Cards from "src/libs/patientcard";
import { useNewCardForm } from 'src/sections/PatientCard';
import './Patients.css';
import { createInfiniteScroll, createPagination } from "@solid-primitives/pagination";

/*
const [tabs, setTabs] = createSignal([
	{name: "Пациенты", icon: <Restore />},
	{name: "CSS", icon: <Restore />},
	{name: "JS", icon: <Restore />},
]);

function Tabs() {
	const [selTab, setSelTab] = createSignal(0);

	return <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={selTab()}
        onChange={(e, sel) => {
			setSelTab(sel);
        }}
      >
        <For each={tabs()}>
			{(itm, i) =>
				<BottomNavigationAction label={itm.name} icon={itm.icon} />
			}
		</For>
      </BottomNavigation>
    </Box>
}
*/

function NewPatientModal(props : {isOpen: boolean, closeModal: any, onSubmit: any}) {
	const { form, updateField } = useNewCardForm();
	const closeModal = props.closeModal;

	const CardTextField = (props : any) => {
		return <TextField variant="outlined" sx={{mt:1, mb:1, h:1, w:"100%"}} size="small" {...props} />
	}

	const submitCard = (e: SubmitEvent) => {
		e.preventDefault();

		Cards.submitNew(form).then((resp) => {
			closeModal();
			props.onSubmit();
		}).catch((err) => {
			console.error(err);
		});
	}

	return <Modal open={props.isOpen} onClose={props.closeModal}
	class="w-full h-full flex grow justify-center items-center">
		<Grow in={props.isOpen} timeout={300}>
			<Paper class="p-8">
				<Typography variant="h5" textAlign='center'> Новый пациент </Typography>
				<div class="h-full w-full flex justify-center items-center">
					<form class="flex flex-col min-w-[320px]" onSubmit={submitCard}>
						<CardTextField label="ФИО" required onChange={updateField("fullName")}/>
						<CardTextField label="Номер телефона" onChange={updateField("phoneNumber")}/>
						<CardTextField label="Номер СНИЛС" onChange={updateField("snils")}/>

						{/*
						<input type="text" placeholder="ФИО" onChange={updateField("name")} />
						<input type="text" placeholder="" onChange={updateField("phoneNumber")} />
						<input type="text" placeholder="" onChange={updateField("snils")} />
						*/}
						<div class="flex flex-row w-full items-stretch px-4 mt-4 gap-x-2">
							<Button variant="outlined" color="error" onClick={closeModal}> Отмена </Button>
							<Button variant="contained" color="success" class="flex-1" type="submit"> Создать </Button>
						</div>
					</form>
				</div>
			</Paper>
		</Grow>
	</Modal>
}

export default function PatientsPage() {
	const [isNewPatient, setIsNewPatient] = createSignal(false);
	const [cards, setCards] = createSignal([] as Cards.PatientCard[]);
	const [cardCount, setCardCount] = createSignal(0);

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

	const [pgProps, page, setPage] = createPagination(pageOpts);
	/* </TotallyNotAHack> */

	const closeNewPatient = () => setIsNewPatient(false);
	const openNewPatient = () => setIsNewPatient(true);

	const cardsPerPage = 50;

	const fetchCards = (page?: number) => {
		return Cards.fetchMultiple((page ? (page - 1) : 0) * cardsPerPage, cardsPerPage).then((resp) => {
			return resp;
		});
	}

	Cards.fetchCount().then(setCardCount);

	const fetchCurrentPage = () => {
		fetchCards(page())
			.then((data) => {
				setCards(data);
			});
	}

	const onNewCard = () => {
		fetchCurrentPage();
	}

	createEffect(fetchCurrentPage);

	return (
		<div class="w-full h-screen flex flex-col grow overflow-y-scroll">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="px-4 lg:px-8 xl:px-16 flex flex-col h-full">
				<h2 class="py-4"> Список пациентов </h2>

				<div class="pb-2">
					<Button variant="contained" color="success" onClick={openNewPatient}>
						<Add /> Создать
					</Button>
				</div>

				<div class="flex flex-row justify-center gap-x-2 pb-2">
					<For each={pgProps()}>
						{ (props) =>
						<button class="cardPageBtn" {...props} />
					}
					</For>
				</div>
			
				<div class="cardListGridContainer">
					<div class="cardListGrid">
						<For each={cards()}>
							{(pat, i) =>
							<div class="patientCardFrame flex flex-col">
								<div class="patientCardDetails flex flex-col px-2 py-1 grow">
									<span class="truncate whitespace-nowrap font-bold"> {pat.fullName} </span>
									{pat.phoneNumber ? <span> {pat.phoneNumber} </span>
									    : <span class="text-neutral-300"> - </span> }
								</div>
								<Divider/>
								<ListItemButton sx={{flexGrow: 0}}> Перейти </ListItemButton>
							</div>}
						</For>
					</div>
				</div>

				<NewPatientModal isOpen={isNewPatient()} closeModal={closeNewPatient} onSubmit={onNewCard}/>
			</div>
		</div>
	)
}