import { makeAutoObservable, reaction, action } from 'mobx';
import Source from './source.js';

export default class SourcesStore {
  constructor() {
    this.sources = [];
    this.ready = false;

    makeAutoObservable( this, {
      persist: false,
      saveHandler: false,
      dispose: false
    }, { autoBind: true } );

    this.saveHandler = reaction(
      () => this.sources.map( s => s.asPlain ),
      arr => {
        if ( this.ready ) ipc.send( 'update-sources', { sources: arr } )
      }
    )

    this.fetch();
  }

  // API interaction
  fetch() {
    ipc.invoke( 'fetch-sources' ).then( action( 'fetch-sources', ( data ) => {
      this.sources = data.sources.map( ( obj ) => Source.fromPlain( this, obj ) );
      this.ready = true;
    } ) );
  }

  persist() {
    let updateData = { sources: this.sources.map( s => s.asPlain ) };
    ipc.send( 'update-sources', updateData );
  }

  // Actions
  add( source ) {
    source.store = this;
    this.sources.push( source );

    this.sort()

  }

  sort() {
    this.sources.sort((a, b) => {
      let x, y;
      if (a.label && !b.label) return -1;
      else if (!a.label && b.label) return 1;
      else if (a.label && b.label) {
        x = a.label.toLowerCase();
        y = b.label.toLowerCase();
      } else {
        x = a.path.toLowerCase();
        y = b.path.toLowerCase();
      }

      if (x > y) return 1;
      else if (x < y) return -1;
      else return 0;
    })
  }

  addNew( path, label ) {
    // This function disallows duplicate paths
    if ( this.pathExists( path ) ) return false;
    let source = Source.create( path, label, this )
    this.add( source );
    return source.id;
  }

  remove( id ) {
    this.sources = this.sources.filter( ( s ) => {
      if ( s.id == id ) {
        s.dispose();
        return false;
      } else return true
    } );
  }

  // Derivations
  getSource( id ) {
    return this.sources.find( ( s ) => s.id == id );
  }

  pathExists( path ) {
    return this.sources.find( ( s ) => s.path == path );
  }

  // Cleanup
  dispose() {
    this.saveHandler()
  }
}
