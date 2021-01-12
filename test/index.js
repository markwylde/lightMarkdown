const path = require('path');
const fs = require('fs');
const test = require('basictap');

const lightMarkdown = require('../lib');

const casesDir = path.join(__dirname, 'cases');

fs.readdirSync(casesDir)
  .map(function (file) {
    const fileExtIndex = file.indexOf('.lmd');
    const filePath = path.join(casesDir, file);
    if (fileExtIndex !== -1 && fs.statSync(filePath).isFile()) {
      const testName = file.substring(0, fileExtIndex);
      const matchingHtmlFile = path.join(casesDir, testName + '.html');
      if (fs.existsSync(matchingHtmlFile) && fs.statSync(matchingHtmlFile).isFile()) {
        return {
          name: testName.replace(/-/g, ' '),
          lmd: fs.readFileSync(filePath, 'utf-8'),
          expectedHtml: fs.readFileSync(matchingHtmlFile, 'utf-8')
        };
      }
    }

    return null;
  })
  .filter(function (testCase) {
    return testCase;
  })
  .forEach(function (testCase) {
    test(testCase.name, function (t) {
      t.plan(1);
      const actualHtml = lightMarkdown(testCase.lmd);
      t.equal(actualHtml, testCase.expectedHtml);
    });
  });
