const fs = require( 'fs' );
const { extname } = require( 'path' );
const { ipcMain } = require( 'electron' );

const validate = require( './valid-exts' );

function readFolder( path ) {
  return fs.promises.readdir( path, { withFileTypes: true } ).then( ( dirents ) => {
    return dirents.filter( de => de.isFile() ).map( de => de.name )
      .filter( ( fname ) => validate( extname( fname ) ) )
  } )
}

function checkAccess( path ) {
  return fs.promises.access( path, fs.constants.R_OK )
    .then( () => true )
    .catch( ( err ) => false );
}

function setup() {
  ipcMain.handle( 'read-folder', ( e, path ) => readFolder( path ) );
  ipcMain.handle( 'count-folder', ( e, path ) => readFolder( path ).then( a => a.length ) );
  ipcMain.handle( 'check-folder', ( e, path ) => checkAccess( path ) );
}
module.exports = setup;
