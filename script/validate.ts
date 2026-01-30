/**
 * Validate the project with static checks.
 */

import { spawn, spawnSync } from "bun";

{
    console.log("Typechecking project...");

    const typecheckResult = spawnSync(
        ["bun", "run", "typecheck"],
        { stderr: "inherit", "stdout": "inherit" }
    );
    if (typecheckResult.exitCode !== 0) {
        console.error("Typechecking failed");
        process.exit(1);
    }
    console.log("Typechecking passed");
}

{
    console.log("Linting project...");

    const lintResult = spawnSync(
        ["bun", "run", "lint"],
        { stderr: "inherit", "stdout": "inherit" }
    );
    if (lintResult.exitCode !== 0) {
        console.error("Linting failed");
        process.exit(1);
    }
    console.log("Linting passed");
}

{
    console.log("Starting dev server...");

    const devServer = spawn(
        ["bun", "run", "dev"],
        { stderr: "pipe", stdout: "inherit", }
    );

    // Wait before killing the dev server
    await Bun.sleep(1000);
    devServer.kill();

    // check that the dev server exited because of the kill signal "SIGTERM"
    const stderrOutput = await new Response(devServer.stderr).text();
    if (devServer.exitCode !== 0 && !stderrOutput.includes("SIGTERM")) {
        console.log(stderrOutput);
        console.error("Dev server did not exit because of the kill signal \"SIGTERM\"");
        process.exit(1);
    }

    console.log("Dev server terminated");
}

{
    console.log("Running tests...");

    const testResult = spawnSync(
        ["bun", "test"],
        { stderr: "inherit", "stdout": "inherit" }
    );
    if (testResult.exitCode !== 0) {
        console.error("Tests failed");
        process.exit(1);
    }

    console.log("Tests passed");
}

console.log("Validation complete. All checks passed.");

