#!/usr/bin/env ./node_modules/.bin/babel-node
import Octokit from "@octokit/rest";
import { extractFromGithubUrl } from "./helpers/github";

const octokit = new Octokit();
async function fetchAllReleases(repoInfo) {
  const perPage = 30;

  async function getReleases(page) {
    const result = await octokit.repos.getReleases({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      per_page: perPage,
      page
    });
    return result.data;
  }
  let results = [];
  let page = 1;
  let stillGettingReleases = true;
  while (stillGettingReleases) {
    const data = await getReleases(page);
    results = [...results, ...data];
    stillGettingReleases = data.length === perPage;
    page += 1;
  }
  return results;
}

async function main(args) {
  try {
    const releases = await fetchAllReleases(extractFromGithubUrl(args.repo));
    const release = releases.find(_ => _.tag_name === args.tag);

    if (release && release.body !== undefined) {
      console.log(release.body);
    } else {
      throw new Error("No release body found");
    }
  } catch (e) {
    console.log(
      "An error occurred. Make sure you specify a Github release tag (a tag that is marked as a release in Github)",
      e.message
    );
    process.exit(1);
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
