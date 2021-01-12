function getRegex (tokens) {
  const allTokenChars = tokens.map(function (t) {
    return t.token.length === 1 ? t.token : '';
  }).join();

  const nonTokensCharsRegex = new RegExp('[^' + allTokenChars + ']');

  // Multiline quote >>>
  const multilineQuoteRegex = /(^|\n)&gt;&gt;&gt;([\s\S]*$)/;

  // Single line quote > or sequential lines that start with >.
  const singleLineQuoteRegex = /(^|\n)&gt;(([^\n]*)(\n&gt;[^\n]*)*)/g;

  // Two new lines in a row
  const doubleLineBreakRegex = /\r?\n\r?\n\r?/g;

  // Single line break
  const singleLineBreakRegex = /\r?\n\r?/g;

  // Url
  const urlRegex = /(\(?((https?:\/\/|ftp:\/\/).*?[a-z\u00a1-\uffff_\/0-9\-\#=._~:/?+,;=@()[\]&])(?=(\.|,|;|\?|\!)?("|'|«|»|\&gt\;|<|>|\[|\s|\r|\n|$)))/gi;

  return {
    nonTokensChars: nonTokensCharsRegex,
    multilineQuote: multilineQuoteRegex,
    singleLineQuote: singleLineQuoteRegex,
    blockquoteTags: /<\/?blockquote>/ig,
    headingsH1: /^\s*# (.*)$/gm,
    headingsH2: /^\s*## (.*)$/gm,
    headingsH3: /^\s*### (.*)$/gm,
    doubleLineBreak: doubleLineBreakRegex,
    singleLineBreak: singleLineBreakRegex,
    url: urlRegex
  };
}

module.exports = getRegex;
