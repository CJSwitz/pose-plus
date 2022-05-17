const { readFileSync, writeFileSync } = require( 'fs' );
const { writeFile } = require( 'fs/promises' );
const { dialog } = require( 'electron' );
const _ = require( 'lodash' );

const DEBOUNCE_MS = 1000;

function loadOrCreate( path, defaults ) {
  try {
    return JSON.parse( readFileSync( path, { encoding: 'utf8' } ) );
  } catch ( re ) {
    if ( re.code == 'ENOENT' ) {
      try {
        writeFileSync( path, JSON.stringify( defaults ) );
        return defaults;
      } catch ( we ) {
        throw new Error( `Failed to write ${path}: ${re.message}` );
      }
    } else throw new Error( `Failed to read ${path}: ${re.message}` );
  }
}

function onError( e ) {
  console.error( e.message );
  dialog.showErrorBox( 'Filesystem Error', e.message );
}

class Persistence {
  constructor( path, defaults ) {
    this.path = path;
    this.queue = Promise.resolve();
    this.data = loadOrCreate( path, defaults );
    this.lastSaved = this.data;
    this.timer;

    this.saved = true;
  }

  update( data ) {
    this.data = data;
    this.saved = false;

    // Debounce
    clearTimeout( this.timer );
    this.timer = setTimeout( () => this.save(), DEBOUNCE_MS );
  }

  save() {
    if (this.saved) return; // Don't bother re-saving
    if (_.isEqual(this.data, this.lastSaved)) {
      // Data hasn't changed
      this.lastSaved = this.data;
      this.saved = true;
      return;
    }

    clearTimeout( this.timer ); // Clear any queued saves

    const promise = this.queue.then( async () => {
      await writeFile( this.path, JSON.stringify( this.data ) );
      this.saved = true;
      this.lastSaved = this.data;
    } ).catch( ( e ) => {
      e.message = `Failed to update ${this.path}: ${e.message}`;
      onError( e );
    } )

    this.queue = promise;
    return promise;
  }
}

module.exports = Persistence;
