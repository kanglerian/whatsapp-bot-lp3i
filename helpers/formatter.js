const phoneNumberFormatter = function(number) {
  let formatted = number.replace(/\D/g, '');
  if (formatted.startsWith('0')) {
    formatted = '62' + formatted.substr(1);
  }
  if (!formatted.endsWith('@c.us')) {
    formatted += '@c.us';
  }
  return formatted;
}

const phoneNumberWithoutSuffix = function(formattedNumber) {
  let phoneNumber = formattedNumber.replace(/@c\.us$/, '');
  return phoneNumber;
}

module.exports = {
  phoneNumberFormatter,
  phoneNumberWithoutSuffix
}