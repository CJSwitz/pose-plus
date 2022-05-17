import { makeAutoObservable } from 'mobx';

import ImageManager from './image-manager.js';
import CountdownTimer from './countdown-timer.js';

/* Timer Params Object
{ mode: 'advanced', timers: [{ duration: int,  for: int }, ...] }
OR
{ mode: 'simple', duration: int }
*/

export default class PlayerSession {
  constructor( files, shuffle, timerParams, skipThreshold = 0.9 ) {
    // Immutable
    this.images = new ImageManager( files, shuffle );
    this.timerParams = timerParams;
    this.skipThreshold = skipThreshold;

    this.totalImages = 0;
    this.sessionLength = null;
    this.timer = null;

    // Avanced Mode Variables
    this.completed = 0; // Number completed for the current timer
    this.timerIndex = 0; // Index of current timer
    this.finished = false; // Flag indicating session is complete

    makeAutoObservable( this, {
      images: false,
      timerParams: false,
      skipThreshold: false,
    }, { autoBind: true } );

    if ( !timerParams ) {
      this.timer = null;
      this.totalImages = null;
    } else if ( timerParams.mode == 'simple' ) {
      this.timer = new CountdownTimer( timerParams.duration, this.cycle );
    } else {
      this.timer = new CountdownTimer( timerParams.timers[ 0 ].duration, this.cycle );
      this.sessionLength = timerParams.timers.map(t => t.for).reduce((a,b) => a + b, 0);
    }
  }

  // Actions

  cycle() {
    this.timer.dispose();
    const tp = this.timerParams;

    if ( tp.mode == 'advanced' ) {
      if ( ++this.completed >= tp.timers[ this.timerIndex ].for ) {
        if ( ++this.timerIndex >= tp.timers.length ) {
          this.finished = true;
          this.timer = null;
          return;
        } else {
          this.completed = 0;
        }
      }
    }

    this.totalImages++;
    this.images.next();
    this.reset();
  }

  reset() {
    this.timer.dispose();
    let tp = this.timerParams;
    if ( tp.mode == 'simple' ) {
      this.timer = new CountdownTimer( tp.duration, this.cycle );
    } else if ( tp.mode == 'advanced' ) {
      if ( this.finished ) {
        console.log('finito')
        this.timer = null;
      } // Turn off the timer once finished
      else this.timer = new CountdownTimer( tp.timers[ this.timerIndex ].duration, this.cycle );
    }
  }

  next() {
    const t = this.timer;
    if ( t ) {
      // If we're more than skipThreshold percent through the timer, count it as done
      if ( t.time / t.duration < this.skipThreshold ) this.cycle();
      else {
        this.images.next();
        this.reset();
      }
    } else this.images.next();
  }

  prev() {
    this.images.prev();
    if ( this.timer ) this.reset();
  }

  dispose() {
    if ( this.timer ) this.timer.dispose();
  }
}
