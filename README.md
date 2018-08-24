# gh-changelog

Generate a markdown formatted changelog from pull requests in a Github repository.
The pull requests need to have a `changelog` label attached to them.

If the option `--prev-version` is omitted the tool looks for all PR:s in
the semver minor version and generates a complete changelog for all versions in that range.

I.e. if `--next-version=3.2.5` is used, the output will incclude all changes from `3.2.0` to the upoming `3.2.5` release. They are grouped by version.

When `--prev-version` is included, the same thing happens but it starts from the version of `--prev-version` rather than `.0`.

# Example usage

```
// Generate md formatted changelog for 3.2.0 -> 3.2.5
// Output to standard output
node ./generate.js
  --repo=https://github.com/neo4j-private/neo4j-browser
  --next-version=3.2.5
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e
  --output-pr-links (default off)
  --token=gh-token
```

```
// Generate for release_notes.md (just changes since the last release)
node ./generate.js
  --repo=https://github.com/neo4j-private/neo4j-browser
  --next-version=3.2.5
  --prev-version=3.2.4
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e
  --output-pr-links (default off)
  --token=gh-token
> release_notes.md
```
