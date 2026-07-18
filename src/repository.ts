import {
  existsSync,
  mkdirSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
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

  repoFile(...path: string[]) {
    this.repoDir(true, ...path.slice(0, -1));
    return this.repoPath(...path);
  }

  repoDir(create = false, ...path: string[]) {
    const dir = this.repoPath(...path);

    if (existsSync(dir)) {
      const stat = statSync(dir);

      if (stat.isDirectory()) {
        return dir;
      } else {
        throw new Error(`Not a directory ${dir}`);
      }
    }

    if (create) {
      mkdirSync(dir, { recursive: true });
      return dir;
    } else return undefined;
  }

  static repoFind(path = "."): Repository {
    const realPath = realpathSync(path);
    const gitDir = join(realPath, ".git");

    if (existsSync(gitDir) && statSync(gitDir).isDirectory()) {
      return new Repository(realPath);
    }

    const parent = realpathSync(join(realPath, ".."));
    if (parent === realPath) {
      throw new Error("fatal: not a git repository (or any parent up to root)");
    }

    return Repository.repoFind(parent);
  }

  static init(directoryPath: string | undefined) {
    const path = join(process.cwd(), directoryPath ?? ".");
    const gitDir = join(path, ".git");

    if (existsSync(path)) {
      const stat = statSync(path);
      if (!stat.isDirectory()) {
        throw new Error("not a git repository");
      }
    }

    if (existsSync(gitDir)) {
      console.log(`fatal: .git already exists`);
    }

    const repo = new Repository(path);

    mkdirSync(repo.repoPath("objects"));
    mkdirSync(repo.repoPath("refs", "heads"));
    mkdirSync(repo.repoPath("refs", "tags"));

    writeFileSync(repo.repoPath("HEAD"), "ref: refs/heads/main\n");
    console.log("Initialized git directory");

    return repo;
  }
}

export default Repository;
