import semver from "semver";
import semverCompare from "semver-compare";

export const versionFilter = (name, prevVersion, nextVersion) => {
  const tokenizedNextVersion = nextVersion.split(".");
  const afterPrevVersion = prevVersion
    ? semverCompare(name, prevVersion) >= 0
    : name.startsWith(
        prevVersion ||
          [tokenizedNextVersion[0], tokenizedNextVersion[1]].join(".")
      );
  const beforeNextVersion = semverCompare(name, nextVersion) <= 0;
  return afterPrevVersion && beforeNextVersion;
};

export const isValidSemVer = str => semver.valid(str);
