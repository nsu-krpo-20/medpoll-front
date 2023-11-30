import axios from "axios";
import * as Constants from "src/consts";
import { getToken, isTokenExpired } from "./jwt";

const authedClient = axios.create({
	baseURL: Constants.BASE_URL,
	withCredentials: true,
});

const unauthedClient = axios.create({
	baseURL: Constants.BASE_URL,
	withCredentials: true,
});

authedClient.interceptors.request.use(async config => {
	if (!getToken() || isTokenExpired(getToken()!)) {
		// Tried to use authed client without a (valid) JWT;
		// wait until it's refreshed

		await new Promise<void>((res, rej) => {
			var onFail : () => void,
			    onRefresh : () => void;

			const removeListeners = () => {
				window.removeEventListener("jwtSet", onRefresh);
				window.removeEventListener("jwtFailRefresh", onFail);
			}

			onRefresh = () => {
				if (getToken() && !isTokenExpired(getToken()!)) {
					removeListeners();
					res();
				}
			}

			onFail = () => {
				removeListeners();
				rej("JWT refresh failed");
			}

			window.addEventListener("jwtSet", onRefresh);
			window.addEventListener("jwtFailRefresh", onFail);
		});

		console.assert(!!getToken()!);

		// request was made with the old token; have to update it here manually, it looks like
		config.headers['authorization'] = `Bearer ${getToken()!}`
	}

	return config;
}, function (error) {
	return Promise.reject(error)
})

export {
	authedClient,
	unauthedClient,
}