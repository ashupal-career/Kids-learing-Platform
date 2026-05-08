export const numbers = [];

// Numbers 1 se 100 tak generate karein
for(let i = 1; i <= 100; i++) {
  numbers.push({
    id: i,
    number: i,
    spelling: getNumberSpelling(i),
    color: getGradientColor(i)
  });
}

function getNumberSpelling(num) {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  if(num < 10) return ones[num];
  if(num < 20) return teens[num - 10];
  if(num < 100) {
    let ten = Math.floor(num / 10);
    let one = num % 10;
    return tens[ten] + (one ? '-' + ones[one] : '');
  }
  if(num === 100) return 'one hundred';
  return num.toString();
}

function getGradientColor(num) {
  // Define color ranges for different number groups
  const colorRanges = [
    { range: [1, 10], start: 'from-red-400', end: 'to-red-600' },
    { range: [11, 20], start: 'from-blue-400', end: 'to-blue-600' },
    { range: [21, 30], start: 'from-green-400', end: 'to-green-600' },
    { range: [31, 40], start: 'from-yellow-400', end: 'to-yellow-600' },
    { range: [41, 50], start: 'from-purple-400', end: 'to-purple-600' },
    { range: [51, 60], start: 'from-pink-400', end: 'to-pink-600' },
    { range: [61, 70], start: 'from-indigo-400', end: 'to-indigo-600' },
    { range: [71, 80], start: 'from-orange-400', end: 'to-orange-600' },
    { range: [81, 90], start: 'from-teal-400', end: 'to-teal-600' },
    { range: [91, 100], start: 'from-cyan-400', end: 'to-cyan-600' }
  ];
  
  for (let range of colorRanges) {
    if (num >= range.range[0] && num <= range.range[1]) {
      return `bg-gradient-to-br ${range.start} ${range.end}`;
    }
  }
  
  return 'bg-gradient-to-br from-gray-400 to-gray-600';
}

// Optional: If you want numbers only till 50, use this:
/*
export const numbers = [];

for(let i = 1; i <= 50; i++) {
  numbers.push({
    id: i,
    number: i,
    spelling: getNumberSpelling(i),
    color: getGradientColor(i)
  });
}
*/