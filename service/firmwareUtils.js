const fs = require('fs');
const path = require('path');

const getLastFirmware = (directoryPath) => {
  try {
    const files = fs.readdirSync(directoryPath);
    const filteredFiles = files.filter(file => /^version_\d{2}_firmware\.bin$/.test(file));
    const sortedFiles = filteredFiles.sort();
    const largestFile = sortedFiles[sortedFiles.length - 1];

    console.log('The largest file is:', largestFile);
    return largestFile;
  } catch (err) {
    console.error('Error reading directory:', err);
    throw err;
  }
};

module.exports = getLastFirmware;
