/**
 * version 1.1.7
 */

class Request {
	constructor(config = {}) {
		this.config = {};
		this.config.baseUrl = config.baseUrl ? config.baseUrl : '';
		this.config.dataType = config.dataType ? config.dataType : 'json';
		this.config.responseType = config.responseType ? config.responseType : 'text';
		this.config.header = config.header ? config.header : {};
		this.reqInterceptors = null;
		this.resInterceptors = null;
		this.interceptors = {
			request: fn => {
				this.reqInterceptors = fn;
			},
			response: fn => {
				this.resInterceptors = fn;
			}
		}
	}
	async get(url, config = {}) {
		config.url = url
		config.method = 'GET'
		return this._request('get', url, config);
	}
	async post(url, config = {}) {
		config.url = url
		config.method = 'POST'
		return this._request('post', url, config);
	}
	async put(url, config = {}) {
		config.url = url
		config.method = 'PUT'
		return this._request('put', url, config);
	}
	async delete(url, config = {}) {
		config.url = url
		config.method = 'DELETE'
		return this._request('delete', url, config);
	}
	setConfig(config = {}) {
		this.config = this._deepCopy(this._merge(this.config, config));
	}
	getConfig() {
		return this.config;
	}
	_request(method, url, config) {
		const _this = this;
		let newConfig = this._deepCopy(this._merge(this.config, config));
		let lastConfig = {};
		if (this.reqInterceptors && typeof this.reqInterceptors === 'function') {
			let reqInterceptors = this.reqInterceptors(newConfig);
			if (!reqInterceptors && process.env.NODE_ENV === "development") {
				console.warn('请求被拦截，此消息仅在开发环境显示。')
				return false;
			} else if (Object.prototype.toString.call(reqInterceptors) === "[object Promise]") {
				return reqInterceptors;
			}
			lastConfig = this._deepCopy(reqInterceptors);
		} else {
			lastConfig = this._deepCopy(newConfig);
		}
		let fullUrl = this._formatUrl(lastConfig.baseUrl, url + this.queryStr(lastConfig.urlSuffix));
		
		return new Promise((resolve, reject) => {
			uni.request({
				url: fullUrl,
				method,
				withCredentials: true,
				data: lastConfig.data ? lastConfig.data : {},
				header: lastConfig.header,
				dataType: lastConfig.dataType,
				responseType: lastConfig.responseType,
				timeout:15000,
				async complete(response) {
					let res = response;
					if (_this.resInterceptors && typeof _this.resInterceptors === 'function') {
						let resInterceptors = _this.resInterceptors(res);
						if (!resInterceptors) {
							reject('返回值已被您拦截！');
							return;
						} else if (Object.prototype.toString.call(resInterceptors) ===
							"[object Promise]") {
							try {
								let promiseRes = await resInterceptors;
								resolve(promiseRes)
							} catch (error) {
								reject(error)
							}
						} else {
							res = resInterceptors;
						}
					}
					resolve(res);
				}
			});
		})
	}
	_formatUrl(baseUrl, url) {
		if (!baseUrl) return url;
		let formatUrl = '';
		const baseUrlEndsWithSlash = baseUrl.endsWith('/');
		const urlStartsWithSlash = url.startsWith('/');
		if (baseUrlEndsWithSlash && urlStartsWithSlash) {
			formatUrl = baseUrl + url.substring(1);
		} else if (baseUrlEndsWithSlash || urlStartsWithSlash) {
			formatUrl = baseUrl + url;
		} else {
			formatUrl = baseUrl + '/' + url;
		}
		return formatUrl;
	}
	_merge(oldConfig, newConfig) {
		let mergeConfig = this._deepCopy(oldConfig);
		if (!newConfig || !Object.keys(newConfig).length) return mergeConfig;
		for (let key in newConfig) {
			if (key !== 'header') {
				mergeConfig[key] = newConfig[key];
			} else {
				if (Object.prototype.toString.call(newConfig[key]) === '[object Object]') {
					for (let headerKey in newConfig[key]) {
						mergeConfig[key][headerKey] = newConfig[key][headerKey];
					}
				}
			}
		}
		return mergeConfig;
	}
	_deepCopy(obj) {
		let result = Array.isArray(obj) ? [] : {};
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (typeof obj[key] === 'object') {
					result[key] = this._deepCopy(obj[key]);
				} else {
					result[key] = obj[key];
				}
			}
		}
		return result;
	}
	// 对象转query字符串的方法
	queryStr(obj) {
		// 首先判断obj是否为真，为真则进行处理，不然直接return
		if (obj) {
			// 定义变量接收query字符串
			let query = ""
			// 循环遍历对象
			for (let i in obj) {
				// 定义变量接收对象的value值
				let value = obj[i]
				// 若对象的value值为数组，则进行join打断
				if (Array.isArray(value)) {
					value = value.join(",")
				}
				// 进行字符串拼接
				query += `&${i}=${value}`
			}
			// replace返回一个新的字符串，要用query重新接受一下，并把第一个&替换为?
			query = query.replace('&', '?')
			// 返回生成的query字符串
			return query
		}
		return ""
	}
}

if (!global.$request) {
	global.$request = new Request();
}

export default global.$request;
