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

type MaybeJWT = string | null;
type MaybeJWTOrEmpty = MaybeJWT | void;

export function getExpireData(jwt: MaybeJWTOrEmpty) : [null] | [expiresIn: number, expiresTimestamp: number] {
	jwt = jwt || getUncheckedToken();
	if (!jwt) return [null];

	var jwtData = jwtDecode(jwt);
	if (!jwtData.exp) {
		return [null];
	}

	var now = Math.floor(Date.now() / 1000);
	return [jwtData.exp - now, jwtData.exp];
}

// Call to check that the token is still valid
function checkToken(jwt: MaybeJWTOrEmpty) {
	const [expiresIn, _] = getExpireData(jwt);

	if (!expiresIn || expiresIn < 0) {
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

function getUncheckedToken() : MaybeJWT {
	return localStorage.getItem("token_access");
}

export function setToken(jwt: string) {
	if (!checkToken(jwt)) {
		throw new Error("Tried to set invalid token!");
	}

	localStorage.setItem("token_access", jwt);
	updateToken(jwt);
}

export function getToken() : MaybeJWT {
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

/* Refresh the JWT token. Syncs the refresh with other tabs,
   i.e. requesting multiple refreshes will only run one and discard the others.
   In that case, the discarded requests' promise will be rejected with `false` */
export function refreshToken() : Promise<string> {
	return new Promise((resolve, reject) => {
		window.navigator.locks.request("refresh_token", {
			ifAvailable: true,
		}, async (lock) => {
			// Failed to acquire lock due to a refresh already running; don't refresh
			if (lock == null) reject(false);

			try {
				var resp = await client.post("/api/v1/auth/refresh");

				setToken(resp.data.accessToken);
				resolve(getToken()!);
			} catch(err) {
				console.error(err);
				reject(err);
			}
		})
	});
}

export function refreshTokenIfExpires(expires_grace : number | void) : Promise<string> | false {
	expires_grace = expires_grace || 60;

	const token = getUncheckedToken();
	if (!token) {
		return refreshToken();
	}

	const [expiresIn] = getExpireData(token);
	if (!expiresIn || expiresIn < expires_grace) {
		return refreshToken();
	}

	return false;
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