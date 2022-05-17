require('dotenv').config();

const { pathToFileURL } = require( 'url' );
const path = require( 'path' );
const { env } = require( 'process' );
const afterCopy = require('./afterCopyHook.js');

const { WIN_CERT_PASSWD, WIN_CERT_PATH } = env;
const iconPath = path.resolve( __dirname, '../static/installer/Logo' )
const iconUrl =  pathToFileURL(iconPath + '.ico');

const zipMaker = {
  name: '@electron-forge/maker-zip',
  platforms: ["win32", "darwin"],
}

const squirrelMaker = {
  name: "@electron-forge/maker-squirrel",
  platforms: ["win32"],
  config: {
    certificateFile: WIN_CERT_PATH,
    certificatePassword: WIN_CERT_PASSWD,
  }
}

const wixMaker = {
  name: '@electron-forge/maker-wix',
  platforms: ["win32"],
  config: {
    language: 1033,
    name: 'Pose Plus',
    manufacturer: 'Connor Switzer',
    programFilesFolderName: 'PosePlus',
    shortName: 'PosePlus',
    shortcutFolderName: 'PosePlus',
    certificateFile: WIN_CERT_PATH,
    certificatePassword: WIN_CERT_PASSWD,
    beforeCreate: (creator) => {
      creator.appIconPath = iconPath + '.ico';
    }
  }
}

const dmgMaker = {
  name: '@electron-forge/maker-dmg',
  platforms: ["darwin"],
  config: {
    format: 'ULFO',
  }
}

const webpackPlugin = [
  '@electron-forge/plugin-webpack', {
    devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
    mainConfig: require('./webpack.main.js'),
    renderer: {
      config: require('./webpack.renderer.js'),
      entryPoints: [{
        name: 'main',
        html: './src/renderer/index.html',
        js: './src/renderer/renderer.js',
        preload: {
          js: './src/renderer/preload.js'
        }
      }]
    }
  }
]

module.exports = {
  packagerConfig: {
    icon: iconPath,
  },
  makers: [ dmgMaker, zipMaker, squirrelMaker ],
  plugins: [ webpackPlugin ],
  hooks: {
    packageAfterCopy: afterCopy
  }
}
