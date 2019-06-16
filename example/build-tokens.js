const fs = require('fs');
const path = require('path');
const theo = require('theo');
const googleSpreadsheetsTheo = require('google-spreadsheets-theo');

const config = {
  // URL of the spreadsheet
  spreadsheetUrl:
    'https://docs.google.com/spreadsheets/d/1O0QOUUq8N-NfHmlGWa61TN6oOSdQMBaDq0lp6DsCReQ/edit#gid=0',

  // Each worksheet is for a different type of tokens (colors, spacing, typography…)
  worksheets: [
    {
      id: 1, // position of the worksheet (or "tab") in Google Spreadsheets
      name: 'colors',
    },
    // Example for adding spacing tokens:
    // {
    //   id: 2,
    //   name: 'spacing',
    // },
  ],

  // Output formats (see https://github.com/salesforce-ux/theo#formats)
  formats: [
    {
      transform: 'web',
      format: 'scss',
    },
    // Add formats below.
    // {
    //   transform: 'ios',
    //   format: 'ios.json',
    // },
  ],

  // Where the output files should be stored
  outputDirectory: './tokens/',
};

const convert = (name, transform, format, data) =>
  theo
    .convert({
      transform: {
        type: transform,
        file: `${name}.json`,
        data,
      },
      format: {
        type: format,
      },
    })
    .then((contents) => contents)
    .catch((error) => console.log(`Something went wrong: ${error}`));

const main = async (config) => {
  for ({id, name} of config.worksheets) {
    const data = await googleSpreadsheetsTheo(config.spreadsheetUrl, id);

    for ({transform, format} of config.formats) {
      const tokens = await convert(name, transform, format, data);
      const filename = `${config.outputDirectory}${name}.${format}`;
      await fs.promises
        .mkdir(path.dirname(filename), {recursive: true})
        .then(() => {
          fs.writeFileSync(filename, tokens);
        });
      console.log(`✔ Design tokens written to ${filename}`);
    }
  }
};

main(config);
