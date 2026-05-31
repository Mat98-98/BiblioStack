import axios from "axios";
import { API } from "../api.js";

const api = axios.create({
    baseURL: API,
    withCredentials: true,
})

export default api