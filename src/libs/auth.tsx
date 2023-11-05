import { Accessor, createContext, createSignal, useContext } from "solid-js"
import { client } from "./api";

interface User {
	token: string | null,
}

interface UserContextArgs { //  V i hate this
	user: Accessor<User | null>,
	setUser: (u: User) => void,
}

const gahh_typescript : UserContextArgs = {
	user: createSignal<User | null>(null)[0], // WTF
	setUser: (u: User) => {},
}

const UserContext = createContext(gahh_typescript);

function useUserContext() {
	return useContext(UserContext);
}

function setToken(accessToken: string) {
	localStorage.setItem("token_access", accessToken);
	client.defaults.headers.common.Authorization = `Bearer ${accessToken}`
}

function getUser() : User | null {
	const token = localStorage.getItem("token_access");
	if (!token) return null;

	return {
		token: token,
	}
}

client.defaults.headers.common.Authorization = `Bearer ${getUser()?.token}`

export type {
	User,
	UserContextArgs
};

export {
	useUserContext,
	UserContext,
	getUser,
	setToken
};
