// From http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function getTokens () {
  const tokens = [
    { name: 'pre', token: '```', elementName: 'pre', multiline: true, plainContent: true },
    { name: 'code', token: '`', elementName: 'code', ignoreAfter: true, plainContent: true },
    { name: 'bold', token: '*', elementName: 'b', requireNonTokens: true, spaceWrapIgnored: true },
    { name: 'italics', token: '_', elementName: 'i', requireNonTokens: true },
    { name: 'strikethrough', token: '~', elementName: 's', requireNonTokens: true, spaceWrapIgnored: true }
  ];
  tokens.forEach(function (t) {
    if (!t.regex) {
      const before = '(^|[\\s\\?\\.,\\-!\\^;:{(\\[%$#+="])';
      const content = t.multiline ? '([\\s\\S]*?)?' : '(.*?\\S *)?';
      const after = t.ignoreAfter ? '' : '(?=$|\\s|[\\?\\.,\'\\-!\\^;:})\\]%$~{\\[<#+="])';
      const token = escapeRegExp(t.token);
      const pattern = before + token + content + token + after;
      t.regex = new RegExp(pattern, 'g');
    }
  });
  return tokens;
}

module.exports = getTokens;
