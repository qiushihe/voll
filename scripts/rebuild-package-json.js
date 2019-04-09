const path = require("path");
const readFileSync = require("graceful-fs").readFileSync;
const writeFileSync = require("graceful-fs").writeFileSync;

const packageJsonPath = path.resolve(path.join(__dirname, "..", "package.json"));
const buildPackageJsonPath = path.resolve(path.join(__dirname, "..", "build", "package.json"));

const packageJsonString = readFileSync(packageJsonPath, { encoding: "utf8" });
const packageJson = JSON.parse(packageJsonString);

const buildPackageJson = {
  name: "Voll",
  main: "main.js",
  version: packageJson.version
};

const buildPackageJsonString = JSON.stringify(buildPackageJson, null, 2);

writeFileSync(buildPackageJsonPath, buildPackageJsonString, {
  encoding: "utf8"
});

console.log(`Wrote to ${buildPackageJsonPath}:\n${buildPackageJsonString}`);
