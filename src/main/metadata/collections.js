const { join } = require( 'path' );
const { ipcMain, dialog, app } = require( 'electron' );
const Persistence = require( './persistence.js' );

const DEFAULTS = { version: 1, collections: [] };

class Collections {
  constructor( dir ) {
    this.path = join( dir, 'collections.json' );

    try {
      this.persistence = new Persistence( this.path, DEFAULTS );
    } catch ( e ) {
      onError( e );
      app.exit( 1 );
    }
  }

  register() {
    ipcMain.handle( 'fetch-collections', () => this.persistence.data );
    ipcMain.on( 'update-collections', ( e, data ) => this.persistence.update( data ) );
  }
}

module.exports = Collections;
