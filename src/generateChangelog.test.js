import {
  isValidReleaseTag,
  defaultReleaseTagFormat
} from "./generateChangelog";

test("isValidReleaseTag filters out what we expect", () => {
  const tests = [
    { tag: "v3.2.1", expect: true },
    { tag: "3.2.1", expect: true },
    { tag: "3.2.1-0", expect: false },
    { tag: "v2.1", expect: false },
    { tag: "2.1", expect: false },
    { tag: "w3.2.1", expect: false },
    { tag: "yo v3.2.1", expect: false },
    { tag: "yo 3.2.1", expect: false }
  ];

  tests.forEach(t =>
    expect(isValidReleaseTag(defaultReleaseTagFormat, t.tag)).toEqual(t.expect)
  );
});
