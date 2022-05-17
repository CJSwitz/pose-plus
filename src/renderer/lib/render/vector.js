// Basic Vector Implementation

export default class Vector {
  constructor( x, y ) {
    this.x = x;
    this.y = y;
  }

  get aspect() {
    return this.y / this.x;
  }

  get rounded() {
    return new Vector( Math.round( this.x ), Math.round( this.y ) );
  }

  add( v ) {
    return new Vector( this.x + v.x, this.y + v.y );
  }

  sub( v ) {
    return new Vector( this.x - v.x, this.y - v.y );
  }

  scale( s ) {
    return new Vector( this.x * s, this.y * s );
  }

  mul( v ) {
    return new Vector( this.x * v.x, this.y * v.y );
  }

  div( v ) {
    return new Vector( this.x / v.x, this.y / v.y );
  }



  toString() {
    return `x:${this.x}, y:${this.y}`;
  }

  equals( other ) {
    return other.x === this.x && other.y === this.y;
  }

  toArray() {
    return [ this.x, this.y ];
  }

  static fromArray( arr ) {
    return new Vector( arr[ 0 ], arr[ 1 ] );
  }
}

export const V0 = new Vector( 0, 0 );
export const V1 = new Vector( 1, 1 );
