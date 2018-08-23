#!/usr/bin/env ./node_modules/.bin/babel-node
import Octokit from "@octokit/rest";
import semverSort from "semver-sort";
import semverCompare from "semver-compare";
import { extractChangeLog, buildOutput } from "./helpers/changelog";
import { extractFromGithubUrl } from "./helpers/github";
import { commandLineSetUp } from "./helpers/cli";

async function fetchAllReleases() {
  const perPage = 30;

  async function getReleases(page) {
    const result = await octokit.repos.getTags({
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
  return results.filter(_ => /^\d/.test(_.name));
}

async function fetchCommitsBetween(from, to) {
  const result = await octokit.repos.compareCommits({
    owner: repoInfo.owner,
    repo: repoInfo.repo,
    base: from,
    head: to
  });

  return result.data.commits;
}

async function getAllPullRequests() {
  const perPage = 100;

  async function getPullRequests(page) {
    const result = await octokit.pullRequests.getAll({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      state: "closed",
      per_page: perPage,
      page
    });
    return result.data;
  }
  let results = [];
  let page = 1;
  let stillGettingReleases = true;
  while (stillGettingReleases) {
    const data = await getPullRequests(page);
    results = [...results, ...data];
    stillGettingReleases = data.length === perPage;
    page += 1;
  }

  return results
    .map(pr => {
      const changelogMessage = extractChangeLog(pr);
      const { url, merge_commit_sha, number } = pr;
      if (changelogMessage) {
        return {
          sha: merge_commit_sha,
          message: changelogMessage,
          number,
          url
        };
      }
    })
    .filter(_ => _);
}

async function main(lastCommit) {
  const prs = await getAllPullRequests();
  const releases = await fetchAllReleases();
  const tokenizedNextVersion = nextVersion.split(".");
  const releaseTags = releases
    .map(release => release.name)
    .filter(
      name =>
        prevVersion
          ? semverCompare(name, prevVersion) >= 0
          : name.startsWith(
              prevVersion ||
                [tokenizedNextVersion[0], tokenizedNextVersion[1]].join(".")
            )
    );
  releaseTags.push(nextVersion);
  const sortedList = semverSort.desc(releaseTags);
  for (const [index, value] of sortedList.entries()) {
    const nextRelease = sortedList[index + 1];
    const thisRelease = value === nextVersion ? lastCommit : value;
    if (!value || !nextRelease) {
      break;
    }
    const commits = await fetchCommitsBetween(nextRelease, thisRelease);
    const commitsToPrs = commits
      .map(commit => {
        return prs.find(pr => pr.sha === commit.sha);
      })
      .filter(_ => _);
    if (commitsToPrs.length !== 0) {
      buildOutput(commitsToPrs, value, repoInfo, outputPrLinks);
    }
  }
}

/* main*/

const {
  repo,
  nextVersion,
  lastCommit,
  outputPrLinks = false,
  prevVersion,
  token
} = commandLineSetUp();

const repoInfo = extractFromGithubUrl(repo);
const octokit = new Octokit();

octokit.authenticate({
  type: "token",
  token
});

main(lastCommit);
