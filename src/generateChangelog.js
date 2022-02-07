#!/usr/bin/env ./node_modules/.bin/babel-node
import Octokit from "@octokit/rest";
import semverSort from "semver-sort";
import {
  extractChangeLogMessage,
  buildOutput,
  extractIssuesFromString
} from "./helpers/changelog";
import { extractFromGithubUrl } from "./helpers/github";
import { versionFilter, isValidSemVer } from "./helpers/utils";

const octokit = new Octokit();

export const defaultReleaseTagFormat = "^v?\\d+\\.\\d+\\.\\d+$";
export const isValidReleaseTag = (re, tag) => new RegExp(re, "i").test(tag);

async function fetchAllTags(repoInfo, options) {
  const perPage = 30;

  async function getReleases(page) {
    const result = await octokit.repos.listTags({
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

  if (options.filterString) {
    return results.filter(res =>
      isValidReleaseTag(options.filterString, res.name)
    );
  } else {
    return results;
  }
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

async function getAllPullRequests(repoInfo, labelFilter) {
  const perPage = 100;

  async function getPullRequests(page) {
    const result = await octokit.pullRequests.list({
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
      const changelogMessage = extractChangeLogMessage(pr, labelFilter);
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
  let prs;
  let releases;
  try {
    prs = await getAllPullRequests(repoInfo, args.labelFilter);
    releases = await fetchAllTags(repoInfo, {
      filterString: args.releaseTagFilter || defaultReleaseTagFormat
    });
  } catch (e) {
    console.error("Something went wrong: " + e.message);
    process.exit(1);
  }

  const releaseSet = new Set(releases.map(release => release.name));
  releaseSet.add(args.nextVersion);
  let releaseTags = Array.from(releaseSet);

  if (isValidSemVer(args.prevVersion)) {
    releaseTags = releaseTags.filter(name =>
      versionFilter(name, args.prevVersion, args.nextVersion)
    );
    releaseTags = semverSort.desc(releaseTags);
  }
  if (args.prevVersion === true) {
    releaseTags = releaseTags.filter(t => t && isValidSemVer(t));
    releaseTags = semverSort.desc(releaseTags);
    const nextTag = releaseTags.indexOf(args.nextVersion);
    releaseTags = releaseTags.slice(nextTag, nextTag + 2);
  }

  for (const [index, value] of releaseTags.entries()) {
    const nextRelease = releaseTags[index + 1];
    const thisRelease = value === args.nextVersion ? args.releaseCommit : value;
    if (!value || !nextRelease) {
      break;
    }

    const commits = await fetchCommitsBetween(
      nextRelease,
      thisRelease,
      repoInfo
    );
    const matchPR = (pr, commit) => {
      if (pr.sha === commit.sha) return true;
      const nrMatch = commit.commit.message.match(/.*\(\#(.*)\)/);
      if (nrMatch && nrMatch[1]) {
        return parseInt(nrMatch[1]) === pr.number;
      }
      return false;
    };
    const commitsToPrs = commits
      .map(commit => {
        const pr = prs.find(pr => matchPR(pr, commit));
        return pr
          ? {
              ...pr,
              author:
                commit && commit.author ? commit.author.login : "No Author"
            }
          : undefined;
      })
      .filter(_ => _);
    if (commitsToPrs.length !== 0) {
      buildOutput(
        commitsToPrs,
        value,
        repoInfo,
        args.outputPrLinks,
        args.outputAuthor
      );
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
