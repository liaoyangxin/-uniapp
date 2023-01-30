import request from "../utility/request.js";

/************ 社区 start ***************/

// 订单列表
export const orderListApi = (data) => request.post('orders/api.order/userList', { data });

// 订单详情
export const orderDetailApi = (data) => request.post('orders/api.order/userInfo', { data });

// 创建订单
export const createOrder = (data) => request.post('orders/api.order/create', { data });

// 确认订单
export const orderFinish = (data) => request.post('orders/api.order/userFinish', { data });

// 取消订单
export const cancelOrder = (data) => request.post('orders/api.order/cancel', { data });

//订单详情
export const detailOrder = (data) => request.post('orders/api.order/userInfo', { data });

// 查看当前订单的评分
export const orderScore = (data) => request.post('orders/api.artificerOrder/showScore', { data });

// 评分
export const getScore = (data) => request.post('orders/api.order/subScore', { data });

// 虚拟号
export const getVirtualNumberApi = (data) => request.post(`orders/api.virtualPhone/getByOrder`, { data });
// 排期时间
export const getWorkPlanByUser = (data) => request.post('user/api.artificer/getWorkPlanByUser', { data });

// 获取金额
export const getPrice = (data) => request.post('orders/api.order/getPrice', { data });

// 交通工具
export const getTravel = (data) => request.post('orders/api.traffic/getList', { data });

// 订单评分 evaluateApi
export const evaluateApi = (data) => request.post('orders/api.order/subScore', { data });

//获取订单可用优惠卷
export const getCouponListApi = (data) => request.post('user/api.coupon/couponListByAmount', { data });

//获取下单信息
export const getOrderInfoApi = (data) => request.post('orders/api.order/getBeforeOrder', { data });

//获取下单金额
export const getOrderPriceApi = (data) => request.post('orders/api.order/getOrderPrice', { data });
/************ 社区 end ***************/