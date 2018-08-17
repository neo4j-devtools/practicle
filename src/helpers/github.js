export const extractFromGithubUrl = url => {
  const tokens = url.split("/");
  const repo = tokens.pop().replace(/.git$/, "");
  const owner = tokens.pop();
  return {
    repo,
    owner
  };
};
