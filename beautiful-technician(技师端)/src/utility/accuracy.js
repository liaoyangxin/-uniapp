import Big from 'big.js';

//加法
export const addPrecision = function(arg1, arg2) {
	const num1 = (new Big(arg1)).plus(arg2)
	return parseFloat(num1.toString());
};
//减法
export const subPrecision = function(arg1, arg2) {
	const num1 = (new Big(arg1)).minus(arg2)
	return parseFloat(num1.toString());
};
//乘法
export const mulPrecision = function(arg1, arg2) {
	const num1 = (new Big(arg1)).times(arg2)
	return parseFloat(num1.toString());
};
//除法
export const divPrecision = function(arg1, arg2) {
	const num1 = (new Big(arg1)).div(arg2)
	return parseFloat(num1.toString());
};
