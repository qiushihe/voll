const path = require("path");

const flow = require("lodash/fp/flow");
const map = require("lodash/fp/map");

const shell = require("shelljs");
const Jimp = require("jimp");
const iconGen = require("icon-gen");

// Image manipulation functions ---------------------------------------------------------------------------------------

const resizeCanvas = (width, height) => (image) => {
  const canvas = new Jimp(width, height, 0xffffff00);
  canvas.composite(
    image,
    Math.abs(canvas.bitmap.width - image.bitmap.width) / 2,
    Math.abs(canvas.bitmap.height - image.bitmap.height) / 2
  );
  return canvas;
};

const resizeImage = (width, height) => (image) => {
  return image.clone().resize(width, height);
};

const writeImageAsync = (path) => (image) => {
  return image.writeAsync(path);
};

// Image processing functions -----------------------------------------------------------------------------------------

const buildPaddedImages = (buildPath, sizes) => (image) => {
  return flow([
    map((size) => {
      return flow([
        resizeImage(size.imageSize, size.imageSize),
        resizeCanvas(size.canvasSize, size.canvasSize),
        writeImageAsync(path.join(buildPath, size.canvasSize + ".png"))
      ])(image);
    }),
    (promises) => Promise.all(promises)
  ])(sizes);
};

const buildImages = (buildPath, sizes) => (image) => {
  return flow([
    map((size) => {
      return flow([
        resizeImage(size.imageSize, size.imageSize),
        writeImageAsync(path.join(buildPath, size.imageSize + ".png"))
      ])(image);
    }),
    (promises) => Promise.all(promises)
  ])(sizes);
};

// --------------------------------------------------------------------------------------------------------------------

const buildPath = path.resolve(path.join(__dirname, "..", "build"));
const icoBuildPath = path.join(buildPath, "ico-build");
const icnsBuildPath = path.join(buildPath, "icns-build");

const logoPath = path.resolve(path.join(__dirname, "..", "src", "images", "lolgo.png"));
const logoSmallPath = path.resolve(path.join(__dirname, "..", "src", "images", "lolgo-small.png"));

// Ensure the build directory exist
shell.mkdir("-p", buildPath);

// Remake temporary sub-build directory for icons
shell.rm("-fr", icoBuildPath);
shell.rm("-fr", icnsBuildPath);
shell.mkdir(icoBuildPath);
shell.mkdir(icnsBuildPath);

// Windows ICO logo ---------------------------------------------------------------------------------------------------

const doneWindowsLogo = Promise.all([
  Jimp.read(logoPath).then(
    buildImages(icoBuildPath, [
      { imageSize: 1024 },
      { imageSize: 512 },
      { imageSize: 256 },
      { imageSize: 128 },
      { imageSize: 64 },
      { imageSize: 48 }
    ])
  ),
  Jimp.read(logoSmallPath).then(
    buildImages(icoBuildPath, [
      { imageSize: 32 },
      { imageSize: 24 },
      { imageSize: 16 }
    ])
  )
]).then(() => {
  return iconGen(icoBuildPath, buildPath, { report: false, ico: { name: "lolgo" } });
}).then(() => {
  console.log("Wrote", path.join(buildPath, "lolgo.ico"));
});

// Mac OS ICNS logo ---------------------------------------------------------------------------------------------------

const doneMacOsLogo = Promise.all([
  Jimp.read(logoPath).then(
    buildPaddedImages(icnsBuildPath, [
      { imageSize: 920, canvasSize: 1024 },
      { imageSize: 460, canvasSize: 512 },
      { imageSize: 230, canvasSize: 256 },
      { imageSize: 116, canvasSize: 128 },
      { imageSize: 56, canvasSize: 64 },
      { imageSize: 42, canvasSize: 48 }
    ])
  ),
  Jimp.read(logoSmallPath).then(
    buildPaddedImages(icnsBuildPath, [
      { imageSize: 28, canvasSize: 32 },
      { imageSize: 20, canvasSize: 24 },
      { imageSize: 14, canvasSize: 16 }
    ])
  )
]).then(() => {
  return iconGen(icnsBuildPath, buildPath, { report: false, icns: { name: "lolgo" } });
}).then(() => {
  console.log("Wrote", path.join(buildPath, "lolgo.icns"));
});

// Other logos --------------------------------------------------------------------------------------------------------

Promise.all([
  doneWindowsLogo,
  doneMacOsLogo
]).then(() => {
  shell.cp(logoPath, path.join(buildPath, "lolgo.png"));
  console.log("Wrote", path.join(buildPath, "lolgo.png"));

  shell.cp(logoSmallPath, path.join(buildPath, "lolgo-tray@2x.png"));
  console.log("Wrote", path.join(buildPath, "lolgo-tray@2x.png"));

  return Jimp.read(logoSmallPath).then(flow([
    resizeImage(16, 16),
    writeImageAsync(path.join(buildPath, "lolgo-tray.png"))
  ])).then(() => {
    console.log("Wrote", path.join(buildPath, "lolgo-tray.png"));
  });
}).then(() => {
  shell.rm("-fr", icoBuildPath);
  shell.rm("-fr", icnsBuildPath);
});
