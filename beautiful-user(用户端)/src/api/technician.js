import request from "@/utility/request.js"

/************ 社区 start ***************/

// 技师列表
export const technicianListApi = (data) => request.post('user/api.artificer/list', { data });

// 技师详情
export const technicianDetailApi = (data) => request.post('user/api.artificer/detail', { data });

// 认证信息
export const authInfoApi = (data) => request.post(`user/api.artificer/authInfo`, { data });

/************ 社区 end ***************/