import http from "../utility/request.js";


/************ 订单 start ***************/

//订单
export const getOrderListApi = (data) => http.post(`orders/api.artificerOrder/listNew`, { data });
//订单详情
export const getOrderDetailApi = (data) => http.post(`orders/api.artificerOrder/detail`, { data });
//设置订单状态
export const setOrderStatusApi = (data) => http.post(`orders/api.artificerOrder/setStatus`, { data });
//一键报警
export const createPoliceOrderApi = (data) => http.post(`orders/api.seekHelpRecord/create`, { data });
//虚拟号获取
export const getVirtualNumberApi = (data) => http.post(`orders/api.virtualPhone/getByOrder`, { data });
//获取订单评分
export const getOrderRateApi = (data) => http.post(`orders/api.artificerOrder/showScore`, { data });

/************ 订单 end ***************/