// 引入插件
import request from '@/common/request/request.js'
//vuex
import store from '../store/index.js'
//签名
import {
    autographFun
} from '../common/request/requestAutograph.js'

import {
    randomStr
} from '@/utility/random.js'
// 全局配置
request.setConfig({
    // 'http://relaxed.cn.vc:9903/' , 'http://8.142.81.224:8081/', 'https://rapi .relaverse.cn/'
    baseUrl: process.env.NODE_ENV === 'development' ? 'https://test.api.mdj.meilinxian.cn/' : 'https://test.api.mdj.meilinxian.cn/',
    dataType: 'json', // 可删除，默认为json 
    responseType: 'text', // 可删除，默认为text
})

// 设置请求拦截器
request.interceptors.request(config => {
    // 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数
    // 追加请求头，推荐
    // config.header['content-type'] = 'application/json';
    // config.header['tourist-no'] = store.state.randomStr32;//随机32位数据
    // config.header['version'] = store.state.version;//版本号
    config.urlSuffix = {
        app_type: 'wechat', //应用类型：wechat 微信
        app_guid: '11ed12d06c64eb3ab74d0242c0a85822', //应用唯一标识
        expires: parseInt((new Date().getTime() / 1000).toFixed(0)), //当前时间戳
        token: store.state.userToken || '',
        noncestr: randomStr(true, true, true, 32)
    }
    if (!config.header.ifTouristLogin) {
        config.urlSuffix.signature = encodeURIComponent(autographFun(config)) //签名
    }
    // return false; // 终止请求
    // return Promise.reject('error from request interceptors'); // 向外层抛出错误，用catch捕获
    return config; // 返回修改后的配置，如未修改也需添加这行
})

// 设置响应拦截器
request.interceptors.response(res => {
    // 接收请求，执行响应操作
    // 您的逻辑......
    //判断code是不是200 系列
    if (res.statusCode < 200 || res.statusCode >= 300) {
        uni.showToast({
            title: '当前访问人数较多，请稍后再试',
            icon: 'none'
        })
        return Promise.reject({
                msg: '当前访问人数较多，请稍后再试'
            }) // 向外层抛出错误，用catch捕获
    };
    if (res.data.code === 704001) {
        store.commit('deleteUserInfo')
        uni.navigateTo({
            url: '/pages/login/login'
        });
        return Promise.reject()
    };
    if (res.data.code === 704003) {
        uni.navigateTo({
            url: '/pages/login/bind-mobile-phone'
        });
        return Promise.reject()
    };
    if (res.data.code === 704004) {
        uni.navigateTo({
            url: '/pages/user/user-audit'
        });
        return Promise.reject()
    };
    return res.data.code === 0 ? res.data : Promise.reject(res.data)

    // return false;    // 阻止返回,页面不会接收返回值
    // return {message: '自定义值，来自拦截器'};   // 返回您自定义的值，将覆盖原始返回值
    // return Promise.reject('error from response interceptors') // 向外层抛出错误，用catch捕获
    // return res; // 原样返回
})
export default request;