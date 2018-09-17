#!/usr/bin/env ./node_modules/.bin/babel-node
import Octokit from "@octokit/rest";
import semverSort from "semver-sort";
import {
  extractChangeLogMessage,
  buildOutput,
  extractIssuesFromString
} from "./helpers/changelog";
import { extractFromGithubUrl } from "./helpers/github";
import { versionFilter } from "./helpers/utils";

const octokit = new Octokit();

async function fetchAllReleases(repoInfo) {
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

async function fetchCommitsBetween(from, to, repoInfo) {
  const result = await octokit.repos.compareCommits({
    owner: repoInfo.owner,
    repo: repoInfo.repo,
    base: from,
    head: to
  });

  return result.data.commits;
}

async function getAllPullRequests(repoInfo) {
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
      const changelogMessage = extractChangeLogMessage(pr);
      const issues = extractIssuesFromString(pr.body);
      const { url, merge_commit_sha, number } = pr;
      if (changelogMessage) {
        return {
          sha: merge_commit_sha,
          message: changelogMessage,
          issues,
          number,
          url
        };
      }
    })
    .filter(_ => _);
}

async function main(args) {
  const repoInfo = extractFromGithubUrl(args.repo);

  const prs = await getAllPullRequests(repoInfo);
  const releases = await fetchAllReleases(repoInfo);
  const releaseTags = releases
    .map(release => release.name)
    .filter(name => versionFilter(name, args.prevVersion, args.nextVersion));
  releaseTags.push(args.nextVersion);
  const sortedList = semverSort.desc(releaseTags);
  for (const [index, value] of sortedList.entries()) {
    const nextRelease = sortedList[index + 1];
    const thisRelease = value === args.nextVersion ? args.lastCommit : value;
    if (!value || !nextRelease) {
      break;
    }
    const commits = await fetchCommitsBetween(
      nextRelease,
      thisRelease,
      repoInfo
    );
    const commitsToPrs = commits
      .map(commit => {
        return prs.find(pr => pr.sha === commit.sha);
      })
      .filter(_ => _);
    if (commitsToPrs.length !== 0) {
      buildOutput(commitsToPrs, value, repoInfo, args.outputPrLinks);
    }
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
