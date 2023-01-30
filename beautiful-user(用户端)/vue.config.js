//vue.config.js
const TransformPages = require('uni-read-pages');
const { webpack } = new TransformPages();
const dayjs = require('dayjs');
const version = dayjs(new Date()).format('MMDDhhmm');

console.log(version, 'version');

module.exports = {
	transpileDependencies: ['uview-ui', 'z-paging'],
	filenameHashing: true, // 文件的Hash值
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath'],
					});
					return JSON.stringify(tfPages.routes);
				}, true),
			}),
		],

		output: {
			// 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
			filename: `js_${version}/[name].js`,
			chunkFilename: `js_${version}/[name].js`,
		},
	},
};
