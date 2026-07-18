type TreeEntry = {
  mode: string;
  name: string;
  sha: string;
};

type CommitData = {
  tree: string;
  parents: string[];
  author: string;
  committer: string;
  message: string;
};

type ObjectType = "blob" | "tree" | "commit" | "tag";

abstract class GitObject {
  abstract readonly type: ObjectType;

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

  constructor(public entries: TreeEntry[]) {
    super();
  }

  serialize() {
    return Buffer.from("eee");
  }
}

class GitCommit extends GitObject {
  readonly type = "commit";

  constructor(public content: CommitData) {
    super();
  }

  serialize() {
    return Buffer.from("commit");
  }
}
