import http from "../utility/request.js";
const baseUrl = process.env.NODE_ENV === 'development' ? 'https://test.api.supply.meilinxian.cn/' : 'https://test.api.supply.meilinxian.cn/'
    //获取JSSDK使用配置
export const getWeChatJSconfigApi = (data) => http.post(`user/weiXin/getJsSdkConfigArray`, { data, baseUrl });
//唤起微信H5登录
export const wechatH5LoginApi = (data) => http.post(`user/user/arouseLogin`, { data, baseUrl });
//微信登录
export const wechatLoginApi = (data) => http.post(`user/user/login`, { data, baseUrl });
//获取用户信息
export const userInfoApi = (data) => http.post(`user/api.userInfo/artificerIndex`, { data });
//获取验证码
export const sendCodeApi = (data) => http.post(`user/user/sendBindCode`, { data, baseUrl });
//绑定手机号
export const bindPhoneApi = (data) => http.post(`user/user/bindMobile`, { data, baseUrl });
//创建保证金充值订单
export const createEarnestMoneyOrderApi = (data) => http.post(`orders/api.bondOrder/create`, { data });
//创建余额充值订单
export const createBalanceOrderApi = (data) => http.post(`orders/api.rechargeIncomeOrder/create`, { data });
//支付数据
export const payOrderApi = (data) => http.post(`pay/order/getSign`, { data, baseUrl });
//提现银行卡
export const withdrawalOrderCard = (data) => http.post(`orders/api.withdrawalOrder/bankCard`, { data });
//创建提现订单
export const createWithdrawalOrderApi = (data) => http.post(`orders/api.withdrawalOrder/create`, { data });
//提现订单列表
export const withdrawalOrderListApi = (data) => http.post(`orders/api.withdrawalOrder/flowing`, { data });
//充值明细，分佣明细，结算明细订单列表
export const closeAnAccountOrderListApi = (data) => http.post(`user/api.userAssets/artificerDetails`, { data });
// 邀请记录 
export const inviteRecord = (data) => http.post(`user/api.userInfo/inviteRecord`, { data });
// 邀请上下级关系绑定
export const inviteBind = (data) => http.post(`user/api.userInfo/saveInviter`, { data });