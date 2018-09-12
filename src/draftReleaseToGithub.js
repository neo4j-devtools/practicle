#!/usr/bin/env ./node_modules/.bin/babel-node
import * as fs from "fs";

import Octokit from "@octokit/rest";
import { extractFromGithubUrl } from "./helpers/github";

const octokit = new Octokit();

async function publishDraftRelease(args, content, repoInfo) {
  const { owner, repo } = repoInfo;
  const { nextVersion, commit } = args;

  const result = await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: nextVersion,
    target_commitish: commit,
    name: nextVersion,
    body: content,
    draft: true,
    prerelease: false
  });
  if (result.status === 201) {
    console.log(result.data.html_url.split("/").reverse()[0]);
  } else {
    console.log("Draft release failed", result.status);
  }
  return result;
}

async function main(args, content) {
  await publishDraftRelease(args, content, extractFromGithubUrl(args.repo));
}

/* main*/
export const init = args => {
  octokit.authenticate({
    type: "token",
    token: args.token
  });

  main(args, fs.readFileSync(args.file, "utf8"));
};
