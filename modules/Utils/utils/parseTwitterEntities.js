const entityMap = {
  'text':        { char: '#', value: 'text',        endpoint: '/hashtag/' },
  'screen_name': { char: '@', value: 'screen_name', endpoint: '/' }
};

const escapeMarkdown = /(_|\*|~)/g; // Escape markdown in entities, in twitter handles with (ex) underscores

// This function parses Twitter entities (hashtags, mentions) to have hyperlinks and be bolded.
module.exports = function parseTwitterEntities (body, entities) {
  for (const entityType of Object.values(entities)) {
    for (const entity of entityType) {
      for (const parser in entityMap) {
        if (entity[parser]) {
          const info = entityMap[parser];
          body = body.replace(
            new RegExp(info.char + entity[info.value], 'i'),
            `[**${info.char}${entity[info.value].replace(escapeMarkdown, '\\$1')}**](https://twitter.com${info.endpoint}${entity[info.value]})`
          );
        }
      }
    }
  }

  return body;
};
