import Branch from "./branch";
import Commit from "./commit";

class Repository {
  public branches: Branch[] = [];
  public main: Branch;
  public head: Branch | null = null;

  constructor() {
    this.main = new Branch("main", null);
    this.branches.push(this.main);
    this.head = this.main;
  }

  commit(id: string, message: string) {
    const parent = this.head?.commit ?? null;
    const commit = new Commit(parent, id, message);
    if (this.head) {
      this.head.commit = commit;
    }
    return commit;
  }

  log() {
    let history: Commit[] = [];
    let commit = this.head?.commit ?? null;
    while (commit) {
      history.push(commit);
      commit = commit.parent;
    }

    return history;
  }
}

export default Repository;
