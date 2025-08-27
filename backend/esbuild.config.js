import { build } from "esbuild";
import { styleText } from "util";

const options = {
    entryPoints: ["src/main.ts"],
    bundle: true,
    platform: "node",
    outdir: "dist",
    sourcemap: true,
    target: "es2020",
}

async function runBuild(){
    console.log(`[${new Date}] Build started...`)
    console.time("build");
    try {
        await build(options);
    } catch (error) {
        console.log(`${styleText("red", "Build failed with exception:")}`);
        console.log(error.message);
    }
    console.timeLog("build",`${styleText("green", "Build Success")}`);
}

const [,, cmd] = process.argv;
switch(cmd) {
    case "build": runBuild(); break;
    default:
        console.log("Usage: [build]")
}
