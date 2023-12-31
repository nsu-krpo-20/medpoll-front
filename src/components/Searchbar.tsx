import { Component, JSX, createSignal } from "solid-js"
import { useNavigate } from "@solidjs/router"

type SearchbarProps = {
	onSearch: ((qry: string) => void) | undefined,
	onChange: ((qry: string) => void) | undefined,
}

const Searchbar: Component<SearchbarProps> = (props) => {
	const [query, setQuery] = createSignal<string | undefined>(undefined);

	const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		const inputElement = e.currentTarget as HTMLInputElement;
  		setQuery(inputElement.value == "" ? undefined : inputElement.value);

		if (props.onChange) {
			props.onChange(query() ?? "");
		}
	};

	const doSearch = (e: Event) => {
		e.preventDefault();

		if (props.onSearch && query()) {
			props.onSearch(query()!);
		}
	}

	return <form onSubmit={doSearch}>
  	<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Поиск</label>
  	<div class="relative">
      	<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
         	 <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        	      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
      	    </svg>
    	  </div>
  	    <input type="search" onInput={handleInput} id="patient-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
    	  <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Поиск</button>
  	</div>
	</form>
}
export default Searchbar;
