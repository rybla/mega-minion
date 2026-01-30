import { spawn, spawnSync } from "bun";

{
    console.log("Typechecking project...");
    const typecheckResult = spawnSync(["bun", "run", "typecheck"], { stderr: "inherit", "stdout": "inherit" });
    if (typecheckResult.exitCode !== 0) {
        console.error("Typechecking failed");
        process.exit(1);
    }
    console.log("Typechecking passed");
}

{
    console.log("Linting project...");
    const lintResult = spawnSync(["bun", "run", "lint"], { stderr: "inherit", "stdout": "inherit" });
    if (lintResult.exitCode !== 0) {
        console.error("Linting failed");
        process.exit(1);
    }
    console.log("Linting passed");
}

{
    console.log("Starting dev server...");
    const devServer = spawn(["bun", "run", "dev"], {
        stderr: "inherit",
        stdout: "inherit",
    });

    // Wait for 1 seconds
    await Bun.sleep(2000);

    // Terminate the dev server
    devServer.kill();

    console.log("Dev server terminated");
}