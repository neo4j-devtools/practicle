import yargs from "yargs";

export const commandLineSetUp = () =>
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
