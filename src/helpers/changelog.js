export const extractChangeLogMessage = obj => {
  const label = obj.labels.filter(l => {
    return l.name === "changelog";
  });

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

export const buildOutput = (logs, header, repoInfo, outputPrLinks) => {
  let out = `\n## ${header}
    `;

  logs.forEach(_ => {
    out += outputPrLinks
      ? `\n- ${_.message} PR: [\#${_.number}](https://github.com/${
          repoInfo.owner
        }/${repoInfo.repo}/pull/${_.number}) ${_.issues}`.trim()
      : `\n- ${_.message} ${_.issues}`.trim();
  });
  console.log(out);
};
