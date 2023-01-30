import http from "../utility/request.js";
//获取上传地址等。
export const updataUrlApi = (data) => http.post(`user/api.cos/getStsPut`, { data });
//审核提交订单
export const createAuditOrderApi = (data) => http.post(`user/api.examine/create`, { data });
//获取上次审核状态
export const getAuditOrderStatusApi = (data) => http.post(`user/api.examine/lastSubDetail`, { data });
//获取认证结果
export const getAuditResultApi = (data) => http.post(`user/api.examine/result`, { data });
//撤销审核订单
export const revocationAuditOrderApi = (data) => http.post(`user/api.examine/revoke`, { data });
//重新提交审核订单
export const anewSubmitAuditOrderApi = (data) => http.post(`user/api.examine/edit`, { data });
//项目列表
export const productListApi = (data) => http.post(`product/api.product/list`, { data });
//查询用户资产
export const userAssetApi = (data) => http.post(`user/api.userAssets/artificerIndex`, { data });
//技师已过审项目列表
export const userAuditedProductListApi = (data) => http.post(`user/api.artificerProduct/list`, { data });
//技术过审项目上下架
export const userAuditedProductSetStatusApi = (data) => http.post(`user/api.artificerProduct/setStatus`, { data });
//设置排班计划
export const userSetSchedulingApi = (data) => http.post(`user/api.artificer/setWorkPlan`, { data });
//查询排班计划
export const userGetSchedulingApi = (data) => http.post(`user/api.artificer/getWorkPlan`, { data });

export const getWorkDateList = (data) => http.post(`user/api.artificer/getWorkDateList`, { data });




