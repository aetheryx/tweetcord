function parse (querystring) {
  const output = {};

  if (querystring.startsWith('?')) {
    querystring = querystring.slice(1);
  }

  querystring = querystring
    .split('&')
    .map(pair => pair.split('=')
      .map(decodeURIComponent));

  for (const pair of querystring) {
    output[pair[0]] = pair[1];
  }

  return output;
}

function create (obj) {
  const querystrings = [];

  for (const item in obj) {
    querystrings.push(`${encodeURIComponent(item)}=${encodeURIComponent(obj[item])}`);
  }

  return `?${querystrings.join('&')}`;
}

module.exports = { parse, create }