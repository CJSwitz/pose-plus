import { makeAutoObservable } from 'mobx';
import ImageCache from './image-cache.js'

function shuffleArray( input ) {
  let array = input.slice();
  let m = array.length;
  let t, i;

  while ( m ) {
    i = Math.floor( Math.random() * m-- );
    t = array[ m ]
    array[ m ] = array[ i ]
    array[ i ] = t
  }

  return array;
}

export default class ImageManager {
  constructor( files, shuffle, leadBy = 3, followBy = 1 ) {
    this.files = files; // Immutable
    this.shuffle = shuffle;
    this.leadBy = leadBy;
    this.followBy = followBy;
    this.cur = 0;

    let indicies = files.map( ( e, i ) => i );
    this.mapping = shuffle ? shuffleArray( indicies ) : indicies;

    this.cache = new ImageCache( ( leadBy + followBy + 1 ) * 2 ); // Immutable

    this.updateCache();

    makeAutoObservable( this, {
      cache: false,
      files: false, // Mobx takes a long time to make this observable
    } )
  }

  get currentInfo() {
    return this.files[ this.mapping[ this.cur ] ];
  }

  getCurrent() {
    let info = this.currentInfo;
    return {
      ...info,
      image: this.cache.get( info.url ),
    }
  }

  wrap( i ) {
    let j = i % this.mapping.length;
    if ( j < 0 ) j += this.mapping.length;
    return j;
  }

  next() {
    this.cur = this.wrap( this.cur + 1 );
    this.updateCache();
  }

  prev() {
    this.cur = this.wrap( this.cur - 1 );
    this.updateCache();
  }

  toggleShuffle() {
    if ( this.shuffle ) {
      this.shuffle = false;
      this.cur = this.mapping[ this.cur ]; // Set current to the actual index
      this.mapping = this.files.map( ( e, i ) => i ); // Set the mapping to be the raw indicies
    } else {
      this.shuffle = true;
      let newmap = shuffleArray( this.mapping.filter( ( e, i ) => i != this.cur ) ); // Shuffle everything but current
      this.mapping = [ this.cur ].concat( newmap ); // Place current at index 0
      this.cur = 0; // Point to start, which maps to original current
    }

    this.updateCache();
  }

  updateCache() {
    const lead = Array( this.leadBy ).fill( null ).map( ( e, i ) => this.wrap( i + 1 + this.cur ) );
    const follow = Array( this.followBy ).fill( null ).map( ( e, i ) => this.wrap( i - 1 + this.cur ) );
    const urls = [ this.cur ].concat( lead ).concat( follow ).map( v => this.files[ this.mapping[ v ] ].url );

    this.cache.load( urls );
  }
}
