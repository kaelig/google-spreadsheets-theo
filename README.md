# google-spreadsheets-theo

Import [design tokens](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421) from a Google Spreadsheet to a format digestable by [Theo](https://github.com/salesforce-ux/theo).

## Quick start

This example shows how to manage color tokens using Google Spreadsheets and Theo.

The end result is available in the [`./example`](https://github.com/kaelig/google-spreasheets-theo/tree/master/example) directory.

### 1. Create a Google Spreadsheet to store the design tokens

Paste this table in a new Google spreadsheet, and populate it with the project or company’s design tokens:

| name            | value   | type  | category         | comment                                   |
| --------------- | ------- | ----- | ---------------- | ----------------------------------------- |
| color-primary   | red     | color | background-color | Primary color for use on all main actions |
| color-secondary | #ff00ff | color | background-color |                                           |
| color-tertiary  | green   | color | background-color |                                           |

It should look something like this [example Google Spreadsheet](https://docs.google.com/spreadsheets/d/1O0QOUUq8N-NfHmlGWa61TN6oOSdQMBaDq0lp6DsCReQ/edit#gid=0).

### 2. Publish the spreadsheet to the web

`google-spreadsheets-theo` is only able to access the contents of the spreadsheet if it’s publicly published to the web.

1. In the **File** menu, select **Publish to the web…**
2. Click the **Publish** button (leave the default options)

### 3. Install Theo and `google-spreadsheets-theo`

Using [yarn](https://yarnpkg.com/):

```
yarn add theo google-spreadsheets-theo --dev
```

Or, using npm:

```
npm install theo google-spreadsheets-theo --save-dev
```

### 4. Set up Theo and google-spreadsheets-theo

In a file called `build-tokens.js`, paste:

```js
const fs = require('fs');
const path = require('path');
const theo = require('theo');
const googleSpreadsheetsTheo = require('google-spreasheets-theo');

const config = {
  // URL of the spreadsheet
  // REPLACE WITH YOUR OWN
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/xxx/edit#gid=0',

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
```

⚠ Don’t forget to change the value of `spreadsheetUrl` in the `config` object.

### 5. Run the script

Add the script to the project’s `package.json`:

```json5
  // package.json
  "scripts": {
    // copy-paste this line:
    "build-tokens": "node ./build-tokens.js",
  },
```

In a terminal, run:

```
yarn build-tokens
```

Or, using npm:

```
npm run build-tokens
```
