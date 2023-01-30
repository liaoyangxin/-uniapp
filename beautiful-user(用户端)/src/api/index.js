import request from "../utility/request.js";


/************ 社区 start ***************/

// 首页bannar
export const communityBannerListApi = (data) => request.post('admin/api.banner/list', { data });


/************ 社区 end ***************/


