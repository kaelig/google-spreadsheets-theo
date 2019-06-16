const {
  mapJsonToTheoTokens,
  getKeyFromSpreadsheetUrl,
  createFeedUrl,
} = require('./');

describe('getKeyFromSpreadsheetUrl', () => {
  it('returns the key of the document for a specified URL', () => {
    expect(
      getKeyFromSpreadsheetUrl(
        'https://docs.google.com/spreadsheets/d/abcd/edit#gid=0',
      ),
    ).toBe('abcd');
  });
});

describe('createFeedUrl', () => {
  it('returns the feed url', () => {
    expect(createFeedUrl('abcd', 3)).toBe(
      'https://spreadsheets.google.com/feeds/list/abcd/3/public/values?alt=json',
    );
    expect(createFeedUrl('efgh', '4')).toBe(
      'https://spreadsheets.google.com/feeds/list/efgh/4/public/values?alt=json',
    );
  });
});

describe('mapJsonToTheoTokens', () => {
  const json = require('./__fixtures__/feed.json');
  const tokens = mapJsonToTheoTokens(json);

  it('returns an object with the same length as the original feed', () => {
    expect(tokens.props.length).toEqual(json.feed.entry.length);
  });
  it('maps JSON to Theo Tokens', () => {
    expect(tokens.props[0].name).toBe('color-primary');
    expect(tokens.props[0].value).toBe('red');
    expect(tokens.props[0].category).toBe('background-color');
    expect(tokens.props[0].type).toBe('color');
    expect(tokens.props[0].comment).not.toBe(undefined);
    expect(tokens.props[1].comment).toBe(undefined);
  });
});
