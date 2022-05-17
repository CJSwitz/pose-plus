import LRU from 'lru-cache';

function loadImage( url ) {
  let img = new Image();
  img.src = url;
  img.decoding = 'async';
  img.decode().catch( ( ignored ) => false );
  return img;
}

// LRU Image cache
export default class ImageCache {
  constructor( size ) {
    this.cache = new LRU( {max: size} );
  }

  load( urls ) {
    const arr = Array.isArray( urls ) ? urls : [ urls ];
    arr.forEach( url => {
      const found = this.cache.get(url);
      if (!found) this.cache.set(url, loadImage(url));
    } );
  }

  get( url ) {
    const found = this.cache.get(url);
    if (!found) {
      let img = loadImage(url);
      this.cache.set(url, img);
      return img;
    } else return found;
  }
}
