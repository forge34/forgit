import { hash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";

class Repository {
  public gitDir: string;
  public workTree: string;

  constructor(path: string) {
    this.workTree = path;
    this.gitDir = join(path, ".git");
  }

  readObject(sha: string) {
    const path = this.repoFile("objects", sha.slice(0, 2), sha.slice(2));

    if (!existsSync(path)) {
      return;
    }

    const data = readFileSync(path);

    const raw = gunzipSync(data);

    const nullIndex = raw.indexOf(0);

    const header = raw.subarray(0, nullIndex).toString();
    const body = raw.subarray(nullIndex + 1);

    const [type, size] = header.split(" ");

    if (body.length !== Number(size)) {
      throw new Error("Malformed object");
    }

    switch (type) {
      case "blob":
        return new GitBlob(body);
      default:
        throw new Error("Unknown object");
    }
  }

  writeObject(obj: GitObject) {
    const raw = obj.serialize();
    const header = Buffer.from(`${obj.type} ${raw.length}\0`);
    const data = Buffer.concat([header, raw]);
    const sha = hash("sha1", data);

    const path = this.repoFile("objects", sha.slice(0, 2), sha.slice(2));

    if (!existsSync(path)) {
      writeFileSync(path, gzipSync(data));
    }

    return sha;
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
