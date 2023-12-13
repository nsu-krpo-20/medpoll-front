import { PaginationProps } from "@solid-primitives/pagination";
import { useNavigate } from "@solidjs/router";
import { Divider, ListItemButton } from "@suid/material";
import { Accessor, Component, For } from "solid-js";
import * as Cards from "src/libs/patientcard";

const PatientsGrid: Component<{cards: Accessor<Cards.PatientCard[]>,
															 pgProps: Accessor<PaginationProps>}> = (props) => {
	const navigate = useNavigate();
	const gotoCard = (card : Cards.PatientCard) => navigate(`/patients/view/${card.id}`, {state: card});

	return (
			<div> 
				<div class="flex flex-row justify-center gap-x-2 pb-2">
					<For each={props.pgProps()}>
						{ (props) =>
						<button class="cardPageBtn" {...props} />
					}
					</For>
				</div>
			
				<div class="cardListGridContainer">
					<div class="cardListGrid">
						<For each={props.cards()}>
							{(pat) =>
							<div class="patientCardFrame flex flex-col">
								<div class="patientCardDetails flex flex-col px-2 py-1 grow">
									<span class="truncate whitespace-nowrap font-bold"> {pat.fullName} </span>
									{pat.phoneNumber ? <span> {pat.phoneNumber} </span>
									    : <span class="text-neutral-300"> - </span> }
								</div>
								<Divider/>
								<ListItemButton sx={{flexGrow: 0}} onClick={() => gotoCard(pat)}>
									Перейти
								</ListItemButton>
							</div>}
						</For>
					</div>
				</div>
			</div>
	)
}

export default PatientsGrid;
