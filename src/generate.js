import yargs from "yargs";
import Octokit from "@octokit/rest";

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

async function getPullRequests() {
  const result = await octokit.pullRequests.getAll({
    owner: repoInfo.owner,
    repo: repoInfo.repo,
    state: "closed",
    per_page: 100
  });

  const out = result.data
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

  return out.splice(0, out.indexOf(out.find(log => log.sha === lastCommit)));

  // buildOutput(filteredLogs, nextVersion, outputPrLinks);
}

async function main() {
  const releases = await fetchAllReleases();
  const prs = await getPullRequests();
  releases.forEach(rel => {
    console.log(`###${rel.name} (${rel.commit.sha})`);
  });
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
const perPage = 30;

octokit.authenticate({
  type: "token",
  token
});

main();
