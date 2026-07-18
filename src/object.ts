export type TreeEntry = {
  mode: string;
  name: string;
  sha: string;
};

export type CommitData = {
  tree: string;
  parents: string[];
  author: string;
  committer: string;
  message: string;
};

export type ObjectType = "blob" | "tree" | "commit" | "tag";

export abstract class GitObject {
  abstract readonly type: ObjectType;

  abstract serialize(): Buffer;

  static from(type: ObjectType, body: Buffer) {
    switch (type) {
      case "blob":
        return GitBlob.deserialize(body);
      case "tree":
        return GitTree.deserialize(body);
      case "commit":
        return GitCommit.deserialize(body);
      default:
        throw new Error("Unknown object");
    }
  }
}

export class GitBlob extends GitObject {
  readonly type = "blob";

  constructor(public content: Buffer) {
    super();
  }

  serialize() {
    return this.content;
  }

  static deserialize(data: Buffer) {
    return new GitBlob(data);
  }
}

export class GitTree extends GitObject {
  readonly type = "tree";

  constructor(public entries: TreeEntry[]) {
    super();
  }

  serialize() {
    return Buffer.from("eee");
  }
  static deserialize(data: Buffer) {
    return new GitTree([] as TreeEntry[]);
  }
}

export class GitCommit extends GitObject {
  readonly type = "commit";

  constructor(public content: CommitData) {
    super();
  }

  serialize() {
    return Buffer.from("commit");
  }
  static deserialize(data: Buffer) {
    return new GitCommit("" as unknown as CommitData);
  }
}
