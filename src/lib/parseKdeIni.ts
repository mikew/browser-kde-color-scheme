const COMMENT_IDENTIFIER = /^#/;
const GROUP_IDENTIFIER = /^\[([^\]]+)\]/;
const ALL_GROUP_IDENTIFIER = /\[([^\]]+)\]/g;
const VALUE_IDENTIFIER = /^(.+)=(.+)/;

export interface ParsedKdeIni {
  [groupKey: string]: any;
}

function parseKdeIni(input: string) {
  const lines = input.split(/\r?\n/);

  const obj: ParsedKdeIni = {
    __UNGROUPED: {},
  };
  let currentGroupName = '__UNGROUPED';

  for (const line of lines) {
    const commentMatches = line.match(COMMENT_IDENTIFIER);
    const groupMatches = line.match(GROUP_IDENTIFIER);
    const valueMatches = line.match(VALUE_IDENTIFIER);

    if (commentMatches) {
      continue;
    } else if (groupMatches) {
      const groupName = Array.from(line.matchAll(ALL_GROUP_IDENTIFIER))
        .map((group) => group[1])
        .join('__');

      if (groupName !== currentGroupName) {
        if (!obj[groupName]) {
          obj[groupName] = {};
          currentGroupName = groupName;
        }
      }
    } else if (valueMatches) {
      const [_match, key, value] = valueMatches;

      if (key != null && value != null) {
        obj[currentGroupName][key] = value;
      }
    }
  }

  return obj;
}

export default parseKdeIni;
