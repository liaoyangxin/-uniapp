import http from "../utility/request.js";


/************ 社区 start ***************/

//首页bannar
export const communityBannerListApi = (data) => http.get(`/cmsprovider/v2/collection/banner/indexlist`, { data });


/************ 社区 end ***************/

