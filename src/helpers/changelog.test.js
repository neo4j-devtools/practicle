import {
  buildOutput,
  extractChangeLogMessage,
  extractIssuesFromString
} from "./changelog";

jest.spyOn(global.console, "log").mockImplementation(() => {});

const getLog = () => console.log.mock.calls[0][0];

describe("extractChangeLogMessage", () => {
  test("maps title value by default", () => {
    const title = "emily";
    const pr = {
      labels: [{ name: "changelog" }],
      title
    };
    const actual = extractChangeLogMessage(pr);
    expect(actual).toEqual(title);
  });
  test("maps `changelog:` when at the beginning of a line", () => {
    const title = "emily";
    const changeLogMessage = "elliot";

    const pr = {
      labels: [{ name: "changelog" }],
      title,
      body: `changelog: ${changeLogMessage}`
    };
    const actual = extractChangeLogMessage(pr);
    expect(actual).toEqual("elliot");
  });
  test("does not map `changelog:` when not at the beginning of a line", () => {
    const title = "emily";
    const changeLogMessage = "elliot";

    const pr = {
      labels: [{ name: "changelog" }],
      title,
      body: `foo changelog: ${changeLogMessage}`
    };
    const actual = extractChangeLogMessage(pr);
    expect(actual).toEqual(title);
  });
  test("does not map more than one line on `changelog:`", () => {
    const title = "emily";
    const changeLogMessage = "elliot";

    const pr = {
      labels: [{ name: "changelog" }],
      title,
      body: "foo\nchangelog: " + changeLogMessage + "\nyo!"
    };
    const actual = extractChangeLogMessage(pr);
    expect(actual).toEqual(changeLogMessage);
  });
});

describe("extractIssuesFromMessage", () => {
  test("no issue", () => {
    const message = "emily";
    const actual = extractIssuesFromString(message);
    expect(actual).toBeFalsy();
  });
  test("single issue", () => {
    const message = "elliot's\nfixes: emily";
    const actual = extractIssuesFromString(message);
    expect(actual).toBe("Issue(s): emily");
  });
  test("many issues", () => {
    const message = "emily's\nfixes: [num](foo), bar";
    const actual = extractIssuesFromString(message);
    expect(actual).toBe("Issue(s): [num](foo), bar");
  });
});

describe("changelog output", () => {
  test("prints out change log", () => {
    const message = "foobar";
    const logs = [{ message }];
    const header = "foobar";
    buildOutput(logs, header, { owner: "owner", repo: "repo" }, false);

    expect(getLog()).toEqual(expect.stringContaining(header));
    expect(getLog()).toEqual(expect.stringContaining(message));
  });
});
