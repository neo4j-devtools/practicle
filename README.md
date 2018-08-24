# Example usage

```
// Generate md formatted changelog // Output to standard output node
node ./generate.js
  --repo=https://github.com/neo4j-private/neo4j-browser
  --next-version=3.2.5
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e
  --output-pr-links (default off)
  --token=gh-token
```

```
// Generate for release_notes.md
node ./generate.js
  --repo=https://github.com/neo4j-private/neo4j-browser
  --next-version=3.2.5
  --prev-version=3.2.4
  --last-commit=195694b5479ccc22d144d4ad5f81d74a1ceedb0e
  --output-pr-links (default off)
  --token=gh-token
> release_notes.md
```
