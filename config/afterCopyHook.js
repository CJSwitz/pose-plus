const { copyFile } = require('fs/promises');
const { resolve } = require('path');

// Hook to copy license files into output package

const root = resolve(__dirname, '..');
const include = [
    'ThirdPartyLicenses.html',
    'LICENSE'
]

async function afterCopy(config, buildPath) {
    return Promise.all(include.map(file => {
        return copyFile(resolve(root, file), resolve(buildPath, file));
    }));
}

module.exports = afterCopy;