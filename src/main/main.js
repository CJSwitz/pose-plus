const fs = require( 'fs' );
const path = require( 'path' );
const { app, BrowserWindow, ipcMain, session } = require( 'electron' );
const metadataSetup = require( './metadata' );
const dialogSetup = require( './api/dialogs' );
const fsQuerySetup = require( './api/fs-queries' );
const { registerSourceProtocol } = require( './api/protocol.js' );

const PROD = process.env.NODE_ENV === 'production'; // This is set by the webpack EnvironmentPlugin, not from the actual env
const PRELOAD = MAIN_PRELOAD_WEBPACK_ENTRY;
const ENTRY = MAIN_WEBPACK_ENTRY;
const PROD_CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' source://*; style-src-attr 'self' 'unsafe-inline'";
const DEV_CSP = "default-src 'self' 'unsafe-inline' local://* source://*; script-src 'self' 'unsafe-eval' 'unsafe-inline';";

app.commandLine.appendSwitch('force_high_performance_gpu');

// Squirrel startup, not used.
if ( require( 'electron-squirrel-startup' ) ) app.quit();

// Setup custom UserData, Metadata, and IPC Handlers
const userData = app.getPath( 'userData' );
const browserData = path.join( userData, 'Chromium' );
fs.mkdirSync( browserData, { recursive: true } );
app.setPath( 'userData', browserData );

const { conf, prefs, sources } = metadataSetup( userData );

fsQuerySetup();

// Setup resize handling
const MIN_SIZE = [ 650, 650 ];
var MainWindow;
var isPlayerView = false;

ipcMain.on( 'toggle-view', ( e, view ) => {
  isPlayerView = view;
  if ( isPlayerView ) MainWindow.setMinimumSize( 1, 1 ); //  0,0 doesn't work, bug in electron
  else MainWindow.setMinimumSize( ...MIN_SIZE );


  if ( prefs.data.independantSize ) {
    const bounds = isPlayerView ? conf.data.playerPos : conf.data.pos;
    MainWindow.setBounds( bounds );
  } else if ( !isPlayerView ) {
    // Workaround for auto-resize behaviour
    const [minWidth, minHeight] = MIN_SIZE;
    const bounds = MainWindow.getNormalBounds();
    if (bounds.width < minWidth) bounds.width = minWidth;
    if (bounds.width < minHeight) bounds.height = minHeight;
    MainWindow.setBounds( bounds );
  }
} );

function onMoveOrResize() {
  let bounds = MainWindow.getNormalBounds();
  let data = { ...conf.data };
  if ( isPlayerView && prefs.data.independantSize ) data.playerPos = bounds;
  else data.pos = bounds;
  conf.persistence.update( data );
}


// Setup MainWindow
function createWindow() {
  MainWindow = new BrowserWindow( {
    ...conf.data.pos,
    icon: path.resolve( __dirname, 'res/Logo.ico' ),
    backgroundColor: '#97005b',
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: PRELOAD,
      sandbox: false,
    }
  } );

  MainWindow.loadURL( ENTRY );
  MainWindow.setMinimumSize( ...MIN_SIZE );

  if ( PROD ) MainWindow.removeMenu();

  MainWindow.on( 'resized', () => onMoveOrResize() );
  MainWindow.on( 'moved', () => onMoveOrResize() );
};


// App Ready Handler
app.on( 'ready', async () => {
  
  // CSP setup
  // This method does indeed work for file:// protocol serves (at least from BrowserWindow.loadURL), despite what the docs claim. Electron v18.2
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': PROD ? PROD_CSP : DEV_CSP
      }
    });
  })

  registerSourceProtocol( sources );
  createWindow();
  dialogSetup( MainWindow );
} );

// MacOS close behaviour
app.on( 'window-all-closed', () => {
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
} );

app.on( 'activate', () => {
  if ( BrowserWindow.getAllWindows().length === 0 ) {
    createWindow();
  }
} );
