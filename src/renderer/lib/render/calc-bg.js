import Vector from 'LIB/render/vector.js';

const { min, max } = Math;
const { performance: perf } = window;

export default function calcBG( image ) {
  const data = getImageData( image );
  return measure( data );
}

function getImageData( image ) {
  const s = 100;
  const canvas = new OffscreenCanvas( s, s );
  const ctx = canvas.getContext( '2d' );
  ctx.drawImage( image, 0, 0, s, s );
  return ctx.getImageData( 0, 0, s, s );
}

function measure( imageData ) {
  const samples = sampleBorder( imageData, 100 );
  const avg = findAverage( samples );
  return '#' + avg.map( getHex ).join( '' );
}

function getHex( num ) {
  return num.toString( 16 ).padStart( 2, '0' );
}

function findAverage( arr ) {
  return [
    Math.round( averageColor( arr, 0 ) ),
    Math.round( averageColor( arr, 1 ) ),
    Math.round( averageColor( arr, 2 ) )
  ];
}

function averageColor( arr, offset ) {
  return Math.sqrt( arr.map( c => Math.pow( c[ offset ], 2 ) ).reduce( ( a, c ) => a + c ) / arr.length )
}

function sampleBorder( id, samples ) {
  // Winds around clockwise
  const top = sampleLine( id, new Vector( 0, 0 ), new Vector( id.width, 0 ), samples );
  const right = sampleLine( id, new Vector( id.width - 1, 0 ), new Vector( 0, id.height ), samples );
  const bottom = sampleLine( id, new Vector( id.width - 1, id.height - 1 ), new Vector( id.width * -1, 0 ), samples );
  const left = sampleLine( id, new Vector( 0, id.height - 1 ), new Vector( 0, id.height * -1 ), samples );
  return [ top, right, bottom, left ].flat();
}

function sampleLine( imageData, from, to, samples ) {
  // Delberately doesn't measure positon FROM + TO to avoid resampling
  let arr = [];
  for ( let i = 0; i < samples; i++ ) {
    let pos = to.scale( 1 / samples * i ).add( from ).rounded;
    arr.push( sample( imageData, pos ) );
  }
  return arr;
}

function sample( imageData, pos ) {
  const { data, width } = imageData;
  const i = ( pos.y * width * 4 ) + ( pos.x * 4 );
  return [ data[ i ], data[ i + 1 ], data[ i + 2 ], data[ i + 3 ] ];
}
