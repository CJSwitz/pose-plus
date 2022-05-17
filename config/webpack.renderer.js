const { env } = require( 'process' );
const { join, resolve } = require( 'path' );
const { merge } = require( 'webpack-merge' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

const DIR = resolve( __dirname, '..' );

function getCSSRules( prod ) {
  const loader = prod ? MiniCssExtractPlugin.loader : { loader: 'style-loader' };
  return [ {
    // SASS Files
    test: /\.scss$/,
    use: [
      loader,
      { loader: 'css-loader', options: { url: false } },
      {
        loader: 'sass-loader',
        options: {
          implementation: require( 'sass' ),
          webpackImporter: true,
          sassOptions: {
            includePaths: [ './node_modules' ]
          }
        }
      },
    ]
  }, {
    // Straight CSS Files (required for @tippyjs/react)
    test: /\.css$/,
    use: [
      loader,
      { loader: 'css-loader', options: { url: false } },
    ]
  } ];
}

// CSP SETTINGS - Need to move these to proper place
/*
const prodCSP = {
  'default-src': [ "'self'" ],
  'script-src': "'self'",
  'style-src': "'self'",
  'img-src': [ "'self'", 'source://*' ],
  'style-src-attr': [ "'self'", "'unsafe-inline'" ]
}

const devCSP = {
  ...prodCSP,
  'script-src': [ "'self'", "'unsafe-inline'", "'unsafe-eval'" ],
  'style-src': [ "'self'", "'unsafe-inline'" ],
}


const CSPAddOpts = {
  hashEnabled: {
    'script-src': true,
    'style-src': true
  },
  nonceEnabled: {
    'script-src': false,
    'style-src': false
  },
}
*/

// Webpack configurations

const common = {
  plugins: [
    new CopyPlugin( {
      patterns: [ {
        from: join( DIR, 'static/renderer' ),
        to: 'res'
      } ]
    } )
  ],
  module: {
    rules: [ {
      // JSX Support
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          exclude: '/node_modules/',
          presets: [ '@babel/preset-react' ]
        }
      }
    }, {
      // SVGs for React
      test: /\.svg$/,
      issuer: /\.jsx?$/,
      use: [ {
        loader: '@svgr/webpack',
        options: { ref: true }
      } ]
    }, ]
  },
  resolve: {
    alias: {
      SVG: join( DIR, 'src/renderer/svg' ),
      LIB: join( DIR, 'src/renderer/lib' ),
      CSS: join( DIR, 'src/renderer/css' ),
    }
  },

};

const development = {
  mode: 'development',
  module: {
    rules: getCSSRules( false )
  },
  devtool: 'source-map',
  cache: {
    type: 'filesystem',
    cacheDirectory: join( DIR, '.cache' )
  },

};

const production = {
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: getCSSRules( true )
  },
  devtool: false,
  mode: 'production',
};

module.exports = (()=>{
  if (env.NODE_ENV === 'production') return merge( common, production );
  else return merge( common, development );
})();