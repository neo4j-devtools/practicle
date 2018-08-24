import semverCompare from "semver-compare";

export const versionFilter = (name, prevVersion, nextVersion) => {
  const tokenizedNextVersion = nextVersion.split(".");
  return prevVersion
    ? semverCompare(name, prevVersion) >= 0
    : name.startsWith(
        prevVersion ||
          [tokenizedNextVersion[0], tokenizedNextVersion[1]].join(".")
      );
};
