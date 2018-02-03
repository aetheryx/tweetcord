function percentEncode (str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

function parse (querystring) {
  const output = {};

  if (querystring.startsWith('?')) {
    querystring = querystring.slice(1);
  }

  querystring = querystring
    .split('&')
    .map(pair => pair.split('=').map(decodeURIComponent));

  for (const pair of querystring) {
    output[pair[0]] = pair[1];
  }

  return output;
}

function create (obj) {
  const querystrings = [];

  for (const item in obj) {
    querystrings.push(`${percentEncode(item)}=${percentEncode(obj[item])}`);
  }

  return `?${querystrings.join('&')}`;
}

module.exports = { parse, create };