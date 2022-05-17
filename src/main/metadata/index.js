const { app } = require( 'electron' );

const Conf = require( './conf.js' );
const Prefs = require( './prefs.js' );
const Sources = require( './sources.js' );
const Collections = require( './collections.js' );

function setup( dir ) {
  const conf = new Conf( dir );
  const prefs = new Prefs( dir );
  const sources = new Sources( dir );
  const collections = new Collections( dir );

  prefs.register();
  sources.register();
  collections.register();

  app.on( 'will-quit', async ( event ) => {
    event.preventDefault();
    await Promise.all( [
      conf.persistence.save(),
      prefs.persistence.save(),
      sources.persistence.save(),
      collections.persistence.save()
    ] );

    app.exit( 0 );
  } );

  return { conf, prefs, sources, collections };
}

module.exports = setup;
