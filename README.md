<p align="center">
  <img src="https://i.imgur.com/KvrVHgB.png" width="340" alt="practicle logo">
</p>

# Practicle - the pr-activated-changelog-emitter

Generate a markdown formatted changelog from pull requests in a Github repository.
The pull requests need to have a `changelog` label attached to them.

If the option `--prev-version` is omitted the tool looks for all PR:s in
the semver minor version and generates a complete changelog for all versions in that range.

I.e. if `--next-version=3.2.5` is used, the output will incclude all changes from `3.2.0` to the upoming `3.2.5` release. They are grouped by version.

Versions are taken from git tags that has the format `x.y.z`.

When `--prev-version` is included, the same thing happens but it starts from the version of `--prev-version` rather than `.0`.

# Usage

Install globally to get a binary executable in your system.

```
npm install -g @neo4j/practicle
```

## Examples

```bash
# Generate md formatted changelog for 3.2.0 -> 3.2.5
# Output to standard output
practicle \
  --repo=https://github.com/neo4j-private/neo4j-browser \
  --next-version=3.2.5 \
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e \
  --output-pr-links \
  --token=xxx
```

```bash
# Generate and pipe to release_notes.md (just changes since the last release)
practicle \
  --repo=https://github.com/neo4j-private/neo4j-browser \
  --next-version=3.2.5 \
  --prev-version=3.2.4 \
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e \
  --output-pr-links \
  --token=xxx \
> release_notes.md
```

# CLI options

### `--repo` (required)

The url to the Github repo you want to pull from.

### `--next-version` (required)

The version to be released. Just to get a header on the output.

### `--last-commit` (required)

This tool generates changelog up until this commit.

### `--prev-version` (optional)

If you don't want to start generating from `.0` version, use this.

### `--output-pr-links` (optional, default false)

If you want to append you changelog entries with links to the PR.

### `--token` (optional)

To be able to reach private repos provide a Github access token here, or set a environment variable named `GITHUB_TOKEN`.
