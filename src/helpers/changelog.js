export const extractChangeLogMessage = obj => {
  const label = obj.labels.filter(l => {
    return l.name === "changelog";
  });

  const changelogRegex = /(^|\n|\r)changelog\:(.*)/;

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

export const buildOutput = (logs, header, repoInfo, outputPrLinks) => {
  let out = `\n## ${header}
    `;

  logs.forEach(_ => {
    out += outputPrLinks
      ? `\n- ${_.message} [\#${_.number}](https://github.com/${
          repoInfo.owner
        }/${repoInfo.repo}/pull/${_.number})`
      : `\n- ${_.message}`;
  });
  console.log(out);
};
