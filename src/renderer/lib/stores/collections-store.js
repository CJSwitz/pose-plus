import { makeAutoObservable, reaction, action, comparer } from 'mobx';
import Collection from './collection.js';

export default class CollectionsStore {
  constructor( rootStore ) {
    this.rootStore = rootStore;
    this.collections = [];
    this.ready = false;

    makeAutoObservable( this, {
      saveHandler: false,
      dispose: false,
    }, { autoBind: true } );

    this.saveHandler = reaction(
      () => this.collections.map( c => c.asPlain ),
      ( arr ) => {
        if ( this.ready ) ipc.send( 'update-collections', { collections: arr } )
      }, { equals: comparer.structural }
    )

    this.fetch();
  }

  // API Integration
  fetch() {
    ipc.invoke( 'fetch-collections' ).then( action( 'fetch-collections', ( data ) => {
      this.collections = data.collections.map( obj => Collection.fromPlain( this, obj ) );
      this.ready = true;
    } ) );
  }

  // Derivations
  has( name ) {
    return this.collections.some( c => c.name == name );
  }

  getCollection( name ) {
    return this.collections.find(c => c.name == name);
  }

  // Actions
  add( collection ) {
    collection.store = this;
    this.collections.push( collection );
  }

  addNew( name, sources = [] ) {
    if ( this.collections.some( c => c.name == name ) ) return false
    else {
      this.collections.push( new Collection( this, name, sources ) );
      return true;
    }
  }

  remove( name ) {
    this.collections = this.collections.filter( c => c.name != name );
  }

  // Cleanup
  dispose() {
    this.saveHandler();
  }
}
