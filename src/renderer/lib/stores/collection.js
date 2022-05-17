import { makeAutoObservable } from 'mobx';

export default class Collection {
  constructor( store, name, sources ) {
    this.store = store;
    this.name = name;
    this.sources = sources;

    makeAutoObservable( this, {
      store: false
    }, { autoBind: true } );
  }

  // To/From Plain
  static fromPlain( store, obj ) {
    return new Collection( store, obj.name, obj.sources )
  }

  get asPlain() {
    return {
      name: this.name,
      sources: this.sources.slice()
    }
  }

  // Computed

  get id() {
    return this.name;
  }

  get sourceObjects() {
    return this.store.rootStore.srcStore.sources.filter( ( s ) => {
      return this.sources.includes( s.id );
    } );
  }

  get count() {
    return this.sourceObjects
      .map( ( s ) => s.count ? s.count : 0 )
      .reduce( ( a, c ) => a + c , 0);
  }

  get status() {
    return this.sourceObjects.map( s => s.status )
      .reduce( ( a, c ) => {
        if (c == 'error') return c;
        else if (c == 'unknown' && a != 'error') return c;
        else return a;
      }, 'ok' );
  }

  // Derived
  fetchPaths() {
    let proms = this.sourceObjects.map( s => {
      return ipc.invoke( 'read-folder', s.path ).then( ( entries ) => {
        return entries.map( ( entry ) => 'source://' + s.id + '/' + entry );
      } )
    } );

    return Promise.all( proms ).then( nested => {
      return nested.flat().map( p => encodeURI( p ) );
    } );
  }

  // Actions
  update( name, sources ) {
    this.name = name;
    this.sourecs = sources;
  }

  setName( name ) {
    this.name = name;
  }

  setSources( sources ) {
    this.sources = sources;
  }

  addSource( source ) {
    this.sources.push( source );
  }

  removeSource( source ) {
    this.sources = this.sources.filter( s => s != source );
  }
}
