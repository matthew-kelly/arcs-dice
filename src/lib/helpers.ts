export function round(num: number, toPercent = false) {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	});
	if (toPercent) {
		num = num * 100;
	}
	return formatter.format(num);
}
