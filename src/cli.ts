import { program } from "@commander-js/extra-typings";
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

program.parse();
