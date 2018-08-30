#!/usr/bin/env ./node_modules/.bin/babel-node
import * as fs from "fs";

import Octokit from "@octokit/rest";
import { extractFromGithubUrl } from "./helpers/github";
import { commandLineSetUpPublish } from "./helpers/cli";

async function publishDraftRelease() {
  const { owner, repo } = repoInfo;

  console.log(
    `Creating draft release ${nextVersion} (${commit}) to ${owner}/${repo}`
  );

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
    console.log(`Draft release created (${result.data.html_url})`);
  } else {
    console.log("Draft release failed", result.status);
  }
  return result;
}

async function main() {
  await publishDraftRelease();
}

/* main*/

const { repo, nextVersion, commit, file, token } = commandLineSetUpPublish();

const repoInfo = extractFromGithubUrl(repo);
const octokit = new Octokit();
const content = fs.readFileSync(file, "utf8");

octokit.authenticate({
  type: "token",
  token
});

main();
