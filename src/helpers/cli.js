import yargs from "yargs";
import { init as generateChangelog } from "./../generateChangelog";
import { init as draftReleaseToGithub } from "../draftReleaseToGithub";
import { init as releaseToGithub } from "../releaseToGithub";
import { init as relaseNotesFromGithub } from "../relaseNotesFromGithub";

export const setUpCli = () =>
  yargs
    .command(
      "generate-changelog",
      "Generate release notes",
      commandLineSetUp,
      generateChangelog
    )
    .command(
      "draft-release",
      "Create draft release on Github",
      commandLineSetUpPublish,
      draftReleaseToGithub
    )
    .command(
      "release",
      "Create release on Github",
      commandLineSetUpPublish,
      releaseToGithub
    )
    .command(
      "fetch-release-notes",
      "Fetch release notes from Github",
      commandLineSetUpFetch,
      relaseNotesFromGithub
    )
    .demandCommand().argv;

const commandLineSetUp = y =>
  y
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
      "next-version": {
        alias: "nv",
        describe: "The next version of the software to be release",
        demandOption: true
      },
      "last-commit": {
        alias: "lc",
        describe: "The last commit hash to be considered for the changelog",
        demandOption: true
      },
      "output-pr-links": {
        alias: "opl",
        describe:
          "Adds the corresponding Github link at the end of the change message"
      },
      "prev-version": {
        alias: "pv",
        describe:
          "The prev version tag you wish to begin the log generation from"
      }
    })
    .help()
    .alias("h", "help");

const commandLineSetUpPublish = y =>
  y
    .env("GITHUB_TOKEN")
    .option("token", {
      describe: "GITHUB_TOKEN env should be set",
      demandOption: true
    })
    .options({
      repo: {
        alias: "r",
        describe: "Github repo to push draft release to",
        demandOption: true
      },
      "next-version": {
        alias: "nv",
        describe: "The next version of the software to be release",
        demandOption: true
      },
      commit: {
        alias: "c",
        describe: "The commit that will be tagged",
        demandOption: true
      },
      file: {
        describe:
          "File from which to read that will be used for the release description",
        demandOption: true
      }
    })
    .help()
    .alias("h", "help");

const commandLineSetUpFetch = y =>
  y
    .env("GITHUB_TOKEN")
    .option("token", {
      describe: "GITHUB_TOKEN env should be set",
      demandOption: true
    })
    .options({
      repo: {
        alias: "r",
        describe: "Github repo to push draft release to",
        demandOption: true
      },
      tag: {
        alias: "t",
        describe: "The tag associated with the release",
        demandOption: true
      }
    })
    .help()
    .alias("h", "help");
