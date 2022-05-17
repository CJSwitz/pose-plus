import { makeAutoObservable, observable } from 'mobx';
import { unitToMs } from 'LIB/time.js';

/* Defaults
session: {
  timer: {
    mode: 0,
    simple: { time: 180, unit: 0 },
    advanced: [ { images: 10, time: 180, unit: 0 } ]
  },
  images: {
    mode: 0,
    collection: null,
    sources: []
  },
  shuffle: false
}
*/

export default class Session {
  constructor( store, shuffle, timer, images ) {
    this.rootStore = store.rootStore;
    this.shuffle = shuffle;
    this.timer = timer;
    this.images = images;

    makeAutoObservable( this, {
      timer: observable.ref,
      images: observable.ref,
      shuffle: observable.ref
    }, { autoBind: true } );
  }

  get asPlain() {
    return {
      shuffle: this.shuffle,
      timer: this.timer,
      images: this.images,
    }
  }

  get validTimer() {
    if ( this.timer.mode == 0 ) return true;
    else if ( this.timer.mode == 1 ) return ( this.timer.simple.time > 0 );
    else {
      return this.timer.advanced
        .map( t => t.images > 0 && t.time > 0 )
        .every( v => v );
    }
  }

  get imageCount() {
    if ( this.images.mode == 1 ) {
      let col = this.rootStore.colStore.getCollection( this.images.collection );
      return col ? col.count : 0;
    } else {
      let sources = this.rootStore.srcStore.sources;
      let arr = this.images.mode == 2 ? sources.filter( ( s ) => this.images.sources.includes( s.id ) ) : sources;
      return arr.map( s => s.count ).reduce( ( a, c ) => a + c, 0 );
    }
  }

  get fileInfo() {
    // Get array of file info
    const { colStore, srcStore } = this.rootStore;

    let sources = ( () => {
      if ( this.images.mode == 0 ) return srcStore.sources;
      else if ( this.images.mode == 1 ) {
        return colStore.getCollection( this.images.collection ).sourceObjects;
      } else {
        return srcStore.sources.filter( s => this.images.sources.includes( s.id ) );
      }
    } )();

    return Promise.all( sources.map( s => s.fetchInfo() ) ).then( ( arr ) => arr.flat() );
  }

  get timeParams() {
    // Translate timer for input to player-session
    let m = this.timer.mode;
    if ( m == 0 ) return false;
    else if ( m == 1 ) {
      let t = this.timer.simple;
      return { mode: 'simple', duration: Math.round( unitToMs( t.time, t.unit ) / 1000 ) };
    } else {
      let timer = this.timer.advanced;
      return {
        mode: 'advanced',
        timers: timer.map( t => {
          return { for: t.images, duration: Math.round( unitToMs( t.time, t.unit ) / 1000 ) };
        } )
      }
    }
  }

  updateTimer( update ) {
    this.timer = Object.assign( {}, this.timer, update );
    return this;
  }

  updateImages( update ) {
    this.images = Object.assign( {}, this.images, update );
    return this;
  }

  updateShuffle( shuffle ) {
    this.shuffle = shuffle;
    return this;
  }

}
