import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { lstat } from "node:fs/promises";
import { join } from "node:path";

class Repository {
  constructor() {}

  static async init(directoryPath: string | undefined) {
    const path = join(process.cwd(), directoryPath ?? ".");
    const gitDir = join(path, ".git");

    if (existsSync(path)) {
      const stat = await lstat(path);
      if (!stat.isDirectory()) {
        console.log(`fatal: ${path} is not a directory`);
        process.exit(1);
      }
    }

    if (existsSync(gitDir)) {
      console.log("fatal: .git already exists");
      process.exit(1);
    }

    mkdirSync(gitDir, { recursive: true });
    mkdirSync(join(path, ".git/objects"), { recursive: true });
    mkdirSync(join(path, ".git/refs/heads"), { recursive: true });
    mkdirSync(join(path, ".git/refs/tags"), { recursive: true });
    writeFileSync(join(path, ".git/HEAD"), "ref: refs/heads/main\n");
    console.log("Initialized git directory");
  }
}

export default Repository;
