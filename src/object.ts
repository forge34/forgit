type TreeEntry = {
  mode: string;
  name: string;
  sha: string;
};

type Commit = {
  tree: string;
  parents: string[];
  author: string;
  committer: string;
  message: string;
};

abstract class GitObject {
  abstract readonly type: "blob" | "tree" | "commit" | "tag";

  abstract serialize(): Buffer;
}

class GitBlob extends GitObject {
  readonly type = "blob";

  constructor(public content: Buffer) {
    super();
  }

  serialize() {
    return this.content;
  }
}

class GitTree extends GitObject {
  readonly type = "tree";

  constructor(public content: Buffer) {
    super();
  }

  serialize() {
    return this.content;
  }
}

class GitCommit extends GitObject {
  readonly type = "commit";

  constructor(public content: Buffer) {
    super();
  }

  serialize() {
    return this.content;
  }
}
