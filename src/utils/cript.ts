export function encrypt(str: string) {
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    arr[i] = `00${str.charCodeAt(i).toString(16)}`.slice(-4);
  }
  return `\\u${arr.join('\\u')}`;
}

export function decrypt(str: string | undefined) {
  if (str !== undefined) {
    return unescape(str.replace(/\\/g, '%'));
  }
}
