const { join } = require( 'path' );
const { ipcMain, dialog, app } = require( 'electron' );
const Persistence = require( './persistence.js' );

const DEFAULTS = {
  independentSize: false,
  skipThreshold: 0.8,
  bgCol: '#444',
  autoBG: true,
  dockControls: false,
  dockTimer: false,
  session: {
    timer: {
      mode: 0,
      simple: { time: 180, unit: 0 },
      advanced: [ { images: 10, time: 180, unit: 0 } ]
    },
    images: {
      mode: 0,
      collection: null,
      sources: []
    },
    shuffle: false
  }
};

class Prefs {
  constructor( dir ) {
    this.path = join( dir, 'prefs.json' );

    try {
      this.persistence = new Persistence( this.path, DEFAULTS );
    } catch ( e ) {
      onError( e );
      app.exit( 1 );
    }
  }

  register() {
    ipcMain.handle( 'fetch-prefs', () => this.persistence.data );
    ipcMain.on( 'update-prefs', ( e, data ) => this.persistence.update( data ) );
  }

  get data() {
    return this.persistence.data;
  }
}

module.exports = Prefs;
