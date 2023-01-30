import http from "../utility/request.js";
export const getServerTimeConfig = (data) => http.post(`user/api.artificer/getServerTimeConfig`, {data});
export const setServerTimeConfig = (data) => http.post(`user/api.artificer/setServerTimeConfig`, {data});
