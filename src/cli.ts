import { program } from "@commander-js/extra-typings";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { lstat } from "node:fs/promises";
import { join } from "node:path";

program
  .name("forgit")
  .description("A mini-git made by Forge(Mohamed Abdeltawab)");

program
  .command("init [directory]")
  .description("Initiailize a new repo")
  .action(async (directory) => {
    const path = join(process.cwd(), directory ?? ".");
    const gitDir = join(path, ".git");

    if (existsSync(path)) {
      const stat = await lstat(path);
      if (!stat.isDirectory()) {
        console.log(`fatal: ${path} is not a directory`);
        process.exit(1);
      }
    }

    if (existsSync(gitDir)) {
      console.log("fatal: .git already exists");
      process.exit(1);
    }

    mkdirSync(gitDir, { recursive: true });
    mkdirSync(join(path, ".git/objects"), { recursive: true });
    mkdirSync(join(path, ".git/refs/heads"), { recursive: true });
    mkdirSync(join(path, ".git/refs/tags"), { recursive: true });
    writeFileSync(join(path, ".git/HEAD"), "ref: refs/heads/main\n");
    console.log("Initialized git directory");
  });

program.parse();
