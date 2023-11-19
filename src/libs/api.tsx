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
			window.addEventListener("jwtSet", () => {
				if (getToken() && !isTokenExpired(getToken()!)) {
					res();
				}
			});
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