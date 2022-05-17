const fs = require( 'fs/promises' );
const { shell, dialog, ipcMain } = require( 'electron' );

function setup( win ) {

  // Select Folders
  ipcMain.handle( 'select-folder', ( event, multi, path ) => {
    const opts = {
      defaultPath: path,
      properties: [ 'openDirectory', 'noResolveAliases' ]
    }
    if ( multi ) opts.properties.push( 'multiSelections' );
    return dialog.showOpenDialog( win, opts )
  } );

  // Open Folder
  ipcMain.on( 'open-folder', ( event, path ) => {
    fs.stat( path ).then( stats => {
        // Should only allow opening of directories, not random files
        if ( stats.isDirectory() ) return;
        else throw new Error( path + ' is not a directory' );
      } )
      .then( () => shell.openPath( path ) )
      .catch( ( er ) => {
        dialog.showErrorBox( 'Failed to open directory', er.message );
      } );
  } )

  // Show In Folder
  ipcMain.on( 'show-in-folder', ( event, path ) => {
    shell.showItemInFolder( path );
  } );
}

module.exports = setup;
