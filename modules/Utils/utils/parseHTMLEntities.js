function parseEntities (string) {
  return string
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

module.exports = parseEntities;
