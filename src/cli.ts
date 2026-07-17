import { program } from "@commander-js/extra-typings";
import { join } from "node:path";

program
  .name("forgit")
  .description("A mini-git made by Forge(Mohamed Abdeltawab)");

program
  .command("init [directory]")
  .description("Initiailize a new repo")
  .action((directory) => {
    const path = join(process.cwd(), directory || "");
  });

program.parse();
