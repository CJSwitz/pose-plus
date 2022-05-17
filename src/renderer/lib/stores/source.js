import { makeAutoObservable, reaction, action } from 'mobx';
import { v4 as uuid } from 'uuid';

import ImageMetadata from './image-metadata.js';

export default class Source {
  constructor( store, id, type, path, label = '', count = null, entries = [] ) {
    this.store = store;
    this.id = id;
    this.type = type;
    this.label = label;
    this.count = count;
    this.path = path;
    this.entries = entries;
    this.status = 'unknown';

    makeAutoObservable( this, {
      id: false, // Immutable
      store: false, // Immutable
      saveHandler: false,
      dispose: false,
      addEntry: action, // Automatic annotation is derviation since it doesn't assign
    }, { autoBind: true } );

    this.saveHandler = reaction(
      () => this.asPlain, // Watch as observable
      obj => {
        this.store.persist();
      }
    )

    if ( count === null ) {
      this.fetchCount();
    } else {
      this.fetchStatus();
    }
  }

  // Factory functions
  static create( path, label, store ) {
    return new Source( store, uuid(), 'folder', path, label )
  }

  static fromPlain( store, obj ) {
    const { id, type, path, label, count, entries } = obj;
    return new Source( store, id, type, path, label, count, entries.map( en => ImageMetadata.fromPlain( en ) ) );
  }

  get asPlain() {
    return {
      id: this.id,
      type: this.type,
      path: this.path,
      label: this.label,
      count: this.count,
      entries: this.entries.map( en => en.asPlain )
    }
  }

  // Derived
  fetchInfo() {
    return ipc.invoke( 'read-folder', this.path )
      .then( ( items ) => items.map( ( item ) => {
        return {
          source: this.id,
          name: item,
          path: util.join( this.path, item ),
          url: encodeURI( 'source://' + this.id + '/' + item )
        }
      } ) );
  }

  getEntry( name ) {
    return this.entries.find( en => en.name == name );
  }


  // Actions
  setLabel( label ) {
    this.label = label;
    this.store.sort();
    return this;
  }

  setPath( path ) {
    this.path = path;
    this.store.sort();
    return this;
  }

  updatePath( path, count, status = 'ok' ) {
    this.path = path;
    this.count = count;
    this.status = status;
    this.store.sort();
    return this;
  }

  addEntry( entry ) {
    this.entries.push(entry);
  }

  // Async Actions
  fetchStatus() {
    ipc.invoke( 'check-folder', this.path ).then( action( ( res ) => {
      this.status = res ? 'ok' : 'error';
    } ) );
  }

  fetchCount() {
    ipc.invoke( 'count-folder', this.path ).then( action( ( res ) => {
      this.status = 'ok';
      this.count = res;
    } ), action( ( err ) => {
      this.status = 'error';
    } ) )
  }

  // Cleanup
  dispose() {
    this.saveHandler(); // Causes it to unsub, shouldn't be strictly neccesary
  }
}
