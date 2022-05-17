import Vector from './vector.js';

export function shouldFitWidth( src, dst ) {
  return src.aspect < dst.aspect;
}

// Calculates offset P and scaling factor g from rectangle described by pos & size
export function calcFromRect( pos, size, canvas ) {
  if ( shouldFitWidth( size, canvas ) ) {
    let g = size.x / canvas.x;
    let p = pos.sub( new Vector( 0, ( g * canvas.y - size.y ) / 2 ) );
    return [ p, g ];
  } else {
    let g = size.y / canvas.y;
    let p = pos.sub( new Vector( ( g * canvas.x - size.x ) / 2, 0 ) );
    return [ p, g ];
  }
}

// Compute [sx, sy, sw, sh, dx, dy, dw, hw] given canvas c, offset p and scaling factor g
export function calcBounds( p, g, c ) {
  let q = c.scale( g );
  return [
    p.x, p.y,
    q.x, q.y,
    0, 0,
    c.x, c.y
  ]
}

// Computes the bounds of a given image on the canvas
export function getImageOnCanvas( cv, iv, pv, g ) {
  const offset = pv.scale( -1 / g );
  const pos = new Vector( Math.max( offset.x, 0 ), Math.max( offset.y, 0 ) );
  const fv = iv.scale( 1 / g ).add( pos );
  const size = new Vector( Math.min( cv.x, fv.x ), Math.min( cv.y, fv.y ) ).sub( pos );
  return { pos, size };
}

export function rectFromPoints( a, b ) {

  const x = Math.min( a.x, b.x );
  const y = Math.min( a.y, b.y );
  const w = Math.max( a.x, b.x ) - x;
  const h = Math.max( a.y, b.y ) - y;
  return [ new Vector( x, y ), new Vector( w, h ) ];
}
