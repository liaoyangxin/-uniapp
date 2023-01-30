import request from "../utility/request.js";

/************ 社区 start ***************/

// 首页产品列表
export const productListApi = (data) => request.post('product/api.product/list', { data });

// 项目详情
export const productDetailApi = (data) => request.post('product/api.product/detail', { data });



/************ 社区 end ***************/