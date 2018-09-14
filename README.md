<p align="center">
  <img src="https://i.imgur.com/KvrVHgB.png" width="340" alt="practicle logo">
</p>

# PRacticle - the pr-activated-changelog-emitter



# Installation

Install globally to get a binary executable in your system.

```
npm install -g @neo4j/practicle
```

# Commands

## `generate-changelog`

Generate a markdown formatted changelog from pull requests in a Github repository.
The pull requests need to have a `changelog` label applied to them.

If the option `--prev-version` is omitted PRacticle finds all PR:s in
the semver minor version and generates a complete changelog for all versions in that range.

I.e. if `--next-version=3.2.5` is used, the output will include all changes from `3.2.0` to the upoming `3.2.5` release. They are grouped by version.

Versions are generated from git tags that has the format `x.y.z`.

When `--prev-version` is included, the same thing happens but it starts from the version of `--prev-version` rather than `.0`.

By default, the text for the changelog entry is taken from the pull request title. If the pull request body includes `changelog:` on a separate line, it will override the default text.


```bash
Options:
  --token                   GITHUB_TOKEN env should be set            [required]
  --repo, -r                Github repo to pull changes from          [required]
  --next-version, --nv      The next version of the software to be release
                                                                      [required]
  --last-commit, --lc       The last commit hash to be considered for the
                            changelog                                 [required]
  --output-pr-links, --opl  Adds the corresponding Github link at the end of the
                            change message
  --prev-version, --pv      The prev version tag you wish to begin the log
                            generation from
```

## `draft-release`
Takes contents from a file and creates a draft release on GitHub using that contents.

```bash
Options:
  --token               GITHUB_TOKEN env should be set                [required]
  --repo, -r            Github repo to push draft release to          [required]
  --next-version, --nv  The next version of the software to be release[required]
  --commit, -c          The commit that will be tagged                [required]
  --file                File from which to read that will be used for the
                        release description                           [required]

```

## `fetch-release-notes`
Fetches release notes from a release tag (or draft release tag) from Github and outputs it to standard out.
```
Options:
  --token     GITHUB_TOKEN env should be set                          [required]
  --repo, -r  Github repo to push draft release to                    [required]
  --tag, -t   The tag associated with the release                     [required]
```

# Usage

## Examples

```bash
# Generate md formatted changelog for 3.2.0 -> 3.2.5
# Output to standard output
practicle generate-changelog \
  --repo=https://github.com/neo4j/neo4j-browser \
  --next-version=3.2.5 \
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e \
  --output-pr-links \
  --token=xxx
```

```bash
# Generate and pipe to release_notes.md (just changes since the last release)
practicle generate-changelog \
  --repo=https://github.com/neo4j/neo4j-browser \
  --next-version=3.2.5 \
  --prev-version=3.2.4 \
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e \
  --output-pr-links \
  --token=xxx \
> release_notes.md
```

### Output

The following command (try it, just remember to use your [own token](https://github.com/settings/tokens)):

```
practicle generate-changelog \
  --repo=https://github.com/neo4j/neo4j-browser \
  --next-version=3.2.6 \
  --last-commit=7ee472bedcc2e73023e9cf09708e597913ff70cd \
  --output-pr-links \
  --token=xxx
```

produces the following output

```
## 3.2.6

- Add `:history clear` command [#800](https://github.com/neo4j/neo4j-browser/pull/800)
- Add pagecache hits and misses to plan output [#812](https://github.com/neo4j/neo4j-browser/pull/812)
- Add complete support for bolt+routing:// [#814](https://github.com/neo4j/neo4j-browser/pull/814)
- Enable users with non reader roles to connect [#818](https://github.com/neo4j/neo4j-browser/pull/818)

## 3.2.5

- Add toggle for multi statement cypher editor [#793](https://github.com/neo4j/neo4j-browser/pull/793)

## 3.2.3

- Fix editor to handle string literals that contain new lines [#794](https://github.com/neo4j/neo4j-browser/pull/794)

## 3.2.2

- Add support for multi-statement execution [#722](https://github.com/neo4j/neo4j-browser/pull/722)

## 3.2.1

- Handle changelog url building in disconnected state [#787](https://github.com/neo4j/neo4j-browser/pull/787)
- Fix issue with creating unique keys from user input [#790](https://github.com/neo4j/neo4j-browser/pull/790)
```
