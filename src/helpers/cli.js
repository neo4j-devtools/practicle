import yargs from "yargs";
import { init as generateChangelog } from "./../generateChangelog";
import { init as draftReleaseToGithub } from "../draftReleaseToGithub";
import { init as releaseToGithub } from "../releaseToGithub";
import { init as relaseNotesFromGithub } from "../relaseNotesFromGithub";

import { isValidSemVer } from "./utils";

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
      "release-commit": {
        alias: "rc",
        describe:
          "The commit hash to be considered as the release for the changelog",
        demandOption: true
      },
      "output-pr-links": {
        alias: "opl",
        describe:
          "Adds the corresponding Github link at the end of the change message"
      },
      "prev-version": {
        alias: "pv",
        describe: `The prev version to generate the changelog from.
            - If arg is a valid Semver string (x.x.x) then the changelog will generate notes from the tag
            - If used as a flag then the changelog is generated from the previous semver tag.
            - If ommitted then the semver major.minor version is used to generate changelogs over that range
          `
      },
      "release-tag-filter": {
        alias: "rtf",
        describe: "The regex to filter out releases by their release tags",
        default: "^v?\\d+\\.\\d+\\.\\d+$"
      },
      "label-filter": {
        alias: "lf",
        describe: "Override the pull requests label filter",
        type: "array",
        default: ["changelog"]
      }
    })
    .check(argv => {
      if (
        !(
          argv.prevVersion === undefined ||
          argv.prevVersion === true ||
          isValidSemVer(argv.prevVersion)
        )
      ) {
        throw new Error("--prevVersion is invalid");
      } else {
        return true;
      }
    })
    .help()
    .alias("h", "help");

const commandLineSetUpPublish = y =>
  y
    .env("GITHUB")
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
    .env("GITHUB")
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
