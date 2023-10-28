import axios from "axios";
import * as Constants from "src/consts";

const client = axios.create({
	baseURL: Constants.BASE_URL,
});

export {
	client,
}