export const randomStr = function(num, maxA, minlA, fqy) {
	// num:随机数中是否包含数字
	// maxA:随机数中是否包大写字母
	// minlA:随机数中是否包小写字母
	// fqy:生成多少位随机数
	let arr = []
	let arr1 = []
	let arr2 = []
	if (num) {
		for (let m = 0; m <= 9; m++) {
			arr.push(m)
		}
	}
	if (maxA) {
		for (let m = 65; m <= 90; m++) {
			arr1.push(m)
		}
	}
	if (minlA) {
		for (let m = 97; m <= 122; m++) {
			arr2.push(m)
		}
	}
	if (!fqy) {
		console.log('生成位数必传')
		return
	}
	let mergeArr = arr.concat(arr1);
	let mergeArr1 = mergeArr.concat(arr2);
	let _length = mergeArr1.length
	let text = ''
	for (let m = 0; m < fqy; m++) {
		let text1 = ''
		let random = randomNum(0, _length)
		if ((mergeArr1[random]) <= 9) {
			text1 = mergeArr1[random]
		} else if ((mergeArr1[random]) > 9) {
			text1 = String.fromCharCode(mergeArr1[random])
		}
		text += text1
	}
	return text
};
export const randomNum = function(a, b) {
	var max = a;
	var min = b;
	if (a < b) {
		max = b;
		min = a;
	}
	return parseInt(Math.random() * (max - min)) + min;
}
