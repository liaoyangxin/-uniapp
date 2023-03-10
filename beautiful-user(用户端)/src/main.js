import Vue from 'vue';
import App from './App';

// ui库
import uView from 'uview-ui';
Vue.use(uView);
//通用通知
import failMessage from 'utility/message.js';
Vue.use(failMessage);
Vue.filter('setCdnImgSize', (url, size = '60') => {
    return url.indexOf('blob') === -1 ? url + '?imageMogr2/thumbnail/' + size + 'x' : url;
});
//vuex
import store from './store';
//router
import { router, RouterMount } from 'router.js';
Vue.use(router);

// 隐私协议
Vue.prototype.PrivacyAgreement = 'https://cdn.mdj.meilinxian.cn/xieyi/yinsi.html';
//软件许可使用协议
Vue.prototype.UserAgreement = 'https://cdn.mdj.meilinxian.cn/xieyi/ruanjian.html';

// Vue 2 转 Vue 3, 在 main.js 中写入以下代码即可
function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

uni.addInterceptor({
    returnValue(res) {
        if (!isPromise(res)) {
            return res;
        }
        return new Promise((resolve, reject) => {
            res.then(res => {
                if (res[0]) {
                    reject(res[0]);
                } else {
                    resolve(res[1]);
                }
            });
        });
    },
});
Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
    ...App,
    store,
});
app.$mount();