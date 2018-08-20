# Example usage

``` // Generate md formatted changelog // Output to standard output node
./generate.js
  --repo=https://github.com/neo4j-private/neo4j-browser
  --next-version=3.2.5
  --last-commit=defedaedfeadefd232323
  --output-pr-links (default off)

````
```
// Generate for release_notes.md
node ./generate.js
  --repo=https://github.com/neo4j-private/neo4j-browser
  --next-version=3.2.5
  --prev-version=3.2.3
  --last-commit=defedaedfeadefd232323
  --output-pr-links (default off)
> release_notes.md
````
