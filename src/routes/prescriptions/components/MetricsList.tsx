import { Card, Grow, IconButton, MenuItem, Select, TextField } from "@suid/material";
import { Accessor, For, JSX, Setter, Show, createEffect, createSignal } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import { PeriodType, PeriodValue, PrescriptionMetric } from "src/libs/prescription";
import { periodTypeToComponent } from "./Periods";
import { Delete } from "@suid/icons-material";

interface MetricsListProps {
	metrics: Accessor<PrescriptionMetric[]>,
	setMetrics?: Setter<PrescriptionMetric[]>,
	removeMetric?: (which : PrescriptionMetric) => void,
}

export function MetricsList(props: MetricsListProps) : JSX.Element {
	const editable = props.setMetrics != null;
	const arr = [];

	return (<>
		<div class="flex flex-col gap-2 pt-2">
			<For each={props.metrics()}>
				{(mt, i) => {
					const [name, setName] = createSignal(mt.name);
					const [periodType, setPeriodType] = createSignal(PeriodType.DEFAULT);
					const [period, setPeriod] = createSignal<PeriodValue>("");
					const [nameError, setNameError] = createSignal<string | null>();

					createEffect(() => {
						setNameError(name().length == 0 ? "Заполните имя." : null)
					})

					createEffect(() => {
						mt.name = name();
						mt.periodType = periodType();
						mt.period = period();
					})

					return <Grow in={true}>
						<Card class="listCard p-2 flex flex-col gap-y-1">
						<div class="flex flex-row">
							<TextField value={name()}
								placeholder="Название метрики"
								size="small"
								required
								fullWidth
								variant="outlined"
								error={!!nameError()}
								helperText={nameError()}
								inputProps={{sx: {pt: 0.5, pb: 0.5}}}
								disabled={!editable}
								onChange={(e, val) => {
									setName(val);
								}}
							/>

							<Show when={props.removeMetric}>
								<div class="flex items-center h-8">
								<IconButton color="error"
									onClick={() => props.removeMetric!(mt)}>
									<Delete />
								</IconButton>
								</div>
							</Show>
						</div>

						<div class="flex flex-row gap-x-1">
							<span class="flex items-center h-8">Период: </span>

							<div class="flex flex-col grow">
								<Select
									inputProps={{sx: {pl: 1.5}}}
									value={periodType()}
									onChange={(e) => setPeriodType(e.target.value)}
									label="Период"
									variant="standard"
									class="grow"
								>
									<MenuItem value={PeriodType.N_TIMES_PER_DAY}> Х раз в день </MenuItem>
									<MenuItem value={PeriodType.ONCE_PER_N_DAYS}> Раз в Х дней </MenuItem>
									<MenuItem value={PeriodType.WEEK_SCHEDULE}> По дням недели </MenuItem>
									<MenuItem value={PeriodType.CUSTOM}> Свой... </MenuItem>
								</Select>
							</div>
						</div>

						<Dynamic component={periodTypeToComponent[periodType() as PeriodType]}
									period={period} setPeriod={setPeriod} />
					</Card>
					</Grow>
				}}
			</For>
		</div>
	</>)
}