export const extractChangeLog = obj => {
  const label = obj.labels.filter(l => {
    return l.name === "changelog";
  });

  return label.length > 0 ? obj.title : null;
};

export const buildOutput = (logs, header, repoInfo, outputPrLinks) => {
  let out = `\n## Neo4j Browser - ${header}
    `;

  logs.forEach(_ => {
    debugger;
    out += outputPrLinks
      ? `\n- ${_.message} [\#${_.number}](https://github.com/${
          repoInfo.owner
        }/${repoInfo.repo}/pull/${_.number})
      `
      : `\n- ${_.message}`;
  });
  console.log(out);
};
