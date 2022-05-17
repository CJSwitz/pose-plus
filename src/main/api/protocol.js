const { join, extname } = require( 'path' );
const { protocol } = require( 'electron' );
const validate = require( './valid-exts' );

// Unsafe, allows unrestricted access to local fs
function registerLocalProtocol() {
  protocol.registerFileProtocol( 'local', ( request, callback ) => {
    const path = decodeURI( request.url ).substring( 8 );
    callback( path );
  } )
}

// Safer, restricts to registered source folders and extensions
function registerSourceProtocol( sourceMD ) {
  protocol.registerFileProtocol( 'source', ( request, callback ) => {
    const [ sourceID, file ] = decodeURI( request.url ).substring( 9 ).split( '/' );
    let ext = extname( file );
    if ( validate( ext ) ) {
      const sd = sourceMD.data;
      const source = sd.sources.find( ( s ) => s.id == sourceID );
      if ( source && source.type == 'folder' ) callback( join( source.path, file ) );
      else callback( { error: -6, statusCode: 404 } );
    } else callback( { error: -4, statusCode: 403 } );
  } )
}

module.exports = { registerLocalProtocol, registerSourceProtocol };
