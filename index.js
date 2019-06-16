const fetch = require('node-fetch');

const getKeyFromSpreadsheetUrl = (url) => url.split('/')[5];
const createFeedUrl = (key, worksheetId) =>
  `https://spreadsheets.google.com/feeds/list/${key}/${worksheetId}/public/values?alt=json`;

const fetchSpreadsheetFeed = async (key, worksheetId) => {
  const response = await fetch(createFeedUrl(key, worksheetId));
  const json = await response.json();
  return json;
};

const mapJsonToTheoTokens = (json) => ({
  props: json.feed.entry.map((token) => ({
    name: token.gsx$name.$t,
    value: token.gsx$value.$t,
    category: token.gsx$category.$t,
    type: token.gsx$type.$t,
    comment: token.gsx$comment.$t === '' ? undefined : token.gsx$comment.$t,
  })),
});

const googleSpreadsheetsTheo = (module.exports = async (url, worksheetId) => {
  const key = getKeyFromSpreadsheetUrl(url);
  try {
    const json = await fetchSpreadsheetFeed(key, worksheetId);
    const tokens = mapJsonToTheoTokens(json);
    return JSON.stringify(tokens);
  } catch (e) {
    throw new Error('Fetching tokens failed.');
  }
});

googleSpreadsheetsTheo.mapJsonToTheoTokens = mapJsonToTheoTokens;
googleSpreadsheetsTheo.getKeyFromSpreadsheetUrl = getKeyFromSpreadsheetUrl;
googleSpreadsheetsTheo.createFeedUrl = createFeedUrl;
