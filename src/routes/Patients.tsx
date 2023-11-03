import { Accessor, createSignal, For } from 'solid-js'
import TopNav from "src/components/TopBar"
import './Patients.css'
import { Add, Favorite, LocationOn, PlusOne, Restore } from "@suid/icons-material";
import { Button, Modal, ListItemButton, Divider, Typography, Paper, Grow, TextField } from "@suid/material";
import { useNavigate } from '@solidjs/router';
import { PatientCardFields, useCardForm } from 'src/sections/PatientCard';

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

function NewPatientModal(props : {isOpen: boolean, onClose: any}) {
	const { form, updateField, submit } = useCardForm();

	const CardTextField = (props) => {
		return <TextField variant="outlined" sx={{mt:1, mb:1, h:1, w:"100%"}} size="small" {...props} />
	}

	const submitCard = (e: SubmitEvent) => {
		e.preventDefault();
		console.log("the big submit", e);
	}

	return <Modal open={props.isOpen} onClose={props.onClose}
	class="w-full h-full flex grow justify-center items-center">
		<Grow in={props.isOpen} timeout={300}>
			<Paper class="p-8">
				<Typography variant="h5" textAlign='center'> Новый пациент </Typography>
				<div class="h-full w-full flex justify-center items-center">
					<form class="flex flex-col min-w-[320px]" onSubmit={submitCard}>
						<CardTextField label="ФИО" required />
						<CardTextField label="Номер телефона" />
						<CardTextField label="Номер СНИЛС" />

						{/*
						<input type="text" placeholder="ФИО" onChange={updateField("name")} />
						<input type="text" placeholder="" onChange={updateField("phoneNumber")} />
						<input type="text" placeholder="" onChange={updateField("snils")} />
						*/}
						<div class="flex flex-row w-full items-stretch px-4 mt-4 gap-x-2">
							<Button variant="outlined" color="error"> Отмена </Button>
							<Button variant="contained" color="success" class="flex-1" type="submit"> Создать </Button>
						</div>
					</form>
				</div>
			</Paper>
		</Grow>
	</Modal>
}

const patients = [
	{ name: "Иван Иванов Захрапин", phoneNumber: "+79990123456" },
	{ name: "Алексей Каменщик Долбня" }
]

export default function PatientsPage() {
	const navigate = useNavigate();
	const [isNewPatient, setIsNewPatient] = createSignal(false);
	const handleClose = () => setIsNewPatient(false);

	function clickNewPatient(e) {
		console.log("Clicked new patient", e);
		setIsNewPatient(true);
		//navigate("/patients/create");
	}

	return (
		<div class="w-full h-screen flex flex-col grow">
			<div class="w-full h-12">
				<TopNav />
			</div>

			<div class="px-4">
				<h2 class="py-4"> Список пациентов </h2>

				<div class="pb-4">
					<Button variant="contained" color="success" onClick={clickNewPatient}>
						<Add /> Создать
					</Button>
				</div>

				<div class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					<For each={patients}>
						{(pat, i) =>
						<div class="patientCardFrame flex flex-col px-3 py-3">
							<div class="flex flex-col grow">
								<span class="truncate whitespace-nowrap"> {pat.name} </span>
								<span> {pat.phoneNumber} </span>
							</div>
							<Divider/>
							<ListItemButton sx={{flexGrow: 0}}> Перейти </ListItemButton>
						</div>}
					</For>
				</div>

				<NewPatientModal isOpen={isNewPatient()} onClose={handleClose}/>
			</div>
		</div>
	)
}