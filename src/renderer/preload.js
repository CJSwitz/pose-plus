const { join } = require( 'path' );
const { contextBridge, ipcRenderer, webFrame } = require( 'electron' )

const { version } = require( '../../package.json' );

const PERMITTED = [
  'fetch-sources',
  'update-sources',
  'fetch-prefs',
  'update-prefs',
  'fetch-collections',
  'update-collections',
  'read-folder',
  'count-folder',
  'check-folder',
  'select-folder',
  'open-folder',
  'show-in-folder',
  'toggle-view'
]

contextBridge.exposeInMainWorld(
  'ipc', {
    send: ( channel, ...args ) => {
      if ( PERMITTED.includes( channel ) ) {
        ipcRenderer.send( channel, ...args );
      } else throw new Error( `IPC Channel ${channel} is not permitted` );
    },
    invoke: ( channel, ...args ) => {
      if ( PERMITTED.includes( channel ) ) {
        return ipcRenderer.invoke( channel, ...args );
      } else {
        return Promise.reject(
          new Error( `IPC Channel ${channel} is not permitted` ) )
      }
    }
  }
);

contextBridge.exposeInMainWorld(
  'util', {
    join: join,
    clearCache: webFrame.clearCache,
    VERSION: version
  }
)
