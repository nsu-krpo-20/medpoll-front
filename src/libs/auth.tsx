import { Accessor, createContext, createSignal, useContext } from "solid-js"
import { client } from "./api";
import { jwtDecode } from "jwt-decode";

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

// Call to check that the token is still valid
function checkToken(jwt: string | void | null) {
	jwt = jwt || getUncheckedToken();
	if (!jwt) return false;

	var jwtData = jwtDecode(jwt);
	var now = Math.floor(Date.now() / 1000);

	console.log("access token:", jwtData.exp! - now, "seconds till expiry");

	if (jwtData.exp && jwtData.exp - now < 0) {
		return false;
	}

	return true;
}

// Call when the token changes
function updateToken(newJwt: string) {
	client.defaults.headers.common.Authorization = `Bearer ${newJwt}`;
}

function clearToken() {
	localStorage.removeItem("token_access");
	client.defaults.headers.common.Authorization = null;
}

function getUncheckedToken() : string | null {
	return localStorage.getItem("token_access");
}

export function setToken(jwt: string) {
	if (!checkToken(jwt)) {
		throw new Error("Tried to set invalid token!");
	}

	localStorage.setItem("token_access", jwt);
	updateToken(jwt);
}

export function getToken() : string | null {
	var token = getUncheckedToken();

	if (!checkToken(token)) {
		clearToken();
		return null;
	}

	return token;
}

export function getUser() : User | null {
	const token = getToken();
	if (!token) return null;

	return {
		token: token,
	}
}

export const UserContext = createContext(gahh_typescript);

export function useUserContext() {
	return useContext(UserContext);
}

export type {
	User,
	UserContextArgs
};

function initializeToken() {
	var token = getUncheckedToken();
	if (!token) return;

	if (!checkToken(token)) {
		clearToken();
	} else {
		updateToken(token!);
	}
}

initializeToken();