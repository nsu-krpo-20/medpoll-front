import { jwtDecode } from "jwt-decode";
import { createSignal } from "solid-js";
import { authedClient, unauthedClient } from "./api";

const STORAGE_TOKEN_KEY = "token_access"
const jwtBC = new BroadcastChannel("jwt");

type JWT = string;
type MaybeJWT = string | null;

const [jwtToken, setJwtToken] = createSignal<MaybeJWT>(getUncheckedToken());

export {
	jwtToken // Only export the reader; the setter is ours
};

export function getExpireData(jwt: JWT) : [null] | [expiresIn: number, expiresTimestamp: number] {
	try {
		var jwtData = jwtDecode(jwt);
		if (!jwtData.exp) {
			return [null];
		}

		var now = Math.floor(Date.now() / 1000);
		return [jwtData.exp - now, jwtData.exp];
	} catch {
		return [null]; // Malformed token
	}
}
export function isTokenExpired(jwt: JWT) : boolean {
	const [expiresIn, _] = getExpireData(jwt);

	if (!expiresIn || expiresIn < 0) {
		return true;
	}

	return false;
}

function updateToken(newJwt: MaybeJWT) {
	if (newJwt) {
		authedClient.defaults.headers.common.Authorization = `Bearer ${newJwt}`;
	} else {
		authedClient.defaults.headers.common.Authorization = null;
	}

	setJwtToken(newJwt);

	window.dispatchEvent(new Event("jwtSet"));
	jwtBC.postMessage({token: newJwt});
}

export function clearToken() {
	localStorage.removeItem(STORAGE_TOKEN_KEY);
	updateToken(null);
}

function getUncheckedToken() : MaybeJWT {
	return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function setToken(jwt: JWT) {
	if (isTokenExpired(jwt)) {
		throw new Error("Tried to set expired token!");
	}

	localStorage.setItem(STORAGE_TOKEN_KEY, jwt);
	updateToken(jwt);
}

export function getToken() : MaybeJWT {
	var token = getUncheckedToken();
	if (!token) return null;

	if (isTokenExpired(token)) {
		clearToken();
		return null;
	}

	return token;
}

/* Refresh the JWT token. Syncs the refresh with other tabs,
   i.e. requesting multiple refreshes will only run one and discard the others.
   In that case, the discarded requests' promise will be rejected with `false` */
export function refreshToken() : Promise<JWT> {
	return new Promise((resolve, reject) => {
		window.navigator.locks.request("refresh_token", {
			ifAvailable: true,
		}, async (lock) => {
			// Failed to acquire lock due to a refresh already running;
			// just listen for errors/successes from whoever called it
			if (lock == null) {
				var onSet = () => {
					window.removeEventListener("jwtFailRefresh", onFail);
					resolve(getToken()!);
				}

				var onFail = () => {
					window.removeEventListener("jwtSet", onSet);
					reject();
				}
				
				window.addEventListener("jwtSet", onSet, { once: true });
				window.addEventListener("jwtFailRefresh", onFail, { once: true });
				return;
			}

			console.log("Refreshing token...");

			try {
				var resp = await unauthedClient.post("/api/v1/auth/refresh");

				setToken(resp.data.accessToken);
				resolve(getToken()!);
			} catch(err : any) {
				// note: BroadcastChannel spec says messages are sent to **other** channels
				// so we can't read our own messages
				jwtBC.postMessage({error: err.toString()});
				window.dispatchEvent(new Event("jwtFailRefresh"));
				reject(err);
			}
		})
	});
}

export function refreshTokenIfExpires(expires_grace : number | void) {
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

function initializeToken() {
	var token = getUncheckedToken();
	if (!token) return;

	if (isTokenExpired(token)) {
		clearToken();
	} else {
		updateToken(token!);
	}
}

/* This event gets called when the token gets modified outside of this tab
   We need to update our data when that happens (axios auth, user, solidjs signal, ...) */

window.addEventListener("storage", (event) => {
	if (event.key != STORAGE_TOKEN_KEY) return;

	updateToken(event.newValue);
});

jwtBC.onmessage = (ev) => {
	if (ev.data?.error) {
		window.dispatchEvent(new Event("jwtFailRefresh"));
	} else if (ev.data?.token) {
		// this should be done from the "storage" event listener, not here
		// window.dispatchEvent(new Event("jwtSet"));
	}
}

initializeToken();