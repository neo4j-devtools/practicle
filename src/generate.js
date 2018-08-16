import yargs from "yargs";
import Octokit from "@octokit/rest";
import semverSort from "semver-sort";

/* functions */
const extractChangeLog = obj => {
  const label = obj.labels.filter(l => {
    return l.name === "changelog";
  });

  return label.length > 0 ? obj.title : null;
};

const extractFromGithubUrl = url => {
  const tokens = url.split("/");
  const repo = tokens.pop().replace(/.git$/, "");
  const owner = tokens.pop();
  return {
    repo,
    owner
  };
};

const getPrMessagesBetweenSha = (prs, from, to) => {
  const indexFrom = prs.findIndex(_ => _.sha === from);
  const indexTo = prs.findIndex(_ => _.sha === to);
  const arr = prs
    .splice(indexFrom <= 0 ? 0 : indexFrom, indexTo)
    .filter(_ => _.pr);
};

const buildOutput = (logs, header, outputPrLinks) => {
  let out = `
  # Neo4j Browser - ${header}
  `;

  logs.forEach(_ => {
    out += `
    * ${_.message}`;
  });
  console.log(out);
};

const commandLineSetUp = () =>
  yargs
    .env("GITHUB")
    .option("token", {
      describe: "GITHUB_TOKEN env should be set",
      demandOption: true
    })
    .options({
      repo: {
        alias: "r",
        describe: "Github repo to pull changes from",
        demandOption: true
      },
      nextVersion: {
        alias: "nv",
        describe: "The next version of the software to be release",
        demandOption: true
      },
      lastCommit: {
        alias: "lc",
        describe: "The last commit hash to be considered for the changelog",
        demandOption: true
      },
      outputPrLinks: {
        alias: "opl",
        describe:
          "Adds the corresponding Github link at the end of the change message"
      }
    })
    .help()
    .alias("h", "help").argv;

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
  const releaseTags = releases
    .map(release => release.name)
    .filter(name => name.startsWith(nextVersion.split(".")[0]));
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
      buildOutput(commitsToPrs, value, outputPrLinks);
    }
  }
}

/* main*/

const {
  repo,
  nextVersion,
  lastCommit,
  outputPrLinks = false,
  token
} = commandLineSetUp();

const repoInfo = extractFromGithubUrl(repo);
const octokit = new Octokit();

octokit.authenticate({
  type: "token",
  token
});

main(lastCommit);
