import { makeAutoObservable, action } from 'mobx';

export default class CountdownTimer {
  constructor( duration, callback, paused = false ) {
    // Mutable
    this.time = duration;
    this.paused = paused;

    // Immutable
    this.duration = duration;
    this.callback = callback;

    makeAutoObservable( this, {
      duration: false,
      callback: false,
      interval: false,
    }, { autoBind: true } );


    this.interval = setInterval( this.tick, 1000 );
  }

  tick() {
    if ( !this.paused ) {
      this.time--;
      if ( this.time <= 0 ) {
        this.dispose();
        this.callback();
      }
    }
  }

  togglePause() {
    this.paused = !this.paused;
  }

  dispose() {
    clearInterval( this.interval );
  }
}
