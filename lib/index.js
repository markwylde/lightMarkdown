const getRegex = require('./getRegex');
const getTokens = require('./getTokens');

const tokens = getTokens();
const regex = getRegex(tokens);
const plainToken = '₪₪PLaiN₪₪';

const defaultOptions = {
  headings: true,
  bold: true,
  italics: true,
  strikethrough: true,
  pre: true,
  code: true,
  longQuote: true,
  quote: true,
  autoLink: true,
  paragraph: true,
  lineBreaks: true
};

function lightMarkdown (md, options = defaultOptions) {
  md = escapeHtml(md);
  const plains = [];

  tokens.forEach(function (t) {
    if (options[t.name]) {
      md = md.replace(t.regex, function (match, g1, g2) {
        if (!g2 ||
          t.requireNonTokens && !regex.nonTokensChars.test(g2) ||
          (t.token.length === 1 && (g2[0] === t.token || g2.slice(-1) === t.token)) ||
          t.spaceWrapIgnored && g2[0] === ' ' && g2.slice(-1) === ' ') { return match; }

        if (typeof t.processContent === 'function') {
          g2 = t.processContent(g2);
        }
        if (t.plainContent) {
          const plainIndex = plains.push(g2) - 1;
          g2 = plainToken + plainIndex;
        }
        return g1 + '<' + t.elementName + '>' + g2 + '</' + t.elementName + '>';
      });
    }
  });

  if (options.longQuote) {
    md = md.replace(regex.multilineQuote, function (match, g1, g2) {
      if (match === '&gt;&gt;&gt;') { return match; }

      // trim start unless there are more '>' ahead
      g2 = g2.replace(/^([\s]*)(&gt;)*/, function (m, gg1, gg2) {
        return gg2 ? m : '';
      });
      return '<blockquote>' + g2 + '</blockquote>';
    });
  }

  if (options.quote) {
    md = md.replace(regex.singleLineQuote, function (match, g1, g2) {
      if (match === '&gt;') { return match; }
      g2 = g2.replace(/\n&gt;/g, '\n');
      return '<blockquote>' + g2 + '</blockquote>';
    });
  }

  if (options.headings) {
    md = md.replace(regex.headingsH1, function (match, g1) {
      return '<h1>' + g1.trim() + '</h1>';
    });

    md = md.replace(regex.headingsH2, function (match, g1) {
      return '<h2>' + g1.trim() + '</h2>';
    });

    md = md.replace(regex.headingsH3, function (match, g1) {
      return '<h3>' + g1.trim() + '</h3>';
    });
  }

  if (options.autoLink) {
    md = md.replace(regex.url, function (match, url) {
      let linkWrapperOpen = '';
      let linkWrapperClose = '';

      // Link can be wrapped by round brackets, an allowed character in an url
      if (url.substring(0, 1) === '(') {
        const lastCharacter = url.slice(-1);
        linkWrapperOpen = '(';
        url = url.slice(1, lastCharacter === ')' ? -1 : url.length);
        linkWrapperClose = lastCharacter === ')' ? ')' : '';
      }
      return linkWrapperOpen + '<a href="' + url + '" target="_blank">' + url + '</a>' + linkWrapperClose;
    });
  }

  if (options.paragraph) {
    let m;
    const doubleLineIndexes = [];
    while ((m = regex.doubleLineBreak.exec(md))) {
      doubleLineIndexes.push({
        start: m.index,
        length: m[0].length
      });
    }
    while ((m = regex.blockquoteTags.exec(md))) {
      doubleLineIndexes.push({
        start: m.index,
        length: m[0].length,
        suffix: m[0]
      });
    }
    doubleLineIndexes.push({
      start: md.length,
      length: 0
    });

    doubleLineIndexes.sort(function (a, b) {
      return a.start - b.start;
    });

    let withParagraphs = '';
    let startIndex = 0;
    doubleLineIndexes.forEach(function (doubleLine) {
      let paragraph = '';
      const paragraphContent = md.substring(startIndex, doubleLine.start);
      if (paragraphContent) {
        paragraph = '<p>' + paragraphContent + '</p>';
      }
      if (doubleLine.suffix) {
        paragraph += doubleLine.suffix;
      }
      withParagraphs += paragraph;
      startIndex = doubleLine.start + doubleLine.length;
    });
    md = withParagraphs;
  }

  if (options.lineBreaks) {
    md = md.replace(regex.singleLineBreak, '<br/>');
  }

  plains.forEach(function (p, plainIndex) {
    md = md.replace(plainToken + plainIndex, p);
  });

  return md;
}

function escapeHtml (content) {
  if (content) {
    content = content.replace(/>/g, '&gt;');
    content = content.replace(/</g, '&lt;');
  }
  return content;
}

module.exports = lightMarkdown;
