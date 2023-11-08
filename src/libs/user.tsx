import { createEffect, createSignal } from "solid-js";
import { clearToken, jwtToken } from "./jwt";

interface User {
	token: string | null,
	/* in the future, perhaps, name 'n stuff */
}

export const [user, setUser] = createSignal(getUser());

export function getUser() : User | null {
	const token = jwtToken();
	if (!token) return null;

	return {
		token: token,
	}
}

export function logout() {
	clearToken();
}

createEffect(() => {
	setUser(getUser());
})

export type {
	User
};