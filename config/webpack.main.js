const { join, resolve } = require( 'path' );
const { env } = require( 'process' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');

const DIR = resolve( __dirname, '..' );

const common = {
  entry: './src/main/main.js',
  module: {},
  plugins: [
    new CopyPlugin( {
      patterns: [ {
        from: join( DIR, 'static/main' ),
        to: 'res'
      } ]
    } ),
    new EnvironmentPlugin({
      NODE_ENV: 'development'
    })
  ],

};

const development = {
  mode: 'development',
  devtool: 'source-map',
  cache: {
    type: 'filesystem',
    cacheDirectory: join( DIR, '.cache' )
  }
}

const production = {
  mode: 'production',
  devtool: false
}

module.exports = (()=>{
  if (env.NODE_ENV === 'production') return merge( common, production );
  else return merge( common, development );
})();