const fs = require('fs/promises');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const soundFileDir = path.resolve(
  projectRoot,
  '..',
  'set-dances',
  'Sound Files',
);

fs.readdir(soundFileDir, { withFileTypes: true }).then((files) => {
  const tunes = [];
  files.forEach((file) => {
    const fileNameWithoutExt = file.name.replace('.m4a', '');
    const [type, name, defaultSpeedString] = fileNameWithoutExt.split('-');
    const defaultSpeed = Number.parseInt(defaultSpeedString, 10);
    const key =
      type +
      '_' +
      name
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\'/g, '')
        .replace(/\./g, '') +
      '_' +
      defaultSpeedString;
    const outputFileName = `${key}.m4a`;
    console.log(`${type} ${key} ${defaultSpeed}`);
    tunes.push({
      key,
      name,
      value: `require('@/assets/audio/${outputFileName}')`,
      type,
      defaultSpeed,
    });
    const sourcePath = path.join(soundFileDir, file.name);
    const destPath = path.join(projectRoot, 'assets', 'audio', outputFileName);
    fs.copyFile(sourcePath, destPath);
  });
  console.log(
    JSON.stringify(tunes, null, 2)
      .replace(/\"require/g, 'require')
      .replace(/m4a\'\)\"/g, "m4a')"),
  );
});
