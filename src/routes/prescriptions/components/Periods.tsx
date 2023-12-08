import { ToggleButtonGroup, ToggleButton, TextField } from "@suid/material";
import { Accessor, Setter, JSXElement, createSignal, createEffect, For, Index } from "solid-js";
import { PeriodValue, PeriodType } from "src/libs/prescription";

interface PeriodProps {
	period: Accessor<PeriodValue>,
	setPeriod: Setter<PeriodValue>
}

function unixTimeTo24H(ts: number) : string {
	return new Date(ts * 1000).toISOString().slice(-13, -8); // i hate you i hate you i hate you i hate you
}

function clock24HToUnixTime(clk: string) : number { // "14:00" -> 50400
	const [hrs, min] = clk.split(':');
    return Number(hrs) * 3600 + Number(min) * 60;
}

export function PeriodNPerDay(props : PeriodProps) : JSXElement {
	const {setPeriod} = props;

	const timesTemplates = [
		{isDefault: true, label: "1 раз", times: 1, defaultValue: [50400]},
		{isDefault: false, label: "2 раза", times: 2, defaultValue: [32400, 64800]},
		{isDefault: false, label: "3 раза", times: 3, defaultValue: [32400, 50400, 64800]},
	]

	const [amtTimes, setAmtTimes] = createSignal(0);

	interface TimeEntry {
		times: Accessor<number[]>,
		setTimes: Setter<number[]>,
	}

	const times : TimeEntry[] = []

	timesTemplates.forEach((v, k) => {
		var [timesArr, setTimesArr] = createSignal<number[]>(v.defaultValue);

		times[k] = {
			times: timesArr,
			setTimes: setTimesArr
		}
	})

	createEffect(() => {
		var newPeriod = times[amtTimes()].times();
		setPeriod(newPeriod);
	})

	return <div class="flex flex-col">
		<ToggleButtonGroup class="flex grow justify-center h-12 px-4 py-2"
							exclusive
							value={amtTimes()}
		                    onChange={(e, v) => {
								// coalescing due to clicking the active button unsetting the value
								// (null is passed as value)
								setAmtTimes(v ?? amtTimes())
						   }}>
			<For each={timesTemplates}>
				{(itm, idx) => {
					return <ToggleButton value={idx()} sx={{flex: 1}}>
						{itm.label}
					</ToggleButton>
				}}
			</For>
		</ToggleButtonGroup>

		<div class="flex flex-row gap-x-2">
			<Index each={times[amtTimes()].times()}>
				{(secs, i2) => {
					return <TextField type="time"
								value={unixTimeTo24H(secs())}
								size="small"
								class="grow items-center"
								variant="filled"
								inputProps={{sx: {pt: 0.5}}}
								onChange={(e, v) => {
									var newArr = [...times[amtTimes()].times()]
									newArr[i2] = clock24HToUnixTime(v);
									times[amtTimes()].setTimes(newArr);
								}}
							/>
				}}
			</Index>
		</div>
	</div>
}

export function PeriodOncePerNDays(props : PeriodProps) : JSXElement {
	const {setPeriod} = props;

	const [amtDays, setAmtDays] = createSignal(1);
	const [time, setTime] = createSignal(clock24HToUnixTime("12:00"));

	createEffect(() => {
		setPeriod([amtDays(), time()]);
	})

	const GREMMER = (days: number) : string[] => {
		days = days % 100
		// Каждые 11-...-19 дней
		if (days > 10 && days < 20)
			return ["Каждые", "дней"];

		var n = days % 10
		// Каждые 2-3-4 дня
		if (n >= 2 && n <= 4) return ["Каждые", "дня"]
		// Каждый 1-21-31-...-101 день
		if (n == 1) return ["Каждый", "день"]

		// Всё остальное (26, 48, ...)
		return ["Каждые", "дней"]
	}

	return <div class="flex flex-row pt-1">
		<span class="min-w-[4rem]">{GREMMER(amtDays())[0]}</span>
		<TextField type="number"
			value={amtDays()}
			size="small"
			class="flex w-fit shrink"
			variant="standard"
			sx={{w: 6, flex: 1, px: 1, "min-width": 56}}
			onChange={(e, v) => {
				setAmtDays(Number(v));
			}}
		/>
		<span  class="min-w-[3.5rem]">{GREMMER(amtDays())[1]} в </span>
		<TextField type="time"
			value={unixTimeTo24H(time())}
			size="small"
			class="grow"
			variant="standard"
			inputProps={{sx: {pl: 0.5}}}
			onChange={(e, v) => {
				setTime(clock24HToUnixTime(v));
			}}
		/>

	</div>
}

export function PeriodWeekSchedule(props : PeriodProps) : JSXElement {
	// TODO
}

export function PeriodCustom(props : PeriodProps) : JSXElement {
	const {setPeriod} = props;
	const [text, setText] = createSignal("");

	createEffect(() => {
		if (text() != "") {
			setPeriod(text())
		}
	})

	return <TextField value={text()}
	                  placeholder="Период"
	                  onChange={(e, v) => setText(v)}
					  size="small"
					  variant="filled"
					  inputProps={{sx: {pt: 1, pb: 1}}}
					  >

	</TextField>
}

export const periodTypeToComponent : { [e in PeriodType]: (p: PeriodProps) => JSXElement }
= {
	[PeriodType.N_TIMES_PER_DAY]: PeriodNPerDay,
	[PeriodType.ONCE_PER_N_DAYS]: PeriodOncePerNDays,
	[PeriodType.WEEK_SCHEDULE]: PeriodWeekSchedule,
	[PeriodType.CUSTOM]: PeriodCustom,
}