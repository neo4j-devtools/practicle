#!/usr/bin/env ./node_modules/.bin/babel-node
import { init as releaseToGithub } from "./releaseToGithub";

/* main*/
export const init = args => {
  releaseToGithub({ ...args, draft: true });
};
