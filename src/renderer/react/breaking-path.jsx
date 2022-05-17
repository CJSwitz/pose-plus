import './breaking-path.scss';
import React from 'react';

const re = /[\\/]/;

function splitPath( path, arr = [] ) {
  if ( path.length == 0 ) return arr;
  const match = path.match( re );
  if ( !match ) return arr.concat( path );
  else return splitPath(
    path.substring( match.index + 1 ),
    arr.concat( path.substring( 0, match.index + 1 ) )
  );
}

export default function BreakingPath( { path, className } ) {
  let clazz = 'breaking-path';
  if ( className ) clazz += ' ' + className;

  const elems = splitPath( path ).map( (s, i) => {
    return <span key={i} className='breaking-path__segment'>{s}</span>
  } );

  return <span className={clazz}>{elems}</span>
}
