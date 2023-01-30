import http from "../utility/request.js";
// const baseUrl = process.env.NODE_ENV === 'development' ? 'https://test.api.supply.meilinxian.cn/' : 'https://api.supply.meilinxian.cn/'
const baseUrl = process.env.NODE_ENV === 'development' ? 'https://test.api.supply.meilinxian.cn/' : 'https://api.supply.meilinxian.cn/'
    //唤起微信H5登录
export const wechatH5LoginApi = (data) => http.post(`user/user/arouseLogin`, { data, baseUrl });
//微信登录
export const wechatLoginApi = (data) => http.post(`user/user/login`, { data, baseUrl });
//获取用户信息
export const userInfoApi = (data) => http.post(`user/api.userInfo/index`, { data });

export const sendCodeApi = (data) => http.post(`user/user/sendBindCode`, { data, baseUrl });
//绑定手机号
export const bindPhoneApi = (data) => http.post(`user/user/bindMobile`, { data, baseUrl });
//新增地址
export const addressAddApi = (data) => http.post(`user/userAddress/create`, { data, baseUrl });

//地址列表
export const addressEditApi = (data) => http.post(`user/userAddress/update`, { data, baseUrl });

//地址列表
export const addressListApi = (data) => http.post(`user/userAddress/list`, { data, baseUrl });

//地址删除
export const addressDelApi = (data) => http.post(`user/userAddress/del`, { data, baseUrl });

//地址详情
export const addressDetailApi = (data) => http.post(`user/userAddress/info`, { data, baseUrl });

//支付数据
export const payOrderApi = (data) => http.post(`pay/order/getSign`, { data, baseUrl });

//我得资产
export const userAssets = (data) => http.post(`user/api.userAssets/index`, { data });

// 资产明细
export const orderDetailed = (data) => http.post(`user/api.userAssets/details`, { data });

// 提现
export const wthdrawalApi = (data) => http.post(`orders/api.withdrawalOrder/flowing`, { data });

// 邀请记录 
export const inviteRecord = (data) => http.post(`user/api.userInfo/inviteRecord`, { data });

// 用户基本信息
export const userBasicApi = (data) => http.post(`user/api.userInfo/index`, { data });

//用户余额充值、
export const userRecharge = (data) => http.post(`orders/api.rechargeIncomeOrder/create`, { data });

// 用户确认
export const userFinish = (data) => http.post(`orders/api.order/userFinish`, { data });
//获取JSSDK使用配置
export const getWeChatJSconfigApi = (data) => http.post(`user/weiXin/getJsSdkConfigArray`, { data,baseUrl});
// 邀请上下级关系绑定
export const inviteBind = (data) => http.post(`user/api.userInfo/saveInviter`, { data });

// 获取券包信息
export const getPack = (data) => http.post(`user/api.coupon/getPack`, { data });
// 领取券包
export const drawPack = (data) => http.post(`user/api.coupon/drawPack`, { data });