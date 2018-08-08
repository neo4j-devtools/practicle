# Example usage

```
 // Generate md formatted changelog
 // Output to standard output
 node ./generate.js \
   --repo=https://github.com/neo4j-private/neo4j-browser \
   --next-version=3.2.5 \
   --last-commit=defedaedfeadefd232323 \
   --output-pr-links (default off)

 // Publish to wiki. Reads from standard input
 node ./publish \
   --repo=https://github.com/neo4j-public/neo4j-browser

// Generate for release_notes.md
node ./generate.js \
   --repo=https://github.com/neo4j-private/neo4j-browser \
   --next-version=3.2.5 \
   --prev-version=3.2.3 \
   --last-commit=defedaedfeadefd232323 \
   --output-pr-links (default off)
 > release_notes.md

 echo '<br/>Read more at our [Changelog page](http://github.com/neo4j-public/neo4j-browser/wiki/changelog-3.2.md)'
   >> release_notes.md
```

# Wiki entries

```
// One wiki page
 ## Neo4j Browser 3.2

 ### 3.2.4
 - bla bla bla
 - yo yi ya

 ### 3.2.3
 - good coffe ftw
 - fgfg fg fg fg


 // Another wiki page
## Neo4j Browser 3.1

 ### 3.1.5
 - bla bla bla
 - yo yi ya

 ### 3.1.4
 - good coffe ftw
 - fgfg fg fg fg
```
