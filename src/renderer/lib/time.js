// Time related helper functions

function unitToMs( time, unit ) {
  // Returns milliseconds
  if ( unit == 0 ) return Math.round( time * 1000 ); // Seconds
  else return Math.round( time * 1000 * 60 ); // Minutes
}

function msToUnit( ms ) {
  // Returns [time, unit] tuple
  if ( ms > 1000 * 60 * 4 ) return [ ms / 1000 / 60, 1 ];
  else return [ ms / 1000, 1 ];
}

function msToComponents( ms ) {
  // Returns [Hours, Minutes, Seconds] tuple
  let hours = Math.floor( ms / 1000 / 60 / 60 );
  let mins = Math.floor( ( ms / 1000 / 60 ) - ( hours * 60 ) );
  let secs = Math.floor( ( ms / 1000 ) - ( hours * 60 * 60 ) - ( mins * 60 ) );
  return [ hours, mins, secs ];
}

function msToString( ms, withS = true ) {
  // Returns HH:MM:SS string
  let [ h, m, s ] = msToComponents( ms );
  if ( h > 0 ) {
    return h + ':' + m.toString().padStart( 2, '0' ) + ':' + s.toString().padStart( 2, '0' );
  } else if ( m > 0 ) {
    return m + ':' + s.toString().padStart( 2, '0' );
  } else {
    if (withS) return s + 's';
    else return s.toString();
  }
}

export { unitToMs, msToUnit, msToComponents, msToString };
