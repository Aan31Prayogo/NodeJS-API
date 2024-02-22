const fs = require('fs');

const lastFirmware = (path_) => {
    fs.readdir(path_, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
        const filteredFiles = files.filter(file => /^version_\d{2}_firmware\.bin$/.test(file));       
        const sortedFiles = filteredFiles.sort();
        const largestFile = sortedFiles[sortedFiles.length - 1];
        return  largestFile
    });
}

module.exports = lastFirmware