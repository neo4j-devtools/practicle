export const extractChangeLog = obj => {
  const label = obj.labels.filter(l => {
    return l.name === "changelog";
  });

  return label.length > 0 ? obj.title : null;
};

export const buildOutput = (logs, header, outputPrLinks) => {
  let out = `
    # Neo4j Browser - ${header}
    `;

  logs.forEach(_ => {
    out += `
      * ${_.message}`;
  });
  console.log(out);
};
