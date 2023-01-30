import http from "../utility/request.js";
// 用户优惠券列表  {couponType: 1可用优惠券、2不可用优惠券}
export const couponList = (data) => http.post(`user/api.coupon/couponList`, { data });
// 去使用优惠券
export const useCoupon = (data) => http.post(`product/api.product/couponProduct`, { data });