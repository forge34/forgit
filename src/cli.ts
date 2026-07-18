import { Option, program } from "@commander-js/extra-typings";
import Repository from "./repository";

program
  .name("forgit")
  .description("A mini-git made by Forge(Mohamed Abdeltawab)");

program
  .command("init [directory]")
  .description("Initiailize a new repo")
  .action(async (directory) => {
    Repository.init(directory);
  });

program
  .command("hash-object [path]")
  .description("Compute object ID and optionally creates a blob from a file")
  .addOption(
    new Option("-t, --type <type>", "Specify the type")
      .choices(["blob", "tree", "commit", "tag"])
      .default("blob"),
  )
  .option("-w, --write", "Actually write the object into the database")
  .action((path, { type, write }) => {
    if (!path) {
      console.error("fatal: must provide path");
      process.exit(1);
    }

    let repo: Repository;

    try {
      repo = Repository.repoFind(process.cwd());
    } catch (err) {
      if (write) {
        console.error(
          "fatal: not a git repository (or any of the parent directories): .git",
        );
        process.exit(1);
      }

      repo = new Repository(process.cwd());
    }

    try {
      const sha = repo.hashObject(path, type, !!write);
      console.log(sha);
    } catch (err: any) {
      console.error(`error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse();
