import { versionFilter } from "./utils.js";

test("versionFilter filters correctly", () => {
  const tests = [
    {
      tagName: "1.2.3",
      prevVersion: "1.1.0",
      nextVersion: "1.2.5",
      expect: true
    },
    {
      tagName: "1.1.1",
      prevVersion: "1.1.0",
      nextVersion: "1.2.5",
      expect: true
    },
    {
      tagName: "yo-1.2.3",
      prevVersion: null,
      nextVersion: "1.2.5",
      expect: false
    },
    {
      tagName: "2.1.0",
      prevVersion: "2.1.0",
      nextVersion: "2.1.5",
      expect: true
    },
    { tagName: "2.1.0", prevVersion: null, nextVersion: "2.1.5", expect: true },
    {
      tagName: "2.1.0",
      prevVersion: "2.1.1",
      nextVersion: "2.1.5",
      expect: false
    }
  ];

  tests.forEach(test =>
    expect(
      versionFilter(test.tagName, test.prevVersion, test.nextVersion)
    ).toBe(test.expect)
  );
});
