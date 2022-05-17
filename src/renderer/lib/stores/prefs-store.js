import { makeAutoObservable, reaction, action, observable } from 'mobx';
import Session from './session.js';

export default class PrefsStore {
  constructor( rootStore ) {
    this.rootStore = rootStore;
    this.prefs = {};
    this.ready = false;
    this.session = null;

    makeAutoObservable( this, {
      dispose: false,
      saveHandler: false,
      set: action,
      prefs: observable.shallow,
    }, { autoBind: true } );

    this.saveHandler = reaction(
      () => {
        let s = this.ready ? this.session.asPlain : null;
        if ( this.ready ) return { ...this.prefs, session: s };
      },
      ( data ) => {
        if ( this.ready ) ipc.send( 'update-prefs', data );
      }
    )

    this.fetch();
  }

  fetch() {
    ipc.invoke( 'fetch-prefs' ).then( action( 'fetch-prefs', ( data ) => {
      let { shuffle, timer, images } = data.session;
      delete data.session;
      this.prefs = data;
      this.session = new Session( this, shuffle, timer, images );
      this.ready = true;
    } ) );
  }

  set( key, val ) {
    this.prefs[ key ] = val;
  }

  dispose() {
    this.saveHandler();
  }
}
