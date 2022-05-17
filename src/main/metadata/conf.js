const { join } = require( 'path' );
const { ipcMain, dialog, app } = require( 'electron' );
const Persistence = require( './persistence.js' );

const DEFAULTS = {
  lastDir: app.getPath( 'home' ),
  pos: { width: 1200, height: 800 },
  playerPos: { width: 1200, height: 800 }
};

class Conf {
  constructor( dir ) {
    this.path = join( dir, 'conf.json' );

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


}

module.exports = Conf;
