export const extractChangeLogMessage = (obj, labelFilter) => {
  const label = obj.labels.filter(l => labelFilter.includes(l.name));
  const changelogRegex = /(^|\n|\r)changelog\:(.*)/i;

  const getMessage = obj => {
    const regexMatch = obj.body && obj.body.match(changelogRegex);
    return regexMatch &&
      regexMatch.length >= 2 &&
      regexMatch[2] &&
      regexMatch[2] !== ""
      ? regexMatch[2].trim()
      : obj.title;
  };

  return label.length > 0 ? getMessage(obj) : null;
};

export const extractIssuesFromString = str => {
  const fixesRegex = /(^|\n|\r)fixes\:(.*)/i;
  const regexMatch = str && str.match(fixesRegex);
  return regexMatch && regexMatch.length >= 2 && regexMatch[2]
    ? `Issue(s): ${regexMatch[2].trim()}`
    : "";
};

const newLine = "\n";
export const buildOutput = (
  logs,
  header,
  repoInfo,
  outputPrLinks,
  outputAuthor
) => {
  let out = `\n## ${header}\n`;

  logs.forEach(_ => {
    out += outputPrLinks
      ? newLine +
        `- ${_.message} PR: [\#${_.number}](https://github.com/${
          repoInfo.owner
        }/${repoInfo.repo}/pull/${_.number}) ${_.issues}`.trim()
      : newLine + `- ${_.message} ${_.issues}`.trim();

    if (outputAuthor) {
      out += ` (${_.author})`;
    }

    out += newLine;
  });
  console.log(out);
};
