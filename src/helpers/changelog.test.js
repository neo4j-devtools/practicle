import { buildOutput, extractChangeLogMessage } from "./changelog";

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
  test("maps `message:` when at the beginning of a line", () => {
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
  test("does not map `message:` when not at the beginning of a line", () => {
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
  test("prints out change log", () => {
    const message = "foobar";
    const logs = [{ message }];
    const header = "foobar";
    buildOutput(logs, header, { owner: "owner", repo: "repo" }, false);

    expect(getLog()).toEqual(expect.stringContaining(header));
    expect(getLog()).toEqual(expect.stringContaining(message));
  });
});
