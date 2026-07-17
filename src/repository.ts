import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { lstat, realpath } from "node:fs/promises";
import { join } from "node:path";

class Repository {
  public gitDir: string;
  public workTree: string;

  constructor(path: string) {
    this.workTree = path;
    this.gitDir = join(path, ".git");
  }

  repoPath(...paths: string[]) {
    return join(this.gitDir, ...paths);
  }

  static async repoFind(path = "."): Promise<Repository> {
    const realPath = await realpath(path);
    const gitDir = join(realPath, ".git");

    if (existsSync(gitDir) && (await lstat(gitDir)).isDirectory()) {
      return new Repository(realPath);
    }

    const parent = await realpath(join(realPath, ".."));
    if (parent === realPath) {
      console.log("fatal: not a git repository (or any parent up to root)");
      process.exit(1);
    }

    return Repository.repoFind(parent);
  }

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

    return new Repository(path);
  }
}

export default Repository;
