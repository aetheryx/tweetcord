const CRLF = '\r\n';

module.exports = function multipart (name, data) {
  const boundary = `--tweetcord--${Math.random().toString().slice(2, 7)}`;

  return {
    body: [
      CRLF,
      '--', boundary,
      CRLF,
      'Content-Disposition: form-data;',
      `name="${name}"`,
      CRLF, CRLF,
      data,
      CRLF,
      '--', boundary,
      '--'
    ].join(''),
    contentType: `multipart/form-data; boundary=${boundary}`
  };
};
