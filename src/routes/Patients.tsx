import { createSignal, For } from 'solid-js'
import TopNav from "src/components/TopBar"
import './Patients.css'
import { Add, Favorite, LocationOn, PlusOne, Restore } from "@suid/icons-material";
import { Button, Box, ListItemButton, Divider, Typography } from "@suid/material";
import { useNavigate } from '@solidjs/router';

const [tabs, setTabs] = createSignal([
	{name: "Пациенты", icon: <Restore />},
	{name: "CSS", icon: <Restore />},
	{name: "JS", icon: <Restore />},
]);

/*
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

const patients = [
	{ name: "Иван Иванов Захрапин", phoneNumber: "+79990123456" },
	{ name: "Алексей Каменщик Долбня" }
]

export default function PatientsPage() {
	const navigate = useNavigate();

	function clickNewPatient(e) {
		console.log("Clicked new patient", e);
		navigate("/patients/create");
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
			
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
			</div>
		</div>
	)
}