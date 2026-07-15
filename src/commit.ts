class Commit {
  public id: string;
  public message: string;
  public parent: Commit | null;
  constructor(parent: Commit | null, id: string, message: string) {
    this.id = id;
    this.message = message;
    this.parent = parent;
  }
}

export default Commit;
