import fs from "fs";
import path from "path";
import { promisify } from "util";
import findUp, { sync as findUpSync } from "find-up";

let readFile = promisify(fs.readFile);

export type Result = {
  directory: string;
  packageJson: Record<string, any>;
};

export async function findPkgJsonFieldUp(field: string, cwd: string) {
  let result: Result | undefined;
  await findUp(
    async (directory) => {
      try {
        let contents = JSON.parse(
          await readFile(path.join(directory, "package.json"), "utf8")
        );
        if (contents.name !== undefined && contents[field] !== undefined) {
          result = { directory, packageJson: contents };
          return directory;
        }
      } catch (err) {
        if (err.code === "ENOENT") {
          return;
        }
        throw err;
      }
    },
    { cwd }
  );
  return result;
}

export function findPkgJsonFieldUpSync(field: string, cwd: string) {
  let result: Result | undefined;
  findUpSync(
    (directory) => {
      try {
        let contents = JSON.parse(
          fs.readFileSync(path.join(directory, "package.json"), "utf8")
        );
        if (contents.name !== undefined && contents[field] !== undefined) {
          result = { directory, packageJson: contents };
          return directory;
        }
      } catch (err) {
        if (err.code === "ENOENT") {
          return;
        }
        throw err;
      }
    },
    { cwd }
  );
  return result;
}
