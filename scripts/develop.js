require('dotenv').config();
const { promisify } = require('util');
const spawn = promisify(require('child_process').spawn);

const { env } = require('process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const args = { mode: 'development' };

const mainConf = require('../config/webpack.main.js')(env, args);
const preloadConf = require('../config/webpack.preload.js')(env, args);
const rendererConf = require('../config/webpack.renderer.js')(env, args);

const devServerOptions = {};

function build(prefix, config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(`[${prefix}] Encountered webpack error:`);
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        reject(err);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(`[${prefix}] Encountered build errors:`);
        console.error(info.errors);
        reject(err);
      }

      if (stats.hasWarnings()) {
        console.warn(`[${prefix}] Encountered build warnings:`);
        console.warn(info.warnings);
      }

      console.log(`[${prefix}] Built`);
      resolve();
    })
  });
}

(async () => {

  console.log('Compiling MAIN');
  await build('MAIN', mainConf);

  console.log('Compiling PRELOAD');
  await build('PRELOAD', preloadConf);

  console.log('Compiling and starting dev server');
  const rendererComp = webpack(rendererConf);
  const server = new WebpackDevServer(devServerOptions, rendererComp);
  await server.start();

  console.log('Starting Electron');
  await spawn('npx', ['electron', '.'], {
    stdio: 'inherit',
    shell: true
  });

  console.log('Stopping');
  await server.stop();
})()



