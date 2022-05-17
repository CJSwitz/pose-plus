const { join } = require( 'path' );
const { ipcMain, dialog, app } = require( 'electron' );
const Persistence = require( './persistence.js' );

const DEFAULTS = { version: 1, sources: [] };

class Sources {
  constructor( dir ) {
    this.path = join( dir, 'sources.json' );

    try {
      this.persistence = new Persistence( this.path, DEFAULTS );
    } catch ( e ) {
      onError( e );
      app.exit( 1 );
    }
  }

  get data() {
    return this.persistence.data;
  }

  register() {
    ipcMain.handle( 'fetch-sources', () => this.persistence.data );
    ipcMain.on( 'update-sources', ( e, data ) => this.persistence.update( data ) );
  }
}

module.exports = Sources;
