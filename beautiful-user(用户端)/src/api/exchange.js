
import http from "../utility/request.js";
export const redeemCoupon = (data) => http.post(`user/api.redeemCode/redeemCoupon`, { data });