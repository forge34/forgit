import Commit from "./commit";

class Branch {
  public name: string;
  public commit: Commit | null = null;

  constructor(name: string, commit: Commit | null) {
    this.name = name;
    this.commit = commit;
  }
}

export default Branch;
