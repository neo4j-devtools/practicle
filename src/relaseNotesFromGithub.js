#!/usr/bin/env ./node_modules/.bin/babel-node
import Octokit from "@octokit/rest";
import { extractFromGithubUrl } from "./helpers/github";

const octokit = new Octokit();

async function getRelease(tag, repoInfo) {
  const { owner, repo } = repoInfo;
  const result = await octokit.repos.getReleaseByTag({
    owner,
    repo,
    tag
  });

  return result.data;
}

async function main(args) {
  const release = await getRelease(args.tag, extractFromGithubUrl(args.repo));
  if (release && release.body) {
    console.log(release.body);
  }
}

/* main*/
export const init = args => {
  octokit.authenticate({
    type: "token",
    token: args.token
  });

  main(args);
};
