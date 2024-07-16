export function round(num: number, toPercent = false) {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	});
	if (toPercent) {
		num = num * 100;
	}
	let res = formatter.format(num);
	// fix rounding to 100%, impossible result
	if (toPercent && res === '100') {
		res = '99.99';
	}
	return res;
}
